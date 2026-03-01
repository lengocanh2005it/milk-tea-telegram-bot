import { DrinkSize, OrderStatus } from '@/common/enums';
import { OrderSession } from '@/common/types';
import { Order, OrderItem } from '@/modules/order/entities';
import { OrderItemTopping } from '@/modules/order/entities/order-item-topping.entity';
import { Drink, Topping } from '@/modules/menu/entities';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Repository } from 'typeorm';
import { formatDateTimeVN, formatMoneyVND } from '@/common/utils';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderItemTopping)
    private readonly orderItemToppingRepo: Repository<OrderItemTopping>,
    @InjectRepository(Drink)
    private readonly drinkRepo: Repository<Drink>,
    @InjectRepository(Topping)
    private readonly toppingRepo: Repository<Topping>,
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly configService: ConfigService,
  ) {}

  // ===============================
  // CALCULATE TOTAL (MULTI ITEMS)
  // ===============================
  calculateTotal(session: OrderSession): number {
    if (!session.items?.length) return 0;

    return session.items.reduce((orderSum, item) => {
      const basePrice =
        item.size === DrinkSize.L
          ? (item['priceL'] ?? 0)
          : (item['priceM'] ?? 0);

      const toppingTotal =
        item.toppings?.reduce(
          (sum, t) => sum + (t['price'] ?? 0) * t.quantity,
          0,
        ) ?? 0;

      return orderSum + (basePrice + toppingTotal) * item.quantity;
    }, 0);
  }

  // ===============================
  // CREATE ORDER FROM SESSION
  // ===============================
  async createOrderFromSession(
    from: {
      id: number;
      first_name?: string;
      last_name?: string;
    },
    session: OrderSession,
  ): Promise<Order> {
    if (!session.items?.length) {
      throw new InternalServerErrorException('Order session is empty');
    }

    const order = this.orderRepo.create({
      customerTelegramId: from.id.toString(),
      customerName: `${from.first_name ?? ''} ${from.last_name ?? ''}`.trim(),
      status: OrderStatus.PENDING,
      deliveryAddress: session.deliveryAddress,
      totalPrice: 0,
      items: [],
      phoneNumber: session.phoneNumber,
    });

    await this.orderRepo.save(order);

    let orderTotal = 0;

    for (const itemSession of session.items) {
      const drink = await this.drinkRepo.findOne({
        where: { itemId: itemSession.drinkId },
      });

      if (!drink) continue;

      const basePrice =
        itemSession.size === DrinkSize.L ? drink.priceL : drink.priceM;

      let toppingTotal = 0;

      const orderItem = this.orderItemRepo.create({
        order,
        drink,
        size: itemSession.size,
        basePrice,
        quantity: itemSession.quantity,
        totalPrice: 0,
        orderItemToppings: [],
      });

      await this.orderItemRepo.save(orderItem);

      for (const toppingSession of itemSession.toppings ?? []) {
        const topping = await this.toppingRepo.findOne({
          where: { itemId: toppingSession.toppingId },
        });

        if (!topping) continue;

        toppingTotal += topping.price * toppingSession.quantity;

        const oit = this.orderItemToppingRepo.create({
          orderItem,
          topping,
          quantity: toppingSession.quantity,
        });

        orderItem.orderItemToppings.push(oit);
      }

      orderItem.totalPrice = (basePrice + toppingTotal) * itemSession.quantity;

      await this.orderItemRepo.save(orderItem);

      orderTotal += orderItem.totalPrice;

      order.items.push(orderItem);
    }

    order.totalPrice = orderTotal;

    return this.orderRepo.save(order);
  }

  // ===============================
  // NOTIFY ADMIN (MULTI ITEMS)
  // ===============================
  async notifyAdmin(order: Order): Promise<void> {
    const fullOrder = await this.orderRepo.findOne({
      where: { id: order.id },
      relations: {
        items: {
          drink: true,
          orderItemToppings: {
            topping: true,
          },
        },
      },
    });

    if (!fullOrder) return;

    const itemsText = fullOrder.items
      .map((item, index) => {
        const toppingsText = item.orderItemToppings?.length
          ? item.orderItemToppings
              .map((oit) => `   ↳ *${oit.topping.name}* x${oit.quantity}`)
              .join('\n')
          : '   ↳ *Không topping*';

        return (
          `🧋 *MÓN ${index + 1}*\n` +
          `• *${item.drink.name}* (Size *${item.size}*)\n` +
          `${toppingsText}\n` +
          `• *Số lượng:* ${item.quantity}\n` +
          `• *Thành tiền:* *${item.totalPrice.toLocaleString('vi-VN')} ₫*`
        );
      })
      .join('\n\n');

    const message =
      `📦 *ĐƠN HÀNG MỚI*\n` +
      `━━━━━━━━━━━━━━━\n\n` +
      `👤 *THÔNG TIN KHÁCH HÀNG*\n\n` +
      `• *Tên:* ${fullOrder.customerName}\n` +
      `• *Số điện thoại liên lạc:* ${fullOrder.phoneNumber ?? 'Không có'}\n` +
      `• *Địa chỉ giao hàng:* ${fullOrder.deliveryAddress ?? 'Không có'}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🧾 *CHI TIẾT ĐƠN HÀNG*\n\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💰 *TỔNG TIỀN (chưa gồm ship):* *${formatMoneyVND(
        fullOrder.totalPrice,
      )}*\n\n` +
      `⏰ *Thời gian đặt hàng:* ${formatDateTimeVN(
        new Date(),
        "'Lúc' HH:mm 'ngày' dd/MM/yyyy",
      )}`;

    await this.bot.telegram.sendMessage(
      this.configService.get<string>('telegram.admin_id', ''),
      message,
      {
        parse_mode: 'Markdown',
      },
    );
  }
}
