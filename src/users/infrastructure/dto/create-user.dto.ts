import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name!: string

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email!: string

    @ApiProperty({ example: 'SecurePass123!' })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password!: string

    @ApiPropertyOptional({ example: 'google' })
    @IsOptional()
    @IsString()
    provider?: string

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    @Min(0)
    receive_notifications?: number
}
