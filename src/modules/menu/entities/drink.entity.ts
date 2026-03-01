import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from '@/modules/order/entities';

@Entity('drinks')
export class Drink {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ unique: true })
  itemId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float' })
  priceM: number;

  @Column({ type: 'float' })
  priceL: number;

  @Column({ default: true })
  available: boolean;

  @ManyToOne(() => Category, (category) => category.drinks, {
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @OneToMany(() => OrderItem, (oi) => oi.drink)
  orderItems: OrderItem[];
}
