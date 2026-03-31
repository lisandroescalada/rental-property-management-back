import { Inject } from "@nestjs/common"
import { CreateTenantCommand } from "./create-tenant.command"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { Tenant } from "src/tenants/domain/entities/tetant.entity"
import { TENANT_REPOSITORY_TOKEN, TenantRepository } from "src/tenants/domain/repositories/tenat.repository"

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
            userId: command.userId ?? null
        })
        await this.tenantRepository.save(tenant)
    }
}
