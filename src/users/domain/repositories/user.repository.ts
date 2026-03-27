import { User } from "../entities/user.entity"

export interface UserRepository {
    findAll(pagination: { page: number, limit: number }): Promise<User[]>
    findById(id: bigint): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    save(user: User): Promise<void>
    update(id: bigint, user: User): Promise<void>
    delete(id: bigint): Promise<void>
}
