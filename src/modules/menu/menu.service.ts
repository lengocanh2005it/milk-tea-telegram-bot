import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Drink } from './entities/drink.entity';
import { Topping } from './entities/topping.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Drink)
    private readonly drinkRepo: Repository<Drink>,
    @InjectRepository(Topping)
    private readonly toppingRepo: Repository<Topping>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepo.find({
      order: { name: 'ASC' },
    });
  }

  async getDrinksByCategory(categoryName: string): Promise<Drink[]> {
    return this.drinkRepo.find({
      where: {
        category: { name: categoryName },
        available: true,
      },
      order: { name: 'ASC' },
    });
  }

  async getDrinkByItemId(itemId: string): Promise<Drink | null> {
    return this.drinkRepo.findOne({
      where: { itemId, available: true },
    });
  }

  async getAvailableToppings(): Promise<Topping[]> {
    return this.toppingRepo.find({
      where: { available: true },
      order: { price: 'ASC' },
    });
  }

  async getToppingByItemId(itemId: string): Promise<Topping | null> {
    return this.toppingRepo.findOne({
      where: { itemId, available: true },
    });
  }
}
