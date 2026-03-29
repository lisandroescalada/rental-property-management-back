import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class UserOrmEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
    id!: bigint

    @Column({ type: 'varchar', length: 255 })
    name!: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string

    @Column({ type: 'varchar', length: 255 })
    password!: string

    @Column({ type: 'timestamp', nullable: true, default: null })
    email_verified_at!: Date | null

    @Column({ type: 'json', nullable: true, default: null })
    settings!: object | null

    @Column({ type: 'varchar', length: 50, nullable: true, default: null })
    provider!: string | null

    @Column({ type: 'tinyint', default: 1 })
    receive_notifications!: number

    @Column({ type: 'timestamp', nullable: true, default: null })
    password_change_required_at!: Date | null

    @Column({ type: 'varchar', length: 100, nullable: true, default: null })
    remember_token!: string | null

    @CreateDateColumn({ type: 'timestamp' })
    created_at!: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at!: Date
}

