export class PaginatedResponseDto<T> {
  constructor(readonly data: T[], readonly count: number) {}
}
