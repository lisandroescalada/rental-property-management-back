import { Inject } from '@nestjs/common'
import { UpdateTenantCommand } from './update-tenant.command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { TenantNotFoundexception } from 'src/tenants/domain/excepcions/tenant-not-found.exception'
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from 'src/tenants/domain/repositories/tenant.repository'

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand> {
    constructor(
        @Inject(TENANT_REPOSITORY_TOKEN)
        private readonly tenantRepository: TenantRepository,
    ) {}

    async execute(command: UpdateTenantCommand): Promise<void> {
        const existing = await this.tenantRepository.findById(command.id)

        if (!existing) throw new TenantNotFoundexception(command.id)

        const updated = existing.updateProfile({
            name: command.name ?? existing.name.value,
            phone: command.phone ?? existing.phone.value,
            dni: command.dni ?? existing.dni.value,
            birthdate: command.birthdate ?? existing.birthdate.value,
            observations: command.observations ?? existing.observations?.value
        })

        await this.tenantRepository.update(command.id, updated)
    }
}
