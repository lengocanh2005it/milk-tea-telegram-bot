import { Category, Drink, Topping } from '@/modules/menu/entities';
import { MenuService } from '@/modules/menu/menu.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Drink, Topping])],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
