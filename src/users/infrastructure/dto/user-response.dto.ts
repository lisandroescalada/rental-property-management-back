import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UserResponseDto {
    @ApiProperty({ example: 1 })
    id!: string // bigint se serializa como string

    @ApiProperty({ example: 'John Doe' })
    name!: string

    @ApiProperty({ example: 'john@example.com' })
    email!: string

    @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', nullable: true })
    email_verified_at!: Date | null

    @ApiPropertyOptional({ example: 'google', nullable: true })
    provider!: string | null

    @ApiProperty({ example: 1 })
    receive_notifications!: number

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    created_at!: Date | undefined

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updated_at!: Date | undefined
}

