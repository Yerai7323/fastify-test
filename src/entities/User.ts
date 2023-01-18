import { Entity, BaseEntity } from 'typeorm'
import { Column } from 'typeorm/decorator/columns/Column'
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn'
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn'
import { DeleteDateColumn } from 'typeorm/decorator/columns/DeleteDateColumn'
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column({
  })
    firstName: string

  @Column()
    lastName: string

  @Column({
    default: true
  })
    active: boolean

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  @DeleteDateColumn({ select: false })
    deletedAt: Date
}
