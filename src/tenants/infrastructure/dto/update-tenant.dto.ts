import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'

export class UpdateTenantDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name?: string

    @ApiPropertyOptional({ example: '604161117' })
    @IsOptional()
    @IsPhoneNumber('IN', { message: 'Phone number must be a valid Argentine phone number' })
    phone?: string

    @ApiPropertyOptional({ example: '12345678' })
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'DNI must be at least 8 characters' })
    dni?: string

    @ApiPropertyOptional({ example: '2006-06-15' })
    @IsOptional()
    @IsDateString()
    birthdate?: string

    @ApiPropertyOptional({ example: 'Tenant observations' })
    @IsOptional()
    @IsString()
    observations?: string
}
