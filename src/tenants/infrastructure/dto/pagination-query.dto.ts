import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsPositive } from 'class-validator'

export class PaginationQueryDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page: number = 1

    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    limit: number = 10
}
