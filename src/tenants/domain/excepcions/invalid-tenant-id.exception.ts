export class InvalidTenantIdException extends Error {
    constructor() {
        super('Tenant ID cannot be empty')
        this.name = 'InvalidTenantIdException'
    }
}
