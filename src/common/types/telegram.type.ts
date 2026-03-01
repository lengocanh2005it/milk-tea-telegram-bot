import { OrderSession } from '@/common/types';
import { Context as TelegrafContext } from 'telegraf';

export interface TelegramContext extends TelegrafContext {
  session: {
    order?: OrderSession;
  };
  match?: RegExpMatchArray;
}
