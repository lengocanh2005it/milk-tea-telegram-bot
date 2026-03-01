import { DrinkSize, OrderStatus } from '@/common/enums';

export interface OrderItemSession {
  drinkId: string;
  size: DrinkSize;
  toppings: ToppingSession[];
  quantity: number;
  drinkName: string;
  priceM: number;
  priceL: number;
}

export interface ToppingSession {
  toppingId: string;
  quantity: number;
  toppingName: string;
  price: number;
}

export interface OrderSession {
  step?: OrderStep;
  currentItem?: Partial<OrderItemSession>;
  items: OrderItemSession[];
  deliveryAddress?: string;
  phoneNumber?: string;
}

export type OrderStep =
  | 'CATEGORY'
  | 'DRINK'
  | 'SIZE'
  | 'TOPPING'
  | 'QUANTITY'
  | 'ADD_MORE'
  | 'ADDRESS'
  | 'PHONE'
  | 'CONFIRM';

export const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '🆕 Chờ xác nhận',
  [OrderStatus.CONFIRMED]: '⏳ Đang chuẩn bị',
  [OrderStatus.DONE]: '✅ Hoàn thành',
  [OrderStatus.CANCELLED]: '❌ Đã huỷ',
};
