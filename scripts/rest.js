module.exports.config = {
    name: "rest",
    version: "1.0.0",
    permission: 2,
    credits: "Alif",
    description: "Restart Bot",
    prefix: true, 
    category: "system", 
    usages: "system",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
	const { threadID, messageID } = event;
	return api.sendMessage(`${global.config.BOTNAME} Bot are now Restarting...`, threadID, () => process.exit(1));
}