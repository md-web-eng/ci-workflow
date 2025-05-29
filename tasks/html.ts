import fs from 'fs';
import path, { resolve } from 'path';

interface File {
  name: string;
  path: string;
}
interface InputFile {
  [key: string]: string;
}

const inputFiles: InputFile = {};
const files: File[] = [];
export const readHtml = (dirPath: fs.PathLike): InputFile => {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const itemPath = path.join(dirPath as string, item);
    if (fs.statSync(itemPath).isDirectory()) {
      // componentsディレクトリを除外する
      if (item !== 'components') {
        readHtml(itemPath);
      }
    } else {
      // // htmlファイル以外を除外する
      if (path.extname(itemPath) !== '.html') {
        // eslint-disable-next-line no-continue
        continue;
      }
      // nameを決定する
      let name;
      if (dirPath === path.resolve(__dirname, 'src/html')) {
        name = path.parse(itemPath).name;
      } else {
        const relativePath = path.relative(
          path.resolve(__dirname, 'src/html'),
          dirPath as string
        );
        const dirName = relativePath.replace(/\//g, '_');
        name = `${dirName}_${path.parse(itemPath).name}`;
      }
      // pathを決定する
      const relativePath = path.relative(
        path.resolve(__dirname, 'src/html'),
        itemPath
      );
      const filePath = `/${relativePath}`;
      files.push({ name, path: filePath });
    }
  }

  files.forEach((file: File) => {
    inputFiles[file.name] = resolve(__dirname, `./src/html${file.path}`);
  });

  return inputFiles;
};
