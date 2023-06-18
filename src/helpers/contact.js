const { Keyboard } = require("grammy");

const contactBtn = new Keyboard().requestContact(
  "📞Telefor Raqamni Yuborish📲"
);
module.exports = {
  contactBtn,
};
