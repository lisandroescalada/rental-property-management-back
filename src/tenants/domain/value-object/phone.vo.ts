import { InvalidPhoneException } from '../excepcions/invalid-phone.exception'

export class Phone {
    private constructor(public readonly value: string) {}

    static create(phone: string): Phone {
        if (!phone.trim()) throw new InvalidPhoneException()
        return new Phone(phone)
    }
}
