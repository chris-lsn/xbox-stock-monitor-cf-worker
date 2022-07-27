class Telegram {
  #url: string;

  constructor(botToken: string) {
    this.#url = `https://api.telegram.org/bot${botToken}`;
  }

  sendMessage(chatId: string, message: string): Promise<Response> {
    return fetch(`${this.#url}/sendMessage`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });
  }
}

export default Telegram;
