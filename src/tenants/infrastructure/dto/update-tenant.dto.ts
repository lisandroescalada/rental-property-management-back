import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateTenantDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name?: string

    @ApiPropertyOptional({ example: '604161117' })
    @IsOptional()
    @IsString({ message: 'Phone number must be valid.' })
    phone?: string

    @ApiPropertyOptional({ example: '2006-06-15' })
    @IsOptional()
    @IsDateString()
    birthdate?: string
}
