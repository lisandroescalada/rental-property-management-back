import { User } from 'src/users/domain/entities/user.entity'
import { UserOrmEntity } from './user.orm-entity'

export class UserMapper {
    static toDomain(ormEntity: UserOrmEntity): User {
        return User.reconstitute(
            ormEntity.id,
            ormEntity.name,
            ormEntity.email,
            ormEntity.password,
            ormEntity.email_verified_at ?? undefined,
            ormEntity.settings ?? undefined,
            ormEntity.provider ?? undefined,
            ormEntity.receive_notifications,
            ormEntity.password_change_required_at ?? undefined,
            ormEntity.remember_token ?? undefined,
            ormEntity.created_at,
            ormEntity.updated_at,
        )
    }

    static toPersistence(user: User): Partial<UserOrmEntity> {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            email_verified_at: user.email_verified_at ?? null,
            settings: user.settings ?? null,
            provider: user.provider ?? null,
            receive_notifications: user.receive_notifications ?? 1,
            password_change_required_at: user.password_change_required_at ?? null,
            remember_token: user.remember_token ?? null,
        }
    }
}

