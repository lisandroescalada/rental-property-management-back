import { IsEmail, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    name?: string

    @ApiPropertyOptional({ example: 'newemail@example.com' })
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt()
    @Min(0)
    receive_notifications?: number
}
