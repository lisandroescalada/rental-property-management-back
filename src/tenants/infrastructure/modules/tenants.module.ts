import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TenantOrmEntity } from '../persistence/tenant.orm-entity'
import { TenantsController } from '../controllers/tenants.controller'
import { UsersModule } from 'src/users/infrastructure/modules/users.module'
import { MySqlTenantsRepository } from '../persistence/my-sql.tenants.repository'
import { TENANT_REPOSITORY_TOKEN } from 'src/tenants/domain/repositories/tenant.repository'
import { CreateTenantHandler } from 'src/tenants/application/commands/create-tenant/create-tenant.handler'
import { UpdateTenantHandler } from 'src/tenants/application/commands/update-tenant/update-tenant.handler'
import { DeleteTenantHandler } from 'src/tenants/application/commands/delete-tenant/delete-tenant.handler'
import { FindAllTenantsHandler } from 'src/tenants/application/queries/find-all-tenant/find-all.tenants.handler'
import { FindByIdTenantHandler } from 'src/tenants/application/queries/find-by-id-tenant/find-by-id.tenant.handler'

const QueryHandlers = [FindByIdTenantHandler, FindAllTenantsHandler]
const CommandHandlers = [CreateTenantHandler, UpdateTenantHandler, DeleteTenantHandler]

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([TenantOrmEntity]),
        UsersModule
    ],
    controllers: [TenantsController],
    providers: [
        ...QueryHandlers,
        ...CommandHandlers,
        {
            provide: TENANT_REPOSITORY_TOKEN,
            useClass: MySqlTenantsRepository
        },
    ],
    exports: [TENANT_REPOSITORY_TOKEN]
})
export class TenantsModule {}
