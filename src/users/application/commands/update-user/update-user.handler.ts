import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { UpdateUserCommand } from './update-user.command'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: UpdateUserCommand): Promise<void> {
        const existing = await this.userRepository.findById(command.id)
        if (!existing) throw new UserNotFoundError(command.id)

        const updated = existing.updateProfile({
            name: command.name,
            email: command.email,
            receive_notifications: command.receive_notifications,
        })

        await this.userRepository.update(command.id, updated)
    }
}

