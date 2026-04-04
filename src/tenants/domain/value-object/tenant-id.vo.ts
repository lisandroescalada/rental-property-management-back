import { randomUUID } from 'crypto'
import { InvalidTenantIdException } from '../excepcions/invalid-tenant-id.exception'

export class TenantId {
    private constructor(public readonly value: string) {}

    static generate(): TenantId {
        return new TenantId(randomUUID())
    }

    static fromDatabase(id: bigint): TenantId {
        return new TenantId(id.toString())
    }

    static create(value: string): TenantId {
        if (!value.trim()) throw new InvalidTenantIdException()
        return new TenantId(value)
    }

    toBigInt(): bigint {
        if (!/^[0-9]+$/.test(this.value)) {
            throw new Error('TenantId cannot be converted to bigint unless it was loaded from the database')
        }
        return BigInt(this.value)
    }

    toString(): string {
        return this.value
    }
}
