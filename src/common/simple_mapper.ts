/* eslint-disable */
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

export abstract class SimpleMapper<L, R> {
  public mapToLeft(r: R): L | Promise<L> {
    throw new Error('not implemented');
  }

  public mapToRight(l: L): R | Promise<R> {
    throw new Error('not implemented');
  }
}
