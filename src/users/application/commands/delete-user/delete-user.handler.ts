import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { DeleteUserCommand } from './delete-user.command'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: DeleteUserCommand): Promise<void> {
        const existing = await this.userRepository.findById(command.id)
        if (!existing) throw new UserNotFoundError(command.id)

        await this.userRepository.delete(command.id)
    }
}

