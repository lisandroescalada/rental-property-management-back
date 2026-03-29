import { User } from 'src/users/domain/entities/user.entity'
import { UserResponseDto } from '../dto/user-response.dto'
import { PaginatedResponseDto } from '../dto/paginated-response.dto'

export class UserAssembler {
    static toDto(user: User): UserResponseDto {
        const dto = new UserResponseDto()
        dto.id                  = user.id.toString()
        dto.name                = user.name
        dto.email               = user.email
        dto.email_verified_at   = user.email_verified_at ?? null
        dto.provider            = user.provider ?? null
        dto.receive_notifications = user.receive_notifications ?? 1
        dto.created_at          = user.created_at
        dto.updated_at          = user.updated_at
        return dto
    }

    static toPaginatedDto(
        users: User[],
        total: number,
        page: number,
        limit: number,
    ): PaginatedResponseDto<UserResponseDto> {
        const dto = new PaginatedResponseDto<UserResponseDto>()
        dto.data       = users.map(UserAssembler.toDto)
        dto.total      = total
        dto.page       = page
        dto.limit      = limit
        dto.totalPages = Math.ceil(total / limit)
        return dto
    }
}

