import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem, OrderItemTopping } from '@/modules/order/entities';
import { Drink, Topping } from '@/modules/menu/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderItemTopping,
      Drink,
      Topping,
    ]),
  ],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
