import { MenuModule } from '@/modules/menu/menu.module';
import { MenuService } from '@/modules/menu/menu.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { OrderUpdate, StartUpdate } from './updates';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '@/modules/order/order.module';
import { OrderService } from '@/modules/order/order.service';
import { Category, Drink, Topping } from '@/modules/menu/entities';
import { Order, OrderItem, OrderItemTopping } from '@/modules/order/entities';
import { session } from 'telegraf';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Drink,
      Topping,
      Order,
      OrderItem,
      OrderItemTopping,
    ]),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('telegram.token', ''),
        middlewares: [session()],
      }),
    }),
    MenuModule,
    OrderModule,
  ],
  providers: [StartUpdate, OrderUpdate, MenuService, OrderService],
})
export class TelegramModule {}
