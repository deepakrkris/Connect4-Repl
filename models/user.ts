import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    username: string

    @Column()
    numberOfGames: number

    @Column()
    wins: number
}
