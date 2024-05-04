import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PaginationQuery {
  @ApiProperty({
    minimum: 1,
    title: 'Page',
    exclusiveMaximum: true,
    exclusiveMinimum: true,
    default: 1,
    type: 'integer',
    required: false,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({
    minimum: 10,
    maximum: 50,
    title: 'Limit',
    default: 10,
    type: 'integer',
    required: false,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @Transform(({ value }) => (value > 50 ? 50 : value))
  @Transform(({ value }) => (value < 10 ? 10 : value))
  @IsInt()
  @Min(10)
  @Max(50)
  limit = 10;
}
