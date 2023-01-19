import { Entity, OneToMany } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { Film } from './film'

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
    language_id: number

  @Column()
    name: string

  @Column()
    last_update: Date

  @OneToMany('Film', 'language')
    films: Film[]
}
