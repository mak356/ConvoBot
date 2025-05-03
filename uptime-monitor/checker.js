const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

const websites = [
  { url: "https://example.com", lastStatus: "online" },
  { url: "https://yourapi.com", lastStatus: "online" }
];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendAlert(url) {
  const mailOptions = {
    from: `"Uptime Monitor" <${process.env.EMAIL_USER}>`,
    to: process.env.ALERT_RECEIVER,
    subject: `⚠️ Website Down: ${url}`,
    text: `Alert: ${url} appears to be offline.`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Email error:", err);
    else console.log("Alert sent:", info.response);
  });
}

async function checkWebsites() {
  for (let site of websites) {
    try {
      const res = await axios.get(site.url, { timeout: 5000 });
      if (site.lastStatus === "offline") {
        console.log(`${site.url} is back online`);
      }
      site.lastStatus = "online";
    } catch (err) {
      if (site.lastStatus === "online") {
        console.log(`${site.url} is DOWN`);
        sendAlert(site.url);
      }
      site.lastStatus = "offline";
    }
  }
}

// Check every 5 minutes
setInterval(checkWebsites, 5 * 60 * 1000);
checkWebsites();