// noinspection JSUnusedGlobalSymbols

import { Transform, TransformFnParams } from 'class-transformer';
import * as _ from 'lodash';

export function Trim() {
  return Transform((value: TransformFnParams) => {
    if (_.isArray(value)) {
      return value.value.map((v) => _.trim(v).replace(/\s\s+/g, ' '));
    }
    return _.trim(value).replace(/\s\s+/g, ' ');
  });
}

export function ToInt() {
  return Transform((params: TransformFnParams) => parseInt(params.value, 10), {
    toClassOnly: true,
  });
}

export function ToArray(): (target: any, key: string) => void {
  return Transform(
    (value: TransformFnParams) => {
      if (_.isNil(value)) {
        return [];
      }
      return _.castArray(value);
    },
    { toClassOnly: true },
  );
}
