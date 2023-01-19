import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { mpaa_rating } from '../../utils/enum/mpaa_rating'
import { Language } from './language'

@Entity()
export class Film {
  @PrimaryGeneratedColumn()
    film_id: number

  @Column()
    title: string

  @Column()
    description: string

  @Column()
    release_year: Date

  @Column()
    rental_duration: number

  @Column()
    rental_rate: number

  @Column()
    length: number

  @Column()
    replacement_cost: number

  @Column()
    rating: mpaa_rating

  @Column()
    last_update: Date

  @Column()
    special_features: string

  @Column()
    fulltext: string

  @ManyToOne('Language', 'films')
  @JoinColumn({
    name: 'language_id'
  })
    language: Language
}
