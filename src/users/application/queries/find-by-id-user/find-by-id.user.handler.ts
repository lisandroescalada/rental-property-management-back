import { QueryHandler } from "@nestjs/cqrs"
import { FindByIdUserQuery } from "./find-by-id.user.query"
import { UserNotFoundError } from "src/users/domain/errors/user-not-found.error"
import { User } from "src/users/domain/entities/user.entity"
import { UserRepository } from "src/users/domain/repositories/user.repository"

interface IQueryHandler<FindByIdQuery> {
    execute(query: FindByIdQuery): Promise<User | null>
}

QueryHandler(FindByIdUserQuery)
export class FindByIdUserHandler implements IQueryHandler<FindByIdUserQuery> {
    constructor(private UserRepository: UserRepository) {}

    execute(query: FindByIdUserQuery): Promise<User | null> {
        const user = this.UserRepository.findById(query.userId)

        if (!user) throw new UserNotFoundError('User not found')
        
        return user
    }
}
