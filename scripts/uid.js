module.exports.config = {
    name: "uid",
    version: "1.0.0",
    permission: 0,
    credits: "Nayan",
    prefix: true,
    description: "get user id.",
    category: "without prefix",
    cooldowns: 5
};

module.exports.run = async function({ event, api, args, client, Currencies, Users, utils, __GLOBAL, reminder }) {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const axios = global.nodemodule['axios'];
    
    const sendUIDInfo = async (uid, threadID, messageID) => {
        var callback = () => api.sendMessage({
            body: `==== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n=🙂 [ 𝒐𝒘𝒏𝑒𝒓 𝑨𝒍𝒊𝑓 𝒉𝒐𝒔𝒔𝒐𝒏 ] 🙂=\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ 𝗜𝗗: ${uid}\n[ ▶️]➜ 𝗜𝗕: m.me/${uid}\n[ ▶️]➜ 𝗟𝗶𝗻𝗸𝗳𝗯: https://www.facebook.com/profile.php?id=${uid}\n━━━━━━━━━━━━━━━━━━`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), messageID);
        
        return request(encodeURI(`https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname+'/cache/1.png'))
            .on('close', () => callback());
    };

    const getUIDFromProfileLink = async (profileLink) => {
        try {
            const response = await axios.get(`https://graph.facebook.com/v12.0/?id=${profileLink}&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
            return response.data.id;
        } catch (error) {
            throw new Error("Failed to get UID from profile link");
        }
    };

    if (event.type == "message_reply") { 
        let uid = event.messageReply.senderID;
        return sendUIDInfo(uid, event.threadID, event.messageID);
    }

    if (!args[0]) {
        let uid = event.senderID;
        return sendUIDInfo(uid, event.threadID, event.messageID);
    } else {
        if (args[0].indexOf(".com/") !== -1) {
            try {
                const uid = await getUIDFromProfileLink(args[0]);
                return sendUIDInfo(uid, event.threadID, event.messageID);
            } catch (error) {
                return api.sendMessage("Failed to retrieve UID from the provided profile link.", event.threadID, event.messageID);
            }
        } else if (args.join().indexOf('@') !== -1) {
            let uid = Object.keys(event.mentions)[0];
            return sendUIDInfo(uid, event.threadID, event.messageID);
        } else {
            return api.sendMessage("Invalid input. Please provide a Facebook profile link or mention a user.", event.threadID, event.messageID);
        }
    }
};
