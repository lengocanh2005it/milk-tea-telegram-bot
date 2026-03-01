import { ConfigService } from '@nestjs/config';
import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
export class StartUpdate {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Xử lý lệnh /start
   * - Phân biệt mẹ (admin) và khách hàng bằng Telegram ID
   */
  @Start()
  async onStart(@Ctx() ctx: Context) {
    const from = ctx.from;
    if (!from) return;

    const chatId = from.id.toString();
    const adminId = this.configService.get<string>('telegram.admin_id', '');

    // ===== TRƯỜNG HỢP: MẸ (ADMIN) =====
    if (chatId !== adminId) {
      await ctx.reply(
        '👋 Chào mẹ!\n\n' +
          'Bot đã sẵn sàng nhận đơn.\n' +
          'Khi có khách đặt đồ, đơn hàng sẽ được gửi về đây 📢',
      );
      return;
    }

    // ===== TRƯỜNG HỢP: KHÁCH HÀNG =====
    await ctx.reply(
      '👋 Chào bạn!\n\n' +
        'Mình là bot hỗ trợ đặt đồ uống 🧋\n' +
        'của cửa hàng Trà Sữa Ngọc Anh.\n\n' +
        'Vui lòng bấm nút bên dưới để bắt đầu đặt món 👇',
      Markup.inlineKeyboard([
        [Markup.button.callback('🧋 Đặt đồ uống', 'ORDER_START')],
      ]),
    );
  }
}
