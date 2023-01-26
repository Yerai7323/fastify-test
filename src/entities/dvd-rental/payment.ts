import { Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { Rental } from './rental'

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
    payment_id: number

  @Column()
    customer_id: number

  @Column()
    staff_id: number

  @Column()
    rental_id: number

  @Column()
    amount: number

  @Column()
    payment_date: Date

  @ManyToOne('Rental', 'payments')
  @JoinColumn({
    name: 'rental_id'
  })
    rental: Rental
}
