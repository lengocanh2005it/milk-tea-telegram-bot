import { OrderStatus } from '@/common/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  customerTelegramId: string;

  @Column()
  customerName: string;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'float',
  })
  totalPrice: number;

  @Column({ type: 'text', nullable: true })
  deliveryAddress?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];
}
