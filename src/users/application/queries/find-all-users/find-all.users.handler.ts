import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { FindAllUsersQuery } from './find-all.users.query'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'
import { UserAssembler } from 'src/users/infrastructure/assemblers/user.assembler'
import { PaginatedResponseDto } from 'src/users/infrastructure/dto/paginated-response.dto'
import { UserResponseDto } from 'src/users/infrastructure/dto/user-response.dto'

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery, PaginatedResponseDto<UserResponseDto>> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(query: FindAllUsersQuery): Promise<PaginatedResponseDto<UserResponseDto>> {
        const [users, total] = await Promise.all([
            this.userRepository.findAll({ page: query.page, limit: query.limit }),
            this.userRepository.count(),
        ])

        return UserAssembler.toPaginatedDto(users, total, query.page, query.limit)
    }
}

