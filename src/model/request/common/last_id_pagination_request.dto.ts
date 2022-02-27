import { IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class LastIdPaginationRequestDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  lastId: number | undefined;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  takeCount: number;
}
