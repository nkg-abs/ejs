/* eslint-disable max-lines-per-function */
const {
	reduce, filter,
	map, find, length,
} = require('@laufire/utils/collection');
const { isIterable } = require('@laufire/utils/reflection');
const { properCase, camelCase } = require('../../../src/lib/templateManager');
const { parts } = require('@laufire/utils/path');
const { isCustomComponent } = require('../helpers');

const isService = ({ data: { value: service }, services }) =>
	services.includes(`${ service }.js`);

const isServiceExists = (context) => {
	const { data: { child: { props }}} = context;

	return find(props, (value) => isService({ ...context, data: { value }}));
};

const addSuffix = (componentName) => `${ componentName }Child`;

const findService = (acc, service) =>
	find(acc, ({ name: serviceName }) => service === serviceName);

const getComponentImports = (context) => {
	const { data: { child: { name, content }}} = context;

	return reduce(
		content, (acc, { name: childName, type }) => [
			...acc,
			{
				modulePath: isCustomComponent({ ...context, data: type }) ? `components/${ type }` : `./${ childName }`,
				name: `${ properCase(childName === name ? addSuffix(childName) : childName) }`,
			},
		], [],
	);
};

const getThemeImports = (context) => {
	const { config: { theme }, modules, imports } = context;
	const { data: { child: { type }}} = context;

	const modulePath = modules[theme].imports[type];

	const results = modulePath
		? [{
			modulePath: modulePath,
			name: properCase(type),
		}]
		: [];

	return { ...context, imports: [...imports, ...results] };
};

const getPropServices = (context) => {
	const { data: { child: { props }}, imports } = context;

	const results = reduce(
		props, (acc, value) => {
			const pathParts = parts(value).slice(1);
			const name = pathParts[pathParts.length - 1];

			return [
				...acc,
				...isService({ ...context, data: { value }})
					? [{
						modulePath: `services/${ value }`,
						name: findService(acc, name)
							? camelCase(value)
							: name,
						identifire: value,
					}]
					: [],
			];
		}, [],
	);

	return { ...context, imports: [...imports, ...results] };
};

const getContentService = (context) => {
	const { data: { child: { content }}, imports } = context;
	const pathParts = parts(content).slice(1);
	const name = pathParts[pathParts.length - 1];

	return find(imports, ({ identifire }) => name === identifire)
		? []
		: isService({ ...context, data: { value: content }})
			? [{
				modulePath: `services/${ content }`,
				name: name,
				identifire: content,
			}]
			:	[];
};

const getChildImports = (context) => {
	const { data: { child: { content }}, imports } = context;

	const results = isIterable(content)
		? getComponentImports(context)
		: getContentService(context);

	return { ...context, imports: [...imports, ...results] };
};

const getCustomImports = (context) => {
	const { data: { child: { type }}, imports } = context;

	return {
		...context,
		imports: [
			...imports, {
				modulePath: `components/${ type }`,
				name: properCase(type),
			},
		],
	};
};

const parentImport = (context) => {
	const { data: { child: { type }}} = context;

	return isCustomComponent({ ...context, data: type })
		? getCustomImports(context)
		: getThemeImports(context);
};

const getImports = (context) => reduce(
	[
		getPropServices,
		getChildImports,
		parentImport,
	], (acc, fn) => fn(acc), { ...context, imports: [] },
);

const getAlias = (context) => {
	const { data, imports } = context;
	const alias = find(imports, ({ identifire }) =>	identifire === data);

	return alias && alias.name;
};

const buildTextContent = (context) => {
	const { data: { child: { content }}} = context;
	const aliasName = getAlias({ ...context, data: content });

	return aliasName ? `{ ${ aliasName }(context) }` : content;
};

// eslint-disable-next-line complexity
const getContent = (context) => {
	const { data: { child, childCount }} = context;
	const { content, name } = child;

	return {
		textContent: childCount
			? ''
			: buildTextContent(context),
		children: childCount
			? {
				...filter(content, (config, childName) => childName !== name),
				...content[name] && {
					[addSuffix(name)]: {
						...content[name],
						name: addSuffix(name),
					},
				},
			}
			: {},
	};
};

const buildProps = (context) => {
	const { data: { child: { props }}} = context;

	return map(props, (value) => {
		const pathParts = parts(value);
		const leaf = pathParts[pathParts.length - 1];
		const aliasName = getAlias({ ...context, data: value });

		return aliasName
			? `${ aliasName }(context)`
			: Number(leaf) ? `${ leaf }` : `'${ leaf }'`;
	});
};

const getData = (context) => {
	const { data: { child }, config: { theme }} = context;
	const { modules, data } = context;
	const { content, props, name, type } = child;
	const childCount = isIterable(content) ? length(content) : 0;
	const builtContext = getImports(context);

	return {
		childCount: childCount,
		...builtContext,
		propCount: length(props),
		usesContext: Boolean(childCount) || isServiceExists(context),
		componentName: properCase(name),
		type: modules[theme].imports[type] ? properCase(type) : type,
		...getContent({ ...builtContext, data: { ...data, childCount }}),
		props: buildProps(builtContext),
	};
};

module.exports = getData;
