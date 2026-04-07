import { Inject } from '@nestjs/common'
import { CreateTenantCommand } from './create-tenant.command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Tenant } from 'src/tenants/domain/entities/tenant.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'
import { UserNotFoundError } from 'src/users/domain/errors/user-not-found.error'
import { USER_REPOSITORY_TOKEN } from 'src/users/domain/repositories/user.repository.token'
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from 'src/tenants/domain/repositories/tenant.repository'

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand> {
    constructor(
        @Inject(TENANT_REPOSITORY_TOKEN)
        private readonly tenantRepository: TenantRepository,

        @Inject(USER_REPOSITORY_TOKEN)
        private readonly userRepository: UserRepository,
    ) {}

    async execute(command: CreateTenantCommand): Promise<void> {
        if (command.userId) {
            const user = await this.userRepository.findById(command.userId)
            if (!user) throw new UserNotFoundError(command.userId)
        }

        const tenant = Tenant.create({
            name: command.name,
            phone: command.phone,
            dni: command.dni,
            birthdate: command.birthdate,
            observations: command.observations,
            userId: command.userId
        })
        await this.tenantRepository.save(tenant)
    }
}
