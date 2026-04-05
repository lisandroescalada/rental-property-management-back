export class InvalidNameException extends Error {
    constructor() {
        super('Tenant name cannot be empty')
        this.name = 'InvalidNameException'
    }
}
