import { Entity, PrimaryColumn, Column, BaseEntity, UpdateDateColumn, CreateDateColumn } from "typeorm"

@Entity()
export class Game extends BaseEntity {
    @PrimaryColumn()
    id: string

    @Column()
    status: string

    @Column()
    user1: string

    @Column()
    user2: string

    @Column()
    user1_coin: string

    @Column('varchar', {nullable: true})
    user2_coin: string

    @Column()
    data: string

    @Column('varchar', {nullable: true})
    winner: string

    @UpdateDateColumn()
    updated_at: Date

    @CreateDateColumn()
    created_at: Date
}
