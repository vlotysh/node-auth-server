import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity({name: "users"})
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: number;
}
