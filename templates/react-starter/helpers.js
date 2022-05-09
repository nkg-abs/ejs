const isCustomComponent = ({ components, data }) =>
	components.includes(`${ data }.js`);

module.exports = {
	isCustomComponent,
};
