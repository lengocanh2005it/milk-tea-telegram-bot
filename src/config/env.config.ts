export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10) || 3001,
  database_url: process.env.DATABASE_URL || '',
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
    admin_id: process.env.TELEGRAM_ADMIN_ID || '',
  },
});
