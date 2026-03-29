import { User } from 'src/users/domain/entities/user.entity'
import { UserRepository } from 'src/users/domain/repositories/user.repository'

export class InMemoryUsersRepository implements UserRepository {
    private readonly store = new Map<bigint, User>()
    private nextId = 1n

    async findAll(pagination: { page: number; limit: number }): Promise<User[]> {
        const all = Array.from(this.store.values())
        const { page, limit } = pagination
        return all.slice((page - 1) * limit, page * limit)
    }

    async count(): Promise<number> {
        return this.store.size
    }

    async findById(id: bigint): Promise<User | null> {
        return this.store.get(id) ?? null
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.store.values()) {
            if (user.email === email.toLowerCase().trim()) return user
        }
        return null
    }

    async save(user: User): Promise<void> {
        const id = this.nextId++
        // Rehidrata con el id asignado (simula el AUTO_INCREMENT de la BD)
        const persisted = User.reconstitute(
            id,
            user.name,
            user.email,
            user.password,
            user.email_verified_at,
            user.settings,
            user.provider,
            user.receive_notifications,
            user.password_change_required_at,
            user.remember_token,
            new Date(),
            new Date(),
        )
        this.store.set(id, persisted)
    }

    async update(id: bigint, user: User): Promise<void> {
        if (!this.store.has(id)) return
        const existing = this.store.get(id)!
        const updated = User.reconstitute(
            id,
            user.name ?? existing.name,
            user.email ?? existing.email,
            user.password ?? existing.password,
            user.email_verified_at ?? existing.email_verified_at,
            user.settings ?? existing.settings,
            user.provider ?? existing.provider,
            user.receive_notifications ?? existing.receive_notifications,
            user.password_change_required_at ?? existing.password_change_required_at,
            user.remember_token ?? existing.remember_token,
            existing.created_at,
            new Date(),
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

