import { ApiProperty } from '@nestjs/swagger'

export class TenantResponseDto {
    @ApiProperty({ example: 1 })
    id!: string // bigint se serializa como string

    @ApiProperty({ example: 'John Doe' })
    name!: string

    @ApiProperty({ example: '604161117' })
    phone!: string

    @ApiProperty({ example: '12345678' })
    dni!: string

    @ApiProperty({ example: '1970-01-01' })
    birthdate!: string

    @ApiProperty()
    observations?: string | undefined

    @ApiProperty({ example: '3' })
    userId?: string | undefined

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    created_at!: Date | undefined

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
    updated_at!: Date | undefined
}
