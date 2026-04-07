import { Tenant } from 'src/tenants/domain/entities/tenant.entity'
import { TenantRepository } from 'src/tenants/domain/repositories/tenant.repository'

export class InMemoryTenantsRepository implements TenantRepository {
    private readonly store = new Map<bigint, Tenant>()
    private nextId = 1n

    async findAll(pagination: { page: number, limit: number }): Promise<Tenant[]> {
        const all = Array.from(this.store.values())
        const { page, limit } = pagination
        return all.slice((page - 1) * limit, page * limit)
    }

    async count(): Promise<number> {
        return this.store.size
    }

    async findById(id: bigint): Promise<Tenant | null> {
        return this.store.get(id) ?? null
    }

    async save(tenant: Tenant): Promise<void> {
        const id = this.nextId++
        // Rehidrata con el id asignado (simula el AUTO_INCREMENT de la BD)
        const persisted = Tenant.reconstitute(
            id,
            tenant.name.value,
            tenant.phone.value,
            tenant.dni.value,
            tenant.birthdate.value,
            tenant.observations?.value,
            tenant.userId,
            new Date(),
            new Date()
        )
        this.store.set(id, persisted)
    }

    async update(id: bigint, tenant: Tenant): Promise<void> {
        if (!this.store.has(id)) return
        const existing = this.store.get(id)!
        const updated = Tenant.reconstitute(
            id,
            tenant.name?.value ?? existing.name.value,
            tenant.phone?.value ?? existing.phone.value, 
            tenant.dni?.value ?? existing.dni.value, 
            tenant.birthdate?.value ?? existing.birthdate.value,
            tenant.observations?.value ?? existing.observations?.value,
            tenant.userId ?? existing.userId,
            existing.created_at,
            new Date()
        )
        this.store.set(id, updated)
    }

    async delete(id: bigint): Promise<void> {
        this.store.delete(id)
    }

    /** Helper exclusivo para tests: limpia el store entre casos de prueba. */
    clear(): void {
        this.store.clear()
        this.nextId = 1n
    }
}
