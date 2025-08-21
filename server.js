require("dotenv").config();
const express = require("express");
const connectToDB = require("./config/db");

const app = express();
app.use(express.json());

connectToDB();

app.use("/api/auth");
app.use("/api/posts");

app.use((req, res) => {
  res.status(404).json({ err: "Route not found" });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server running on port - ${PORT}`);
});
