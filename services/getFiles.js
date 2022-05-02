import { Glob } from 'glob';

const getFiles = () => new Glob('.js', { mark: true, sync: true });

export default getFiles;
