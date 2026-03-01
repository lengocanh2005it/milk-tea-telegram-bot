import { DrinkSize } from '@/common/enums';
import { ORDER_STATUS_TEXT, type TelegramContext } from '@/common/types';
import { formatDateTimeVN, formatMoneyVND } from '@/common/utils';
import { OrderService } from '@/modules/order/order.service';
import { Action, Ctx, Update } from 'nestjs-telegraf';

@Update()
export class OrderHistoryUpdate {
  constructor(private readonly orderService: OrderService) {}

  // ===============================
  // KHÁCH: XEM ĐƠN CỦA TÔI
  // ===============================
  @Action('MY_ORDERS')
  async onMyOrders(@Ctx() ctx: TelegramContext) {
    await ctx.answerCbQuery();

    const telegramId = ctx.from?.id.toString();
    if (!telegramId) return;

    const orders = await this.orderService.getOrdersByCustomer(telegramId);

    if (!orders.length) {
      await ctx.reply('📭 *Bạn chưa có đơn hàng nào.*', {
        parse_mode: 'Markdown',
      });
      return;
    }

    const customerName =
      [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') ||
      'bạn';

    await ctx.reply(
      `👋 *Chào ${customerName}*,\n\n` +
        `Dưới đây là *danh sách các đơn hàng* bạn đã đặt tại ` +
        `*Trà Sữa Ngọc Anh* 🧋👇`,
      {
        parse_mode: 'Markdown',
      },
    );

    for (const o of orders) {
      const statusText = ORDER_STATUS_TEXT[o.status];

      await ctx.reply(
        `🧾 *Đơn hàng* \`#${o.orderCode}\`\n` +
          `━━━━━━━━━━━━━━━\n` +
          `💰 *Tổng tiền:* ${formatMoneyVND(o.totalPrice)}\n` +
          `📌 *Trạng thái:* ${statusText}\n` +
          `⏰ *Thời gian đặt hàng:* ${formatDateTimeVN(
            o.createdAt.toLocaleString('vi-VN', {
              timeZone: 'Asia/Ho_Chi_Minh',
            }),
          )}`,
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🔍 Xem chi tiết đơn hàng',
                  callback_data: `ORDER_DETAIL_${o.id}`,
                },
              ],
            ],
          },
        },
      );
    }
  }

  @Action(/^ORDER_DETAIL_([0-9a-fA-F-]+)$/)
  async onOrderDetail(@Ctx() ctx: TelegramContext) {
    const orderId = ctx.match![1];
    const telegramId = ctx.from?.id.toString();

    if (!telegramId) return;

    const order = await this.orderService.getOrderDetailByCustomer(
      orderId,
      telegramId,
    );

    await ctx.answerCbQuery();

    if (!order) {
      await ctx.reply('❌ Không tìm thấy đơn hàng.');
      return;
    }

    const itemsText = order.items
      .map((item, index) => {
        const basePrice =
          item.size === DrinkSize.L ? item.drink.priceL : item.drink.priceM;

        const toppingText = item.orderItemToppings?.length
          ? item.orderItemToppings
              .map(
                (oit) =>
                  `  ↳ ${oit.topping.name} x${oit.quantity} (+${formatMoneyVND(
                    oit.topping.price * oit.quantity,
                  )})`,
              )
              .join('\n')
          : '  ↳ Không topping';

        const toppingTotal =
          item.orderItemToppings?.reduce(
            (sum, oit) => sum + oit.topping.price * oit.quantity,
            0,
          ) ?? 0;

        const itemTotal = (basePrice + toppingTotal) * item.quantity;

        return (
          `🧋 *Món ${index + 1}*\n` +
          `• ${item.drink.name} (${item.size})\n` +
          `• Giá: ${formatMoneyVND(basePrice)}\n` +
          `${toppingText}\n` +
          `• Số lượng: x${item.quantity}\n` +
          `• Thành tiền: *${formatMoneyVND(itemTotal)}*`
        );
      })
      .join('\n\n');

    const statusText = ORDER_STATUS_TEXT[order.status];

    const message =
      `🧾 *CHI TIẾT ĐƠN HÀNG*\n\n` +
      `🆔 *Mã đơn:* \`#${order.orderCode}\`\n\n` +
      `📌 *Trạng thái:* ${statusText}\n\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💰 *Tổng tiền:* *${formatMoneyVND(order.totalPrice)}*\n` +
      `📍 *Địa chỉ giao hàng:* ${order.deliveryAddress ?? 'Không có'}\n` +
      `📞 *SĐT liên hệ:* ${order.phoneNumber ?? 'Không có'}\n` +
      `⏰ *Thời gian đặt hàng:* ${formatDateTimeVN(
        order.createdAt.toLocaleString('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
        }),
      )}`;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  }
}
