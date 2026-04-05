import { InvalidNameException } from '../excepcions/invalid-name.exception'

export class Name {
    private constructor(public readonly value: string) {}

    static create(name: string): Name {
        if (!name.trim()) throw new InvalidNameException()
        return new Name(name)
    }
}
