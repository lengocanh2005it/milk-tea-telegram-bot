import { OrderSession, TelegramContext, ToppingSession } from '@/common/types';

export function ensureOrderSession(ctx: TelegramContext): OrderSession {
  if (!ctx.session.order) {
    ctx.session.order = {
      step: undefined,
      items: [],
      currentItem: undefined,
      deliveryAddress: undefined,
      phoneNumber: undefined,
    };
  }

  return ctx.session.order;
}

export function isSameToppings(
  a: ToppingSession[],
  b: ToppingSession[],
): boolean {
  if (a.length !== b.length) return false;

  return a.every((t1) =>
    b.some(
      (t2) => t1.toppingId === t2.toppingId && t1.quantity === t2.quantity,
    ),
  );
}

export function pendingKeyboard(orderId: string) {
  return {
    inline_keyboard: [
      [
        {
          text: '✅ Xác nhận đơn',
          callback_data: `ADMIN_CONFIRM_${orderId}`,
        },
        {
          text: '❌ Huỷ đơn',
          callback_data: `ADMIN_CANCEL_${orderId}`,
        },
      ],
    ],
  };
}

export function confirmedKeyboard(orderId: string) {
  return {
    inline_keyboard: [
      [
        {
          text: '🚚 Đã giao xong',
          callback_data: `ADMIN_DONE_${orderId}`,
        },
      ],
    ],
  };
}
