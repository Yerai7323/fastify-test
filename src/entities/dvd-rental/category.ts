import { Entity, ManyToMany } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { Film } from './film'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
    category_id: number

  @Column()
    name: string

  @Column()
    last_update: Date

  @ManyToMany('Film', 'categories')
    films: Film[]
}
