import { DrinkSize } from '@/common/enums';
import type { TelegramContext } from '@/common/types';
import { OrderSession } from '@/common/types';
import {
  ensureOrderSession,
  formatMoneyVND,
  isSameToppings,
} from '@/common/utils';
import { MenuService } from '@/modules/menu/menu.service';
import { OrderService } from '@/modules/order/order.service';
import { Action, Ctx, On, Update } from 'nestjs-telegraf';
import { Markup } from 'telegraf';

@Update()
export class OrderUpdate {
  constructor(
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
  ) {}

  // ===============================
  // STEP 1: START ORDER
  // ===============================
  @Action('ORDER_START')
  async onOrderStart(@Ctx() ctx: TelegramContext) {
    ctx.session.order = {
      step: 'CATEGORY',
      items: [],
      currentItem: undefined,
    } as OrderSession;

    await ctx.answerCbQuery();
    await ctx.reply(
      '🧋 MENU CỬA HÀNG\n\nVui lòng chọn loại đồ uống:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🥤 Trà Sữa', 'CAT_Trà Sữa')],
        [Markup.button.callback('🍹 Trà Trái Cây', 'CAT_Trà Trái Cây')],
        [Markup.button.callback('☕ Cà Phê', 'CAT_Cà Phê')],
        [Markup.button.callback('🧊 Đá Xay', 'CAT_Đá Xay')],
      ]),
    );
  }

  // ===============================
  // STEP 2: CHỌN CATEGORY
  // ===============================
  @Action(/^CAT_(.+)$/)
  async onSelectCategory(@Ctx() ctx: TelegramContext) {
    const categoryName = ctx.match![1];
    const drinks = await this.menuService.getDrinksByCategory(categoryName);

    if (!drinks.length) {
      await ctx.reply('❌ Hiện chưa có món nào trong danh mục này.');
      return;
    }

    const order = ensureOrderSession(ctx);
    order.step = 'DRINK';
    order.currentItem = undefined;

    await ctx.answerCbQuery();
    await ctx.reply(
      `🥤 *${categoryName}*\n\n👉 Vui lòng chọn *món bạn muốn uống*:`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(
          drinks.map((d) => [
            Markup.button.callback(`🧋 ${d.name}`, `DRINK_${d.itemId}`),
          ]),
        ),
      },
    );
  }

  // ===============================
  // STEP 3: CHỌN DRINK
  // ===============================
  @Action(/^DRINK_(.+)$/)
  async onSelectDrink(@Ctx() ctx: TelegramContext) {
    const drinkId = ctx.match![1];
    const drink = await this.menuService.getDrinkByItemId(drinkId);
    if (!drink) return;

    const order = ensureOrderSession(ctx);

    order.currentItem = {
      drinkId: drink.itemId,
      drinkName: drink.name,
      priceM: drink.priceM,
      priceL: drink.priceL,
      toppings: [],
    };

    order.step = 'SIZE';

    await ctx.answerCbQuery();
    await ctx.reply(`📏 Chọn size cho *${drink.name}*:`, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            `Size M (Giá: ${formatMoneyVND(drink.priceM)})`,
            'SIZE_M',
          ),
          Markup.button.callback(
            `Size L (Giá: ${formatMoneyVND(drink.priceL)})`,
            'SIZE_L',
          ),
        ],
      ]),
    });
  }

  // ===============================
  // STEP 4: CHỌN SIZE
  // ===============================
  @Action(/^SIZE_(M|L)$/)
  async onSelectSize(@Ctx() ctx: TelegramContext) {
    const size = ctx.match![1] as DrinkSize;
    const order = ensureOrderSession(ctx);

    order.currentItem!.size = size;
    order.step = 'TOPPING';

    const toppings = await this.menuService.getAvailableToppings();

    await ctx.answerCbQuery();
    await ctx.reply(
      '➕ *Topping (tuỳ chọn)*\n\n' +
        '• Bạn có thể *chọn topping bên dưới* (bấm nhiều lần để tăng số lượng).\n' +
        '• Sau khi chọn xong (hoặc nếu không chọn topping), vui lòng bấm *“Xong topping”* để tiếp tục.',
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          ...toppings.map((t) => [
            Markup.button.callback(
              `${t.name} (+${formatMoneyVND(t.price)})`,
              `TOPPING_${t.itemId}`,
            ),
          ]),
          [Markup.button.callback('✅ Xong topping', 'TOP_DONE')],
        ]),
      },
    );
  }

  // ===============================
  // STEP 5: TOGGLE TOPPING
  // ===============================
  @Action(/^TOPPING_(.+)$/)
  async onToggleTopping(@Ctx() ctx: TelegramContext) {
    const toppingId = ctx.match![1];
    const topping = await this.menuService.getToppingByItemId(toppingId);
    if (!topping) return;

    const order = ensureOrderSession(ctx);
    const toppings = order.currentItem!.toppings!;

    const exist = toppings.find((t) => t.toppingId === toppingId);
    if (exist) {
      exist.quantity += 1;
    } else {
      toppings.push({
        toppingId: topping.itemId,
        toppingName: topping.name,
        price: topping.price,
        quantity: 1,
      });
    }

    await ctx.answerCbQuery(`➕ ${topping.name}`);
  }

  // ===============================
  // STEP 6: NHẬP SỐ LƯỢNG
  // ===============================
  @Action('TOP_DONE')
  async onDoneTopping(@Ctx() ctx: TelegramContext) {
    const order = ensureOrderSession(ctx);
    order.step = 'QUANTITY';

    await ctx.answerCbQuery();
    await ctx.reply('🔢 Nhập số lượng muốn đặt (ví dụ: 1, 2): ');
  }

  // ===============================
  // STEP 7: INPUT TEXT
  // ===============================
  @On('text')
  async onText(@Ctx() ctx: TelegramContext) {
    const order = ensureOrderSession(ctx);
    const text = ctx.message?.['text'];
    if (!text) return;

    // -------- QUANTITY --------
    if (order.step === 'QUANTITY') {
      const qty = Number(text);

      if (isNaN(qty) || qty <= 0) {
        await ctx.reply('❌ Số lượng không hợp lệ.');
        return;
      }

      order.currentItem!.quantity = qty;

      const existedItem = order.items.find(
        (item) =>
          item.drinkId === order.currentItem!.drinkId &&
          item.size === order.currentItem!.size &&
          isSameToppings(item.toppings, order.currentItem!.toppings!),
      );

      if (existedItem) {
        existedItem.quantity += qty;
      } else {
        order.items.push(order.currentItem as any);
      }

      order.currentItem = undefined;
      order.step = 'ADD_MORE';

      await ctx.reply(
        '➕ Bạn muốn gọi thêm món không?',
        Markup.inlineKeyboard([
          [Markup.button.callback('➕ Có', 'ADD_MORE_YES')],
          [Markup.button.callback('➡️ Không', 'ADD_MORE_NO')],
        ]),
      );
      return;
    }

    // -------- ADDRESS --------
    if (order.step === 'ADDRESS') {
      order.deliveryAddress = text.trim();
      if (!order.deliveryAddress) {
        await ctx.reply('❌ Địa chỉ không được để trống.');
        return;
      }

      order.step = 'PHONE';
      await ctx.reply(
        '📞 Nhập số điện thoại liên hệ khi giao hàng: \n\nVD: 0987654321 hoặc +84987654321',
      );
      return;
    }

    // -------- PHONE --------
    if (order.step === 'PHONE') {
      const phone = text.trim();
      const phoneRegex = /^(0|\+84)[0-9]{9}$/;

      if (!phoneRegex.test(phone)) {
        await ctx.reply('❌ Số điện thoại không hợp lệ. Vui lòng nhập lại.');
        return;
      }

      order.phoneNumber = phone;
      order.step = 'CONFIRM';

      const total = this.orderService.calculateTotal(order);

      // ===== RENDER CHI TIẾT ĐƠN =====
      const customerName =
        [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') ||
        'bạn';

      let detailText =
        `👋 *Chào ${customerName}*,\n` +
        `Mình xin xác nhận lại *đơn hàng của bạn* như sau nhé 👇\n\n` +
        `🧾 *CHI TIẾT ĐƠN HÀNG*\n\n`;

      order.items.forEach((item, index) => {
        const basePrice = item.size === DrinkSize.L ? item.priceL : item.priceM;

        const toppingText =
          item.toppings.length > 0
            ? item.toppings
                .map(
                  (t) =>
                    `  ↳ ${t.toppingName} x${t.quantity} (+${formatMoneyVND(
                      t.price * t.quantity,
                    )})`,
                )
                .join('\n')
            : '  ↳ Không topping';

        const itemTotal =
          (basePrice +
            item.toppings.reduce((s, t) => s + t.price * t.quantity, 0)) *
          item.quantity;

        detailText +=
          `🧋 *Món ${index + 1}*\n` +
          `• ${item.drinkName} (${item.size})\n` +
          `• Giá: ${formatMoneyVND(basePrice)}\n` +
          `${toppingText}\n` +
          `• Số lượng: x${item.quantity}\n` +
          `• Thành tiền: *${formatMoneyVND(itemTotal)}*\n\n`;
      });

      detailText +=
        `📍 *Địa chỉ giao hàng:* ${order.deliveryAddress}\n` +
        `📞 *Số điện thoại liên hệ:* ${order.phoneNumber}\n\n` +
        `💰 *TỔNG CỘNG TẠM TÍNH:* *${formatMoneyVND(total)}*\n\n` +
        `ℹ️ *Lưu ý:* _Tổng tiền trên là_ *tạm tính*, *chưa bao gồm phí giao hàng*.\n` +
        `_Phí giao hàng sẽ được shop thông báo sau khi shipper nhận và giao đến nơi cho bạn._\n\n` +
        `👉 Nếu thông tin trên đã chính xác, bạn vui lòng *xác nhận đơn hàng* giúp mình nhé ❤️`;

      await ctx.reply(detailText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('✅ Xác nhận đặt hàng', 'ORDER_CONFIRM')],
          [Markup.button.callback('❌ Huỷ đơn', 'ORDER_CANCEL')],
        ]),
      });
    }
  }

  // ===============================
  // STEP 8: ADD MORE
  // ===============================
  @Action('ADD_MORE_YES')
  async onAddMore(@Ctx() ctx: TelegramContext) {
    const order = ensureOrderSession(ctx);

    order.step = 'CATEGORY';
    order.currentItem = undefined;

    await ctx.answerCbQuery();

    await ctx.reply(
      '🧋 MENU CỬA HÀNG\n\nVui lòng chọn loại đồ uống:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🥤 Trà Sữa', 'CAT_Trà Sữa')],
        [Markup.button.callback('🍹 Trà Trái Cây', 'CAT_Trà Trái Cây')],
        [Markup.button.callback('☕ Cà Phê', 'CAT_Cà Phê')],
        [Markup.button.callback('🧊 Đá Xay', 'CAT_Đá Xay')],
      ]),
    );
  }

  @Action('ADD_MORE_NO')
  async onFinishItems(@Ctx() ctx: TelegramContext) {
    const order = ensureOrderSession(ctx);
    order.step = 'ADDRESS';
    await ctx.answerCbQuery();
    await ctx.reply('📍 Nhập địa chỉ giao hàng: ');
  }

  // ===============================
  // STEP 9: CONFIRM / CANCEL
  // ===============================
  @Action('ORDER_CONFIRM')
  async onConfirm(@Ctx() ctx: TelegramContext) {
    const order = ensureOrderSession(ctx);

    const orderDb = await this.orderService.createOrderFromSession(
      ctx.from!,
      order,
    );

    await this.orderService.notifyAdmin(orderDb);
    ctx.session.order = undefined;

    await ctx.answerCbQuery();
    await ctx.reply(
      '✅ Đơn hàng đã được gửi cho shop để làm rồi nè 🧋\n\n' +
        '⏳ Bạn vui lòng đợi shop chuẩn bị xong nha.\n' +
        '🚚 Khi làm xong, shop sẽ giao đến đúng địa chỉ bạn đã cung cấp và *gọi điện cho bạn ra nhận*.\n\n' +
        'Cảm ơn bạn nhiều nè ❤️',
      {
        parse_mode: 'Markdown',
      },
    );
  }

  @Action('ORDER_CANCEL')
  async onCancel(@Ctx() ctx: TelegramContext) {
    ctx.session.order = undefined;
    await ctx.answerCbQuery();
    await ctx.reply('❌ Đã huỷ đơn hàng.');
  }
}
