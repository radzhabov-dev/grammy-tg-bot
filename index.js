require('dotenv').config();

const { Bot, GrammyError, HttpError } = require('grammy');
const bot = new Bot(process.env.BOT_API_KEY);


bot.api.setMyCommands(
[
    {
        command: 'start',
        description: 'Запуск бота'
    },
    {
        command: 'categories',
        description: 'Список категорий'
    },
    {
        command: 'products',
        description: 'Список продуктов'
    }
]
)

bot.command('start', async (ctx) => {
    await ctx.reply('Привет, я бот!');
})

bot.command('products', async (ctx) => {
    const products = ['1', 2, 3, 4, 5, 6]
    for (let product of products) {
        await ctx.reply(product)
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
