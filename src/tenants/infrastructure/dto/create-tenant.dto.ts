import { Transform } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTenantDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ example: '+1234567890' })
    @IsString()
    @IsNotEmpty()
    phone!: string

    @ApiProperty({ example: '12345678' })
    @IsString()
    @IsNotEmpty()
    dni!: string

    @ApiProperty({ example: '1970-01-01' })
    @IsDateString()
    birthdate!: string

    @ApiProperty({ example: 'Tenant observations' })
    @IsOptional()
    @IsString()
    observations?: string | undefined

    @ApiPropertyOptional({ example: '3' })
    @IsOptional()
    @Transform(({ value }) => value ? BigInt(value) : undefined)
    userId?: bigint
}
