const socket = io();
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const BOT_IMG = "robot.png";
const PERSON_IMG = "user.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "Coderider";
// const robot = ["How do you do, fellow human", "I am not a bot"];
msgerForm.addEventListener("submit", event => {
  event.preventDefault();
  const msgText = msgerInput.value;
  if (!msgText) return;
  msgerInput.value = "";

  socket.emit('aiPrompt', msgText);
  addChat(PERSON_NAME, PERSON_IMG, "right", msgText);
//   output(msgText);
});
socket.on("aiReply",(outputResponse)=>{
  output(outputResponse);
});
function output(input) {
  //let product;
  //let text = input.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();

    addChat(BOT_NAME, BOT_IMG, "left", input);
}
// function compare(promptsArray, repliesArray, string) {
//   let reply;
//   let replyFound = false;
//   for (let x = 0; x < promptsArray.length; x++) {
//     for (let y = 0; y < promptsArray[x].length; y++) {
//       if (promptsArray[x][y] === string) {
//         let replies = repliesArray[x];
//         reply = replies[Math.floor(Math.random() * replies.length)];
//         replyFound = true;
//         break;
//       }
//     }
//     if (replyFound) {
//       break;
//     }
//   }
//   return reply;
// }
function addChat(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}
function get(selector, root = document) {
  return root.querySelector(selector);
}
function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}