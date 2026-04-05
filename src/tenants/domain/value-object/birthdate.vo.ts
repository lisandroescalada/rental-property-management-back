import { InvalidBirthdateException } from '../excepcions/invalid-birthdate.exception'

export class Birthdate {
    private constructor(public readonly value: string) {}

    static create(birthdate: string): Birthdate {
        if (!birthdate.trim()) throw new InvalidBirthdateException()
        return new Birthdate(birthdate)
    }
}
