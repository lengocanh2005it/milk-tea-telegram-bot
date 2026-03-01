import { Category, Drink, Topping } from '@/modules/menu/entities';
import { MenuModule } from '@/modules/menu/menu.module';
import { MenuService } from '@/modules/menu/menu.service';
import { Order, OrderItem, OrderItemTopping } from '@/modules/order/entities';
import { OrderModule } from '@/modules/order/order.module';
import { OrderService } from '@/modules/order/order.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { OrderHistoryUpdate, OrderUpdate, StartUpdate } from './updates';

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
  providers: [
    StartUpdate,
    OrderUpdate,
    MenuService,
    OrderService,
    OrderHistoryUpdate,
  ],
})
export class TelegramModule {}
