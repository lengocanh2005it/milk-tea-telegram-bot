import { Topping } from '@/modules/menu/entities';
import { OrderItem } from '@/modules/order/entities/order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_item_toppings')
export class OrderItemTopping {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => OrderItem, (oi) => oi.orderItemToppings)
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @ManyToOne(() => Topping, (t) => t.orderItemToppings)
  @JoinColumn({ name: 'toppingId' })
  topping: Topping;

  @Column({
    type: 'int',
  })
  quantity: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
