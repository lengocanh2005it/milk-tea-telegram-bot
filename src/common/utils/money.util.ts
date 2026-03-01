export function formatMoneyVND(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0₫';

  return amount.toLocaleString('vi-VN') + '₫';
}
