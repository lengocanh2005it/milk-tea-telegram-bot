import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from './order.entity';
import { DrinkSize } from '@/common/enums';
import { Drink } from '@/modules/menu/entities';
import { OrderItemTopping } from './order-item-topping.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Drink, (drink) => drink.orderItems)
  @JoinColumn({ name: 'drinkId' })
  drink: Drink;

  @Column({ type: 'enum', enum: DrinkSize })
  size: DrinkSize;

  @Column({ type: 'float' })
  basePrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  totalPrice: number;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToMany(() => OrderItemTopping, (oit) => oit.orderItem, {
    cascade: true,
  })
  orderItemToppings: OrderItemTopping[];
}
