import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'
import { Inventory } from './inventory'
import { Payment } from './payment'

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
    rental_id: number

  @Column()
    rental_date: Date

  @Column()
    inventory_id: number

  @Column()
    customer_id: number

  @Column()
    return_date: Date

  @Column()
    staff_id: number

  @Column()
    last_update: Date

  @OneToOne('Inventory')
  @JoinColumn({
    name: 'inventory_id'
  })
    inventory: Inventory

  @OneToMany('Payment', 'rental')
    payments: Payment[]
}
