// Get requires
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const runnables = require("./runnables.js");
require("dotenv").config();

// Initialize express and define port
const app = express();
const router = express.Router();
const PORT = process.env.EXPORT;

// Define variables for Discord Webhook
const discURL = process.env.URL;

// Define variables for results of poll
var pollTitle;
var winOption;
var winVotes;
var totalVotes;

// Tell express to use body-parser
app.use(bodyParser.json());

// Handle Webhook on /hook address
app.post("/hook", (req, res) => {
  console.log("Received Hook");
  let win = runnables.getWinningOption(req);
  let winArray = Array.isArray(win);
  if (winArray) {
    for (const i in win) {
      let option = win[i];
      if (Array.isArray(winOption)) {
        winOption.push(option.name);
      } else {
        winOption = [option.name];
      }
    }
    winVotes = win[0].votes;
  } else {
    winOption = win.name;
    winVotes = win.votes;
  }
  totalVotes = req.body.deadline.results.total_votes;
  pollTitle = req.body.content.title;
  res.status(200).end();
  if (!winArray) {
    runnables.sendSingleWebhook(
      discURL,
      pollTitle,
      totalVotes,
      winOption,
      winVotes
    );
  } else {
    runnables.sendMultipleWebhook(
      discURL,
      pollTitle,
      totalVotes,
      winOption,
      winVotes
    );
  }
});

// Show index page
router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.use("/", router);

// Start express on defined port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
