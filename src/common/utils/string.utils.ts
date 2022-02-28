import { sep } from 'path';

export const getFileName = (filePath: string | undefined) => {
  if (!filePath) {
    return undefined;
  }

  const split = filePath.split(sep);
  if (split.length < 2) {
    return filePath;
  }

  return split[split.length - 1];
};
