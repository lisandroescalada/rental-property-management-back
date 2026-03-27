import { User } from 'src/users/domain/entities/user.entity'

describe('User — domain entity', () => {
    describe('User.create()', () => {
        it('creates a valid user with correct data', () => {
            const user = User.create({
                name: 'Adrian García',
                email: 'ADRIAN@EXAMPLE.COM',
                hashedPassword: 'hashed_password_123',
            })

            expect(user.id).toBe(0n)
            expect(user.name).toBe('Adrian García')
            expect(user.email).toBe('adrian@example.com') // normalized to lowercase
            expect(user.password).toBe('hashed_password_123')
            expect(user.receive_notifications).toBe(1)
            expect(user.isEmailVerified).toBe(false)
        })

        it('normalizes email to lowercase and trims whitespace', () => {
            const user = User.create({
                name: 'Test',
                email: '  UPPER@EXAMPLE.COM  ',
                hashedPassword: 'pass',
            })
            expect(user.email).toBe('upper@example.com')
        })

        it('throws an error if name is empty', () => {
            expect(() =>
                User.create({ name: '   ', email: 'a@b.com', hashedPassword: 'pass' })
            ).toThrow('User name cannot be empty')
        })

        it('throws an error if email does not contain @', () => {
            expect(() =>
                User.create({ name: 'Test', email: 'not-an-email', hashedPassword: 'pass' })
            ).toThrow('User email is invalid')
        })

        it('throws an error if password is empty', () => {
            expect(() =>
                User.create({ name: 'Test', email: 'a@b.com', hashedPassword: '' })
            ).toThrow('User password cannot be empty')
        })

        it('respects the receive_notifications value when explicitly provided', () => {
            const user = User.create({
                name: 'Test',
                email: 'a@b.com',
                hashedPassword: 'pass',
                receive_notifications: 0,
            })
            expect(user.receive_notifications).toBe(0)
        })
    })

    describe('User.reconstitute()', () => {
        it('rehydrates all fields without running business invariants', () => {
            const createdAt = new Date('2024-01-01')
            const user = User.reconstitute(
                42n,
                'Adrian',
                'adrian@example.com',
                'hashed',
                undefined,
                undefined,
                'google',
                1,
                undefined,
                undefined,
                createdAt,
                createdAt,
            )

            expect(user.id).toBe(42n)
            expect(user.provider).toBe('google')
            expect(user.created_at).toBe(createdAt)
        })
    })

    describe('isEmailVerified', () => {
        it('returns false when email_verified_at is undefined', () => {
            const user = User.create({ name: 'Test', email: 'a@b.com', hashedPassword: 'pass' })
            expect(user.isEmailVerified).toBe(false)
        })

        it('returns true when email_verified_at has a date', () => {
            const user = User.reconstitute(1n, 'Test', 'a@b.com', 'pass', new Date())
            expect(user.isEmailVerified).toBe(true)
        })
    })

    describe('verifyEmail()', () => {
        it('returns a new instance with email_verified_at set', () => {
            const user = User.create({ name: 'Test', email: 'a@b.com', hashedPassword: 'pass' })
            const verifiedAt = new Date('2024-06-01')
            const verified = user.verifyEmail(verifiedAt)

            // Immutability: original instance is unchanged
            expect(user.isEmailVerified).toBe(false)
            // New instance has the email verified
            expect(verified.isEmailVerified).toBe(true)
            expect(verified.email_verified_at).toBe(verifiedAt)
        })
    })
})
