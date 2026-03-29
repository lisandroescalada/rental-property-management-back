import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Inject } from "@nestjs/common"
import { FindByIdUserQuery } from "./find-by-id.user.query"
import { UserNotFoundError } from "src/users/domain/errors/user-not-found.error"
import { UserRepository } from "src/users/domain/repositories/user.repository"
import { USER_REPOSITORY_TOKEN } from "src/users/domain/repositories/user.repository.token"
import { UserAssembler } from "src/users/infrastructure/assemblers/user.assembler"
import { UserResponseDto } from "src/users/infrastructure/dto/user-response.dto"

@QueryHandler(FindByIdUserQuery)
export class FindByIdUserHandler implements IQueryHandler<FindByIdUserQuery, UserResponseDto> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository
    ) {}

    async execute(query: FindByIdUserQuery): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(query.userId)

        if (!user) throw new UserNotFoundError(query.userId)

        return UserAssembler.toDto(user)
    }
}
