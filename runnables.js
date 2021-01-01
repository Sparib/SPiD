const { Webhook, MessageBuilder } = require("discord-webhook-node");

module.exports = {
    getWinningOption: function (req) {
        let options = req.body.deadline.results.options;
        let highestVoted;
        let highestVote = 0;
        for (const i in options) {
            let option = options[i];
            if (option.votes > highestVote) {
                highestVote = option.votes;
                highestVoted = option;
            } else if (option.votes == highestVote) {
                if (Array.isArray(highestVoted)) {
                    highestVoted.push(option);
                } else {
                    highestVoted = [highestVoted, option];
                }
            }
        }
        return highestVoted;
    },

    sendSingleWebhook: function (url, title, votes, winOpt, winVote) {
        const hook = new Webhook(url);
        const embed = new MessageBuilder()
            .setTitle("Poll \"" + title + "\" has ended!")
            .addField("Winning Option", winOpt, true)
            .addField("Winning Votes", winVote, true)
            .setColor("#CAFF00")
            .setFooter("Total Votes: " + votes);

        hook.send(embed).catch();
    },

    /**
     * 
     * @param {String} url 
     * @param {String} title 
     * @param {String} votes 
     * @param {String[]} winOpts 
     * @param {String} winVote 
     */
    sendMultipleWebhook: function (url, title, votes, winOpts, winVote) {
        const hook = new Webhook(url);
        let winOptsString = "";
        for (const i in winOpts) {
            winOptsString += winOpts[i] + "\n";
        }
        const embed = new MessageBuilder()
            .setTitle("Poll \"" + title + "\" has ended!")
            .addField("Winning Options", winOptsString, true);
        embed.addField("Winning Votes", winVote, true)
            .setColor("#CAFF00")
            .setFooter("Total Votes: " + votes);

        hook.send(embed).catch();
    }
}