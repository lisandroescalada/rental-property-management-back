import { Query } from '@nestjs/cqrs'
import { PaginatedResponseDto } from 'src/users/infrastructure/dto/paginated-response.dto'
import { UserResponseDto } from 'src/users/infrastructure/dto/user-response.dto'

export class FindAllUsersQuery extends Query<PaginatedResponseDto<UserResponseDto>> {
    constructor(
        public readonly page: number,
        public readonly limit: number,
    ) {
        super()
    }
}

