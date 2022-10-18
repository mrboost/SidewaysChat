let totalMessages = 0, messagesLimit = 0, noname = "show", nickColor = "user", removeSelector, addition, customNickColor, channelName, provider, highlight;
let animationIn = 'bounceIn';
let animationOut = 'bounceOut';
let hideAfter = 60;
let hideCommands = "no";
let ignoredUsers = [];
let previousSender='';
let emotes = [];

window.addEventListener('onEventReceived', async function (obj) {
    if (obj.detail.event.listener === 'widget-button') {

        if (obj.detail.event.field === 'testMessage') {
            let emulated = new CustomEvent("onEventReceived", {
                detail: {
                    listener: "message", event: {
                        service: "twitch",
                        data: {
                            time: Date.now(),
                            tags: {
                                "badge-info": "",
                                badges: "moderator/1,partner/1",
                                color: "#5B99FF",
                                "display-name": "StreamElements",
                                emotes: "25:46-50",
                                flags: "",
                                id: "43285909-412c-4eee-b80d-89f72ba53142",
                                mod: "1",
                                "room-id": "85827806",
                                subscriber: "0",
                                "tmi-sent-ts": "1579444549265",
                                turbo: "0",
                                "user-id": "100135110",
                                "user-type": "mod"
                            },
                            nick: channelName,
                            userId: "100135110",
                            displayName: channelName,
                            displayColor: "#5B99FF",
                            badges: [{
                                type: "moderator",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/3",
                                description: "Moderator"
                            }, {
                                type: "partner",
                                version: "1",
                                url: "https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3",
                                description: "Verified"
                            }],
                            channel: channelName,
                            text: "Howdy! My name is MrBoost and I am here to serve Kappa",
                            isAction: !1,
                            emotes: [{
                                type: "twitch",
                                name: "Kappa",
                                id: "25",
                                gif: !1,
                                urls: {
                                    1: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    2: "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
                                    4: "https://static-cdn.jtvnw.net/emoticons/v1/25/3.0"
                                },
                                start: 46,
                                end: 50
                            }],
                            msgId: "43285909-412c-4eee-b80d-89f72ba53142"
                        },
                        renderedText: 'Howdy! My name is Bill and I am here to serve <img src="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0" srcset="https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 1x, https://static-cdn.jtvnw.net/emoticons/v1/25/1.0 2x, https://static-cdn.jtvnw.net/emoticons/v1/25/3.0 4x" title="Kappa" class="emote">'
                    }
                }
            });
            window.dispatchEvent(emulated);
        }
        return;
    }
    if (obj.detail.listener === "delete-message") {
        const msgId = obj.detail.event.msgId;
        $(`.message-row[data-msgid=${msgId}]`).remove();
        return;
    } else if (obj.detail.listener === "delete-messages") {
        const sender = obj.detail.event.userId;
        $(`.message-row[data-sender=${sender}]`).remove();
        return;
    }

    if (obj.detail.listener !== "message") return;
    let data = obj.detail.event.data;
    if (data.text.startsWith("!") && hideCommands === "yes") return;
    if (ignoredUsers.indexOf(data.nick) !== -1) return;
    let message = attachEmotes(data);
    let badges = "", badge;
    if (provider === 'mixer') {
        data.badges.push({url: data.avatar});
    }
    for (let i = 0; i < data.badges.length; i++) {
        badge = data.badges[i];
        badges += `<img alt="" src="${badge.url}" class="badge"> `;
    }
    let username = data.displayName + ":";
  	let nickname = data.displayName;
    if (nickColor === "user") {
        const color = data.displayColor !== "" ? data.displayColor : "#" + (md5(username).substr(26));
        username = `<span style="color:${color}">${username}</span>`;
    }
    if (nickColor === "custom") {
        const color = customNickColor;
        username = `<span style="color:${color}">${username}</span>`;
    }
  
    highlight = (obj.detail.event.data.tags["msg-id"] === "highlighted-message")
    addMessage(nickname, username, badges, message, data.isAction, data.userId, data.msgId);
});

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    animationIn = fieldData.animationIn;
    animationOut = fieldData.animationOut;
    hideAfter = fieldData.hideAfter;
    messagesLimit = fieldData.messagesLimit;
    nickColor = fieldData.nickColor;
    customNickColor = fieldData.customNickColor;
    hideCommands = fieldData.hideCommands;
    channelName = obj.detail.channel.username;
    animate = fieldData.messageAlign;
    noname = fieldData.noname;
    fetch('https://api.streamelements.com/kappa/v2/channels/' + obj.detail.channel.id + '/').then(response => response.json()).then((profile) => {
        provider = profile.provider;
    });
    ignoredUsers = fieldData.ignoredUsers.toLowerCase().replace(" ", "").split(",");
});

function attachEmotes(message) {
    let text = html_encode(message.text);
    let data = message.emotes;
    return text
        .replace(
            /([^\s]*)/gi,
            function (m, key) {
                let result = data.filter(emote => {
                    return emote.name === key
                });
                if (typeof result[0] !== "undefined") {
                    let url = result[0]['urls'][1];
                    return `<img alt="" src="${url}" class="emote"/>`;
                } else return key;

            }
        );
}

function html_encode(e) {
    return e.replace(/[<>"^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";
    });
}
function addMessage(nickname, username, badges, message, isAction, uid, msgId, avatar) {

if ({showAvatar}) {
  showBadges = avatar
} else {
  showBadges = badges
}
  
if (noname === "show") {
  if (previousSender!==username) {
  previousSender=username;
}
else{
  username='';
  badges='';
	}
}
    totalMessages += 1;
    let actionClass = "";
    if (isAction) {
        actionClass = "action";
    }
    const element = $.parseHTML(`
    <div data-sender="${uid}" data-msgid="${msgId}" class="message-row animated" id="msg-${totalMessages}">
        <div class="user-box ${actionClass}">${badges}${username}</div>
        <div class="user-message ${actionClass}">${message}</div>
    </div>`);
   
if (hideAfter !== 999) { 
	$('.main-container').prepend(element);
	if (highlight) {
    let highlightmsg = document.querySelector(`#msg-${totalMessages}`);
    highlightmsg.classList.add("highlight");
  }
 	gsap.fromTo(`#msg-${totalMessages}`,0.5, {width: 0}, {ease: Power1.easeOut, width: "auto"});
  
$('.main-container .message-row').prepend(element).delay(hideAfter * 1000).queue(function () {
$(this).removeClass(animationIn).addClass(animationOut).delay(1000).queue(function () {
$(this).remove()
}).dequeue();
});
  } else {
    $('.main-container').prepend(element);
    if (highlight) {
    let highlightmsg = document.querySelector(`#msg-${totalMessages}`);
    highlightmsg.classList.add("highlight");
  }
    gsap.fromTo(`#msg-${totalMessages}`,0.5, {width: 0}, {ease: Power1.easeOut, width: "auto"});
  }
  
document.querySelectorAll(".main-container .message-row").forEach((el, i) => {
	if (i >= {messagesLimit}) {
     gsap.timeline().to(el, {opacity: 0}).add(()=> {
    el.remove()
		})
	}});  
}

	
