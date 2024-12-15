module.exports = {
  config: {
    name: "out2",
    version: "1.0.5",
    credits: "Rahad",
    prefix: false,
    permission: 2,
    description: "Bot leaves the group with a specified delay and disables anti-out.",
    category: "admin",
    cooldowns: 5
  },

  start: async function({ nayan, events, args, Threads }) {
    const delayMinutes = parseInt(args[0]);

 
    if (!args[0] || isNaN(delayMinutes)) {
      return nayan.removeUserFromGroup(nayan.getCurrentUserID(), events.threadID);
    }

    try {

      let data = (await Threads.getData(events.threadID)).data || {};
      data.antiout = false;
      await Threads.setData(events.threadID, { data });


      nayan.reply(`রাগ করছি আর থাকবো না😾\n${delayMinutes}\nমিনিট পরে চলে জাবো কোন ভুল করলে মাফ করে দিও 🥺🥺`, events.threadID);


      setTimeout(async () => {
        try {
          await nayan.removeUserFromGroup(nayan.getCurrentUserID(), events.threadID);
        } catch (error) {
          console.error("Failed to remove bot from group:", error);
        }
      }, delayMinutes * 60 * 1000);

    } catch (error) {
      console.error("Failed to disable anti-out or set delayed leave:", error);
      nayan.reply("An error occurred while processing the command.", events.threadID);
    }
  }
};