export class InvalidDniException extends Error {
    constructor() {
        super('Tenant DNI cannot be empty')
        this.name = 'InvalidDniException'
    }
}