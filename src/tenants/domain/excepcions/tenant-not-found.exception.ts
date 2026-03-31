export class TenantNotFoundError extends Error {
    constructor(id: bigint) {
        super(`Tenant with id '${id}' not found`)
        this.name = 'TenantNotFoundError'
        this.stack = '404'
    }
}
