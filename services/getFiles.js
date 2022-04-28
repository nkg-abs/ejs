import { Glob } from 'glob';

const getFiles = () => new Glob('', { mark: true, sync: true });

export default getFiles;
