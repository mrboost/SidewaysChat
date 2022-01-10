
await Pixel.loadScripts([
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.0/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  "https://unpkg.com/animejs@3.2.1/lib/anime.min.js", //This is a JavaScript animation engine
  "https://unpkg.com/howler@2.2.3/dist/howler.js", //This is a audio library meant for playing audio via JS
]);

let totalMessages = 0, messagesLimit = 20;
let previousSender = '';

const settings = {
  showAvatars: "{{showAvatars}}" === "true",
  showUsername: "{{showUsername}}" === "true",
  hiddenUsers: "{{hiddenUsers}}"
}

const ignoredUsers = settings.hiddenUsers.toLowerCase().replace(" ", "").split(",");

Pixel.on("message", (message) => {

  let username = message.user.displayName + ":";
  if (message.message[0].text.startsWith("!")) return;
  if (ignoredUsers.indexOf(message.user.displayName.toLowerCase()) !== -1) return;

  if (!settings.showUsername) {
    if (previousSender !== username) {
      previousSender = username;
    } else {
      username = '';
      message.user.name = ''
      message.user.avatar = '';
    }
  }

  totalMessages += 1;

  const innerMessage = message.message.map((e) => {
    if (e.type === "emote") {
      return `<img src="${e.url}" class="emote" />`
    } else if (e.type === "text") {
      return `<span class="chatText">${e.text}</span>`;
    }
  }).join(" ")

  const template = (`
    <div class="chatMessage" id="msg-${totalMessages}" style="opacity: 1;">
      <img src="${message.user.avatar}" class="${settings.showAvatars ? "avatar" : "no-avatar"}">
      <span class="username" style="color: ${message.user.color}">${username}</span>
      ${innerMessage}
    </div>
  `);


  $('.chatBox').prepend(template);
  gsap.fromTo(`#msg-${totalMessages}`, 0.5, { right: "-50px", width: 0 }, { width: "auto" });

  if (totalMessages > messagesLimit) {

    removeRow(totalMessages - messagesLimit);
  }

  function removeRow(id) {
    console.log(id);
    if (!$(`#msg-${id}`).length) {
      return;
    }

    $(`#msg-${id}`).animate({
      height: 0,
      opacity: 0
    }, 'slow', function () {
      $(`#msg-${id}`).remove();
    });
  }

})
