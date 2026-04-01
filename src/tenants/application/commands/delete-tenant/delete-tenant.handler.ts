import { Inject } from '@nestjs/common'
import { DeleteTenantCommand } from './delete-tenant.command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { TenantNotFoundError } from 'src/tenants/domain/excepcions/tenant-not-found.exception'
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from 'src/tenants/domain/repositories/tenant.repository'

@CommandHandler(DeleteTenantCommand)
export class DeleteTenantHandler implements ICommandHandler<DeleteTenantCommand> {
    constructor(
        @Inject(TENANT_REPOSITORY_TOKEN)
        private readonly tenantRepository: TenantRepository,
    ) {}

    async execute(command: DeleteTenantCommand): Promise<void> {
        const existing = await this.tenantRepository.findById(command.id)
        if (!existing) throw new TenantNotFoundError(command.id)

        await this.tenantRepository.delete(command.id)
    }
}
