export class TenantNotFoundexception extends Error {
    constructor(id: bigint) {
        super(`Tenant with id '${id}' not found`)
        this.name = 'TenantNotFoundexception'
    }
}
