const config = require("../config");
const commandsModule = require("./modules/commands");
const { Bot, session } = require("grammy");
const RegisterRouter = require("./modules/register.module");
const bot = new Bot(config.TOKEN);

bot.use(
  session({
    initial: () => ({
      step: "first"
    }),
  })
);

bot.use(commandsModule);
bot.use(RegisterRouter);

bot.start();
