import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    text!: string;

    @Column()
    userId!: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    createdAt!: string;
}
