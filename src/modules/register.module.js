const { Router } = require("@grammyjs/router");
const router = new Router((ctx) => ctx.session.step);
const { contactBtn } = require("../helpers/contact");
const Io = require("../utils/io");
const Users = new Io("./database/users.json");
const User = require("../models/User");

const first = router.route("first");

first.on(":text", async (ctx) => {
  const name = ctx.from.first_name;
  await ctx.reply(
    `<b>Assalomu aleykum <a href="tg://user?id=${ctx.from.id}">${name}</a>. Xush kelibsiz</b>`,
    {
      parse_mode: "HTML",
    }
  );

  const id = ctx.from.id;
  const User = await Users.read();
  const findUser = User.find((user) => user.id === id);

  
  if (findUser === undefined) {
    
    await ctx.reply("Ismingizni kiriting!");
    ctx.session.step = "second";
  } else {
    ctx.session.step = "fourth";
  return await ctx.reply("Already connected");
  }
  
});

const second = router.route("second");
second.on(":text", async (ctx) => {
  console.log(ctx.message);
  await ctx.reply("Familiyangizni kiriting");

  ctx.session.firstName = ctx.message.text;

  ctx.session.step = "uchinchi";
});

const third = router.route("uchinchi");
third.on(":text", async (ctx) => {
  await ctx.reply("Telefon raqamingizni yuboring", {
    reply_markup: {
      ...contactBtn,
      resize_keyboard: true,
    },
  });

  ctx.session.lastName = ctx.message.text;
  ctx.session.step = "to`rtinchi";
});

const forth = router.route("to`rtinchi");

forth.on(":contact", async (ctx) => {
  ctx.session.phoneNumber = ctx.message.contact.phone_number;
  const id = ctx.from.id;
  const { firstName, lastName, phoneNumber } = ctx.session;
console.log(ctx.session);
  const users = await Users.read();

  const newUser = new User(id, firstName, lastName, phoneNumber);

  const data = users.length ? [...users, newUser] : [newUser];

  await Users.write(data);
  ctx.session.step = "";
  ctx.reply("you are now connected");
});


module.exports = router;
