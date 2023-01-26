import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { Film } from './film'
import { Rental } from './rental'

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
    inventory_id: number

  @Column()
    film_id: number

  @Column()
    store_id: number

  @Column()
    last_update: Date

  @ManyToOne('Film', 'inventories')
  @JoinColumn({
    name: 'film_id'
  })
    film: Film

  @OneToOne('Rental', 'inventory')
    rental: Rental
}
