import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { mpaa_rating } from '../../utils/enum/mpaa_rating'
import { Actor } from './actor'
import { Category } from './category'
import { Inventory } from './inventory'
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
    language_id: number

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

  @ManyToMany('Category', 'films')
  @JoinTable({
    name: 'film_category',
    joinColumn: {
      name: 'film_id'
    },
    inverseJoinColumn: {
      name: 'category_id'
    }
  })
    categories: Category[]

  @ManyToMany('Actor', 'films')
  @JoinTable({
    name: 'film_actor',
    joinColumn: {
      name: 'film_id'
    },
    inverseJoinColumn: {
      name: 'actor_id'
    }
  })
    actors: Actor[]

  @OneToMany('Inventory', 'film')
  @JoinColumn({
    name: 'film'
  })
    inventories: Inventory[]
}
