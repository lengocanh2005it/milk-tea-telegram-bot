import envConfig from '@/config/env.config';
import { DatabaseModule } from '@/modules/database/database.module';
import { MenuModule } from '@/modules/menu/menu.module';
import { OrderModule } from '@/modules/order/order.module';
import { TelegramModule } from '@/modules/telegram/telegram.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    OrderModule,
    TelegramModule,
    MenuModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
