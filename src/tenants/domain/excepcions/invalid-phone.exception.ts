export class InvalidPhoneException extends Error {
    constructor() {
        super('Tenant phone cannot be empty')
        this.name = 'InvalidPhoneException'
    }
}
