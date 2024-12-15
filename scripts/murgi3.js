const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
	name: "textabl",
	version: "1.0.0",
	permission: 0,
	credits: "ALIF-HOSSON",
	prefix: false,
	description: "Automatically replies to tagged users with add/remove functionality",
	category: "utility",
	usages: "[tag or userID]",
	cooldowns: 5
};

const userListPath = path.join(__dirname, "ALIF/userList.json");
const remoteURL = "http://5.78.114.238:5069/alif/badwords";

async function fetchReplies() {
	try {
		const response = await axios.get(remoteURL);
		const badWords = response.data.badWords;
		return Object.values(badWords);
	} catch (error) {
		console.error("Error fetching replies from URL:", error);
		return ["Sorry, no replies available right now."];
	}
}

function loadUserList() {
	try {
		if (!fs.existsSync(userListPath)) {
			fs.writeFileSync(userListPath, JSON.stringify([]));
		}
		const data = fs.readFileSync(userListPath, "utf-8");
		const parsedData = JSON.parse(data);
		return Array.isArray(parsedData) ? parsedData : [];
	} catch (error) {
		console.error("Error loading user list:", error);
		return [];
	}
}

function saveUserList(userList) {
	try {
		fs.writeFileSync(userListPath, JSON.stringify(userList, null, 2));
	} catch (error) {
		console.error("Error saving user list:", error);
	}
}

module.exports.handleEvent = async function({ api, event, Users }) {
	const { threadID, messageID, senderID } = event;
	const content = event.body ? event.body : '';
	const body = content.toLowerCase();
	const userList = loadUserList();
	const replies = await fetchReplies();

	if (body.startsWith("textabl add") || body.startsWith("textabl remove")) {
		const userPermissions = global.config.ADMINBOT.includes(senderID) ? 2 : 0;

		if (userPermissions < 2) {
			return api.sendMessage("You do not have permission to use this command.", threadID, messageID);
		}

		let userID = Object.keys(event.mentions)[0] || (body.split(" ")[2] && !isNaN(body.split(" ")[2]) ? body.split(" ")[2] : null);
		if (!userID) return api.sendMessage("Please tag a user or provide a userID.", threadID);

		if (body.startsWith("textabl add")) {
			if (!userList.includes(userID)) {
				userList.push(userID);
				saveUserList(userList);
				api.sendMessage(`User has been added for auto-reply.`, threadID, messageID);
			} else {
				api.sendMessage("User is already in the auto-reply list.", threadID, messageID);
			}
		} else if (body.startsWith("textabl remove")) {
			const index = userList.indexOf(userID);
			if (index !== -1) {
				userList.splice(index, 1);
				saveUserList(userList);
				api.sendMessage(`User has been removed from auto-reply.`, threadID, messageID);
			} else {
				api.sendMessage("User is not in the auto-reply list.", threadID, messageID);
			}
		}
		return;
	}

	if (userList.includes(senderID)) {
		const randomReply = replies[Math.floor(Math.random() * replies.length)];
		const name = await Users.getNameUser(senderID);
		const replyMessage = randomReply || "Sorry, no reply available.";
		api.sendMessage({
			body: `${name} ${replyMessage}`,
			mentions: [{ tag: name, id: senderID }]
		}, threadID, messageID);
	}
};