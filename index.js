import 'dotenv/config';
import {Bot, GrammyError, HttpError, Keyboard} from "grammy";
import {fetchComments, fetchEmployees, fetchPosts} from "./api.js";

const bot = new Bot(process.env.BOT_API_KEY);

const products = ['Кубик', 'Телефон', "Ручка", "Стакан", "Заметка", "Книга"].join('\n')

async function broadcastMessage(message) {
    try {
      await bot.api.sendMessage("982478044", message);
      console.log(`Сообщение отправлено в чат ${982478044}`);
    } catch (error) {
      console.error(`Ошибка при отправке сообщения в чат ${982478044}:`, error);
    }
}

bot.api.setMyCommands(
  [
    {
      command: 'start',
      description: 'Запуск бота'
    },
    {
      command: 'posts',
      description: 'Список постов'
    },
    {
      command: 'comments',
      description: 'Список комментарий'
    },
    {
      command: 'employees',
      description: 'Список сотрудников'
    },
    {
      command: 'mood',
      description: 'Выбор категории'
    }
  ]
)

bot.command('start', async (ctx) => {
  setTimeout(async () => {
    await ctx.react('🎄');
  }, 1000)
  const chatId = ctx.chat.id;
  console.log(chatId)
  await ctx.reply('Привет!');
})

// bot.on('message', async (ctx) => {
//   console.log(ctx.update.message.text)
//   if (ctx.chat.id === 2080554505) {
//     await broadcastMessage(ctx.update.message.text);
//   }
// });

bot.command('mood', async (ctx) => {
  console.log('Command "mood" received'); // Логгирование для проверки вызова команды

  const moodLabels = ['Посты', 'Комментарии', 'Профиль'];
  const rows = moodLabels.map((label) => [Keyboard.text(label)]);
  const moodKeyboard = Keyboard.from(rows).resized();

  console.log(JSON.stringify(moodKeyboard, null, 2), 'moodKeyboard');
  await ctx.reply('Выберите категорию?', {
    reply_markup: moodKeyboard,
  });
});

// bot.hears('123', async (ctx) => {
//   await ctx.reply(products, {
//     reply_markup: {remove_keyboard: true}
//   })
// })

bot.command('products', async (ctx) => {
  await ctx.reply(products)
})

bot.command('posts', async (ctx) => {
  const posts = await fetchPosts()
  for (const post of posts.data) {
    await ctx.reply(post.title)
  }
})

bot.command('comments', async (ctx) => {
  const comments = await fetchComments()
  console.log(comments)
  for (const comment of comments.data) {
    await ctx.reply(comment.body)
  }
})

bot.command('employees', async (ctx) => {
  const employees = await fetchEmployees()
  for (const employee of employees.data) {
    await ctx.reply(employee.name)
  }
})

// bot.command(['say_hello', 'hello', 'say_hi'], async (ctx) => {
//     await ctx.reply('Hello');
//    });

// bot.on('message', async (ctx) => {
//     await ctx.reply(ctx.update.message.text)
// })

bot.catch((err) => {
  const ctx = err.ctx
  console.log(`Error while handling  update ${ctx.update.update_id}`)

  const e = err.error

  if (e instanceof GrammyError) {
    console.error("Error in request: ", e.description)
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram: ', e)
  } else {
    console.error("Unknown error: ", e);
  }
})

bot.start();
