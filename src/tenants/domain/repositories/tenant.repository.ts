import { Tenant } from '../entities/tenant.entity'

export interface TenantRepository {
    findAll(pagination: { page: number, limit: number }): Promise<Tenant[]>
    count(): Promise<number>
    findById(id: bigint): Promise<Tenant | null>
    save(tenant: Tenant): Promise<void>
    update(id: bigint, tenant: Tenant): Promise<void>
    delete(id: bigint): Promise<void>
}

export const TENANT_REPOSITORY_TOKEN = Symbol('TenantRepository')
