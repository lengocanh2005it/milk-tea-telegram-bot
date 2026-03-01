import { MenuCsvRow } from '@/common/types';
import { Category, Drink, Topping } from '@/modules/menu/entities';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

export async function seedMenu(dataSource: DataSource) {
  const csv = fs.readFileSync('public/Menu.csv');

  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  }) as MenuCsvRow[];

  const categoryRepo = dataSource.getRepository(Category);
  const drinkRepo = dataSource.getRepository(Drink);
  const toppingRepo = dataSource.getRepository(Topping);

  for (const row of records) {
    const categoryName = row.category.trim();
    const isAvailable = row.available.toLowerCase() === 'true';

    if (categoryName === 'Topping') {
      const existingTopping = await toppingRepo.findOne({
        where: { itemId: row.item_id },
      });

      if (!existingTopping) {
        await toppingRepo.save({
          itemId: row.item_id,
          name: row.name,
          description: row.description,
          price: Number(row.price_m),
          available: isAvailable,
        });
      }

      continue;
    }

    let category = await categoryRepo.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      category = await categoryRepo.save({ name: categoryName });
    }

    const existingDrink = await drinkRepo.findOne({
      where: { itemId: row.item_id },
    });

    if (!existingDrink) {
      await drinkRepo.save({
        itemId: row.item_id,
        name: row.name,
        description: row.description,
        priceM: Number(row.price_m),
        priceL: Number(row.price_l),
        available: isAvailable,
        category,
      });
    }
  }

  console.log('✅ Menu seed completed');
}
