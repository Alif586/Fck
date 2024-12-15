module.exports.config = {
    name: "statu",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "video",
    prefix: true, 
    category: "Box", 
    usages: "",
    cooldowns: 0,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const videoAPI = 'https://video-api--i.repl.co/status';
    const cacheDir = __dirname + '/cache/video.mp4';

    try {
        
        const response = await axios.get(videoAPI);
        const videoData = response.data;
        const videoTitle = videoData.title;
        const videoURL = videoData.url;
        const authorName = videoData.author.name;

  
        const videoResponse = await axios.get(videoURL, { responseType: 'stream' });
        const videoStream = videoResponse.data;
        const writeStream = fs.createWriteStream(cacheDir);

        
        videoStream.pipe(writeStream);
        writeStream.on('finish', () => {
            
            const message = `✨🌺 Video Title: ${videoTitle}\nAuthor: ${authorName}\nEnjoy the video! 🌺✨`;
            api.sendMessage({
                body: message,
                attachment: fs.createReadStream(cacheDir)
            }, event.threadID, (error, info) => {
                if (error) console.error('Error sending the video:', error);
                fs.unlinkSync(cacheDir);
            });
        });
    } catch (error) {
        console.error('Error fetching and sending the video:', error);
        api.sendMessage('An error occurred while fetching and sending the video.', event.threadID);
    }
};