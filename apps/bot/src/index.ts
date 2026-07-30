import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
  TELEGRAM_BOT_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Very basic webhook handler for Telegram
app.post('/webhook', async (c) => {
  const update = await c.req.json().catch(() => ({}));

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    let reply = "Command not recognized. Use /help";

    if (text.startsWith('/start')) {
      reply = "Welcome to CF Subscription Platform Bot.\nUse /account to see your status.";
    } else if (text.startsWith('/account')) {
      reply = "Your account is not linked. Please generate a code in the dashboard and use /link <code>";
    } else if (text.startsWith('/status')) {
      reply = "System is operational.";
    } else if (text.startsWith('/help')) {
      reply = "Available commands: /start, /account, /status, /link";
    }

    // Send message back
    if (c.env.TELEGRAM_BOT_TOKEN) {
      await fetch(`https://api.telegram.org/bot${c.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: reply
        })
      });
    }
  }

  return c.text('OK');
});

export default app;
