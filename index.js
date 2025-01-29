import "dotenv/config";
import { Bot, GrammyError, HttpError, InlineKeyboard, Keyboard } from "grammy";
import {
  addingContact,
  fetchComments,
  fetchEmployees,
  fetchPosts,
} from "./api.js";
import { hydrate } from "@grammyjs/hydrate";
import express from 'express'


const app = express()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

const products = [
  "Кубик",
  "Телефон",
  "Ручка",
  "Стакан",
  "Заметка",
  "Книга",
].join("\n");

async function broadcastMessage(message) {
  try {
    await bot.api.sendMessage("982478044", message);
    console.log(`Сообщение отправлено в чат ${982478044}`);
  } catch (error) {
    console.error(`Ошибка при отправке сообщения в чат ${982478044}:`, error);
  }
}

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "menu",
    description: "Получить меню",
  },
  // {
  //   command: "posts",
  //   description: "Список постов",
  // },
  // {
  //   command: "comments",
  //   description: "Список комментарий",
  // },
  // {
  //   command: "employees",
  //   description: "Список сотрудников",
  // },
  // {
  //   command: "mood",
  //   description: "Выбор категории",
  // },
  // {
  //   command: "shared",
  //   description: "Поделиться данными",
  // },
]);

bot.command("start", async (ctx) => {
  setTimeout(async () => {
    await ctx.react("🎄");
  }, 1000);
  const chatId = ctx.chat.id;
  console.log(chatId);
  await ctx.reply("Привет!");
});

const menuKeyboard = new InlineKeyboard()
  .text("Узнать статус заказа", "order-status")
  .text("Обратиться в службу поддержки", "support");

const backKeyboard = new InlineKeyboard().text("< Назад в меню", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("Выберите действие", {
    reply_markup: menuKeyboard
  });
});

bot.callbackQuery('order-status', async (ctx) => {
  await ctx.callbackQuery.message.editText("Статус заказа: Оформлен", {
    reply_markup: backKeyboard
  })
  await ctx.answerCallbackQuery()
});

bot.callbackQuery('support', async (ctx) => {
  await ctx.callbackQuery.message.editText("Напишите ваш запрос: ", {
    reply_markup: backKeyboard
  })
  await ctx.answerCallbackQuery()
})

bot.callbackQuery('back', async (ctx) => {
  await ctx.callbackQuery.message.editText("Выберите действие: ", {
    reply_markup: menuKeyboard
  })
  await ctx.answerCallbackQuery()
})

// bot.on('message', async (ctx) => {
//   console.log(ctx.update.message.text)
//   if (ctx.chat.id === 2080554505) {
//     await broadcastMessage(ctx.update.message.text);
//   }
// });

// bot.command("mood", async (ctx) => {
//   console.log('Command "mood" received'); // Логгирование для проверки вызова команды
//
//   const moodLabels = ["Посты", "Комментарии", "Профиль"];
//   const rows = moodLabels.map((label) => [Keyboard.text(label)]);
//   const moodKeyboard = Keyboard.from(rows).resized();
//
//   console.log(JSON.stringify(moodKeyboard, null, 2), "moodKeyboard");
//   await ctx.reply("Выберите категорию?", {
//     reply_markup: moodKeyboard,
//   });
// });
//
// bot.command("shared", async (ctx) => {
//   const shareKeyboard = new Keyboard()
//     .requestLocation("Геолокация")
//     .requestContact("Контакт")
//     .requestPoll("Опрос")
//     .placeholder("Укажи данные...")
//     .resized();
//
//   await ctx.reply("Чем хочешь поделиться?", {
//     reply_markup: shareKeyboard
//   })
// });
//
// bot.command('inline_keyboard', async (ctx) => {
//   const inlineKeyboard = new InlineKeyboard()
//     .text('1', 'button-1')
//     .text('2', 'button-2')
//     .text('3', 'button-3')
//
//   await ctx.reply('Выберите цифру', {
//     reply_markup: inlineKeyboard
//   })
// })

// bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx) => {
//   await ctx.answerCallbackQuery(`Вы выбрали ${ctx.callbackQuery.data}`)
//   await ctx.reply({
//     text: `Вы выбрали ${ctx.callbackQuery.data}`,
//     reply_markup: {
//       remove_keyboard: true
//     }
//   })
// })

// bot.on('callback_query:data', async (ctx) => {
//   await ctx.answerCallbackQuery()
//   await ctx.reply(`Вы выбрали ${ctx.callbackQuery.data}`)
// })
//
//
//
// bot.on(':contact', async (ctx) => {
//   const response = await addingContact(ctx.update.message.contact);
//   await ctx.reply(response)
// })

// bot.hears('123', async (ctx) => {
//   await ctx.reply(products, {
//     reply_markup: {remove_keyboard: true}
//   })
// })

// bot.command("products", async (ctx) => {
//   await ctx.reply(products);
// });
//
// bot.command("posts", async (ctx) => {
//   const posts = await fetchPosts();
//   for (const post of posts.data) {
//     await ctx.reply(post.title);
//   }
// });
//
// bot.command("comments", async (ctx) => {
//   const comments = await fetchComments();
//   console.log(comments);
//   for (const comment of comments.data) {
//     await ctx.reply(comment.body);
//   }
// });
//
// bot.command("employees", async (ctx) => {
//   const employees = await fetchEmployees();
//   for (const employee of employees.data) {
//     await ctx.reply(employee.name);
//   }
// });

// bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
//     await ctx.reply('Hello');
//    });

// bot.on('message', async (ctx) => {
//     await ctx.reply(ctx.update.message.text)
// })

bot.catch((err) => {
  const ctx = err.ctx;
  console.log(`Error while handling  update ${ctx.update.update_id}`);

  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request: ", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram: ", e);
  } else {
    console.error("Unknown error: ", e);
  }
});

bot.start();
