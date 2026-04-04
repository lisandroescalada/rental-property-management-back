export class InvalidBirthdateException extends Error {
    constructor() {
        super('Tenant birthdate cannot be empty')
        this.name = 'InvalidBirthdateException'
    }
}
