module.exports.config = {
    name: "xms",
    version: "1.0.0",
    permission: 2,
    credits: "Rahad",
    description: "Send an SMS to the specified number",
    prefix: true,
    category: "sms send",
    usages: "",
    cooldowns: 5,
    dependencies: {}
};

module.exports.run = async function({ api, event, args }) {
    const { threadID } = event;
    const phoneNumber = args[0];
    const message = args.slice(1).join(" ");

    if (!phoneNumber || !message) {
        return api.sendMessage('Please provide a phone number and message.', threadID);
    }

    const url = 'http://202.51.182.198:8181/nbp/sms/code';

    const data = {
        receiver: phoneNumber,
        text: message,
        title: 'Register Account'
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        const result = await response.json();
        api.sendMessage(`Success: ${result}`, threadID);
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(`Error: ${error.message}`, threadID);
    }
};