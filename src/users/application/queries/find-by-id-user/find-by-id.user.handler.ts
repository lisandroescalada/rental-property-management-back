import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Inject } from "@nestjs/common"
import { FindByIdUserQuery } from "./find-by-id.user.query"
import { UserNotFoundError } from "src/users/domain/errors/user-not-found.error"
import { User } from "src/users/domain/entities/user.entity"
import { UserRepository } from "src/users/domain/repositories/user.repository"
import { USER_REPOSITORY_TOKEN } from "src/users/domain/repositories/user.repository.token"

@QueryHandler(FindByIdUserQuery)
export class FindByIdUserHandler implements IQueryHandler<FindByIdUserQuery, User> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository
    ) {}

    async execute(query: FindByIdUserQuery): Promise<User> {
        const user = await this.userRepository.findById(query.userId)

        if (!user) throw new UserNotFoundError(`User with id ${query.userId} not found`)

        return user
    }
}
