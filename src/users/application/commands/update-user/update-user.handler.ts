import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { UpdateUserCommand } from './update-user.command'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'
import { User } from 'src/users/domain/entities/user.entity'

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: UpdateUserCommand): Promise<void> {
        const existing = await this.userRepository.findById(command.id)
        if (!existing) throw new UserNotFoundError(`User with id ${command.id} not found`)

        const updated = User.reconstitute(
            existing.id,
            command.name ?? existing.name,
            command.email ?? existing.email,
            existing.password,
            existing.email_verified_at,
            existing.settings,
            existing.provider,
            command.receive_notifications ?? existing.receive_notifications,
            existing.password_change_required_at,
            existing.remember_token,
            existing.created_at,
            new Date(),
        )

        await this.userRepository.update(command.id, updated)
    }
}

