import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { CreateUserCommand } from './create-user.command'
import { User } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'
import { UserAlreadyExistsError } from 'src/users/domain/errors/user-already-exists.error'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(
        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: CreateUserCommand): Promise<void> {
        const existing = await this.userRepository.findByEmail(command.email)
        if (existing) throw new UserAlreadyExistsError(command.email)

        const user = User.create({
            name: command.name,
            email: command.email,
            hashedPassword: command.password,
            provider: command.provider,
            receive_notifications: command.receive_notifications,
        })

        await this.userRepository.save(user)
    }
}

