import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('tenants')
export class TenantOrmEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: bigint

    @Column()
    name!: string

    @Column()
    phone!: string

    @Column()
    dni!: string

    @Column({ type: 'date' })
    birthdate!: string

    @Column({ type: 'text', nullable: true })
    observations!: string | null

    @Column({ name: 'user_id', type: 'bigint', unsigned: true, nullable: true })
    userId!: bigint | null

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at!: Date
}
