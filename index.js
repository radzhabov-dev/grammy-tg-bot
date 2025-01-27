import 'dotenv/config';
import {Bot, GrammyError, HttpError, Keyboard} from "grammy";
import {fetchComments, fetchEmployees, fetchPosts} from "./api.js";

const bot = new Bot(process.env.BOT_API_KEY);

const products = ['Кубик', 'Телефон', "Ручка", "Стакан", "Заметка", "Книга"].join('\n')

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
    }
  ]
)

bot.command('start', async (ctx) => {
  setTimeout(async () => {
    await ctx.react('🎄');
  }, 1000)
  await ctx.reply('Привет, я бот!');
})

// bot.command('showData', async (ctx) => {
//   const moodKeyboard = new Keyboard().text('Посты').row().text('Комментарии').row().text("Профиль").resized()
//   await ctx.reply('Выберите категорию?', {
//     reply_markup: moodKeyboard,
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
  console.log(employees)
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
