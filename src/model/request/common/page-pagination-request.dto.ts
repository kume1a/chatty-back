import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PagePaginationRequestDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  page: number | undefined;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  pageSize: number;
}
