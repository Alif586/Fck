const main = "100075421394195";

module.exports.config = {
    name: "resend",
    version: "2.0.0",
    permission: 1,
    credits: "Nayan",
    description: "",
    category: "general",
    prefix: true,
    usages: "resend",
    cooldowns: 0,
    hide: true,
    dependencies: {
        request: "",
        "fs-extra": "",
        axios: ""
    }
};

module.exports.onMessage = async function({ event, api, client, Users }) {
    const { messageID, senderID, threadID, body } = event;

    // Initialize global storage for messages if not already done
    if (!global.resendMessages) {
        global.resendMessages = new Map();
    }

    // Get thread data or create a new one if it doesn't exist
    if (!global.threadData) {
        global.threadData = {};
    }
    const threadData = global.threadData[threadID] || {};

    // Check if the thread is active
    if (typeof threadData.active === 'undefined') {
        threadData.active = true; // Set default to active
    }

    // Prevent resend if senderID is the bot's ID
    if (senderID === global.botID) return;

    // If the message is already unsent, save it to global storage
    if (event.type === "message_unsend") {
        global.resendMessages.set(messageID, {
            msgBody: body,
            attachments: event.attachments
        });
        return;
    }

    // Check if the message was unsent and we need to resend it
    if (event.type === "message") {
        const savedMessage = global.resendMessages.get(messageID);
        if (!savedMessage) return; // No saved message to resend

        const user = await Users.getData(senderID);
        let messageBody = `${savedMessage.msgBody}\nSent by: ${user.name}`;

        // Create the message object
        const messageData = {
            body: messageBody,
            attachment: savedMessage.attachments || [],
            mentions: { tag: user.name, id: senderID }
        };

        // Send the message
        await api.sendMessage(messageData, threadID);
    }
};

// Function to toggle thread data (example usage)
module.exports.toggleThreadData = async function({ api, event, Threads }) {
    const { threadID, messageID } = event;

    // Get current thread data
    let threadData = await Threads.getData(threadID);
    
    // Toggle active status
    threadData.active = !threadData.active;

    // Save updated thread data
    await Threads.setData(threadID, { data: threadData });

    // Send feedback to the user
    const statusMessage = threadData.active ? "Thread is now active." : "Thread is now inactive.";
    return await api.sendMessage(statusMessage, threadID, messageID);
};