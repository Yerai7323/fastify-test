import { Entity, ManyToMany } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { Film } from './film'

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
    actor_id: number

  @Column()
    first_name: string

  @Column()
    last_name: string

  @Column()
    last_update: string

  @ManyToMany('Film', 'actors')
    films: Film[]
}
