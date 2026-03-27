import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { FindAllUsersQuery } from './find-all.users.query'
import { User } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'

@QueryHandler(FindAllUsersQuery)
export class FindAllUsersHandler implements IQueryHandler<FindAllUsersQuery, User[]> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(query: FindAllUsersQuery): Promise<User[]> {
        return this.userRepository.findAll({
            page: query.page,
            limit: query.limit,
        })
    }
}

