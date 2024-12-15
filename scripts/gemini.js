const axios = require('axios'); // Make sure axios is required

module.exports.config = {
    name: "gemini",
    version: "1.0",
    credits: "Dipto",
    description: "Gemini AI",
    prefix: true,
    cooldowns: 5,
    role: 0,
    category: "google",
    usages: "{pn} message | photo reply",
};

module.exports.run = async function ({ api, args, event }) {
    const prompt = args.join(' ');

    try {
        if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
            const imageUrl = event.messageReply.attachments[0].url;
            const response = await axios.get(`https://mostakim-api.onrender.com/gemini?q=${encodeURIComponent(prompt)}&url=${encodeURIComponent(imageUrl)}`);
            const data2 = response.data.dipto;
            api.sendMessage(data2, event.threadID, event.messageID);
        } else if (!prompt) {
            api.sendMessage('Please provide a prompt or message reply', event.threadID, event.messageID);
        } else {
            const response = await axios.get(`https://noobs-api.onrender.com/dipto/gemini?prompt=${encodeURIComponent(prompt)}`);
            const message = response.data.dipto;
            api.sendMessage(message, event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        api.sendMessage(`Sorry, there was an error processing your request. ${error.response ? error.response.data : error.message}`, event.threadID, event.messageID);
    }
};
