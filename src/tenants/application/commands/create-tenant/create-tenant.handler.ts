import { Inject } from "@nestjs/common"
import { CreateTenantCommand } from "./create-tenant.command"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { Tenant } from "src/tenants/domain/entities/tenant.entity"
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from "src/tenants/domain/repositories/tenant.repository"

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand> {
    constructor(
        @Inject(TENANT_REPOSITORY_TOKEN)
        private readonly tenantRepository: TenantRepository,
    ) {}

    async execute(command: CreateTenantCommand): Promise<void> {
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
