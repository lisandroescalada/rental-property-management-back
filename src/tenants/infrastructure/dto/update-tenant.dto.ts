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
    @IsPhoneNumber('ES', { message: 'Phone number must be a valid Spanish phone number'  })
    phone?: string

    @ApiPropertyOptional({ example: '2006-06-15' })
    @IsOptional()
    @IsDateString()
    birthdate?: string
}
