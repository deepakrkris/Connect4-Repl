import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    userId: string

    @Column()
    number_of_games: number

    @Column()
    wins: number
}
