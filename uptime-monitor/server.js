const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./checker");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/check", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url, { timeout: 5000 });
    res.json({ status: "online", code: response.status });
  } catch (error) {
    res.json({ status: "offline", error: error.code || "Request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});