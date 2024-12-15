const axios = require("axios");
const fs = require("fs");
const request = require("request");

const jsonURL = "https://raw.githubusercontent.com/Alifhosson/all-text.json/refs/heads/main/botnoprefix.json";

module.exports.config = {
  name: "🥵",
  version: "1.0.0",
  permission: 0,
  credits: "alif",
  description: "",
  prefix: true,
  category: "no prefix",
  usages: "🥵 [category]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.handleEvent = async ({ api, event }) => {
  const content = event.body ? event.body : '';
  const body = content.toLowerCase();

  if (body.startsWith("🥵")) {
    try {
      const response = await axios.get(jsonURL);
      const noprefix = response.data.noprefix;

      const userCategory = body.split(" ")[1];
      const category = userCategory && noprefix[userCategory] ? userCategory : "noprefix1";

      const links = noprefix[category];
      if (!links || links.length === 0) {
        api.sendMessage("এই ক্যাটাগরিতে কোনো লিংক নেই।", event.threadID, event.messageID);
        return;
      }

      const alif = [
        "ভালো হয়ে জা লুচ্চা🥵😁😁",
        "নে দেখ লুচ্চা😁🥵"
      ];
      const alif2 = alif[Math.floor(Math.random() * alif.length)];

      const callback = () => api.sendMessage({
        body: `${alif2}`,
        attachment: fs.createReadStream(__dirname + "/cache/2024.mp4")
      }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/2024.mp4"), event.messageID);

      const randomLink = links[Math.floor(Math.random() * links.length)];
      const requestStream = request(encodeURI(randomLink));
      requestStream.pipe(fs.createWriteStream(__dirname + "/cache/2024.mp4")).on("close", () => callback());
      return requestStream;

    } catch (error) {
      console.error("Error fetching links:", error);
      api.sendMessage("ডেটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
  }
};

module.exports.languages = {
  "vi": {
    "on": "Dùng sai cách rồi lêu lêu",
    "off": "sv ngu, đã bão dùng sai cách",
    "successText": `🧠`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": "success!",
  }
};

module.exports.run = async ({ api, event, Threads, getText }) => {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["🥵"] === "undefined" || data["🥵"]) data["🥵"] = false;
  else data["🥵"] = true;
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);
  api.sendMessage(`${(data["🥵"]) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};