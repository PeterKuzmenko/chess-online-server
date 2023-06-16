import path from 'path';

export const rootDirectory = path.dirname(__dirname);

export const staticDirectory = path.join(rootDirectory, 'static');
export const publicDirectory = path.resolve(rootDirectory, '..', 'public');
