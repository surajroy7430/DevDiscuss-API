require("dotenv").config();
const express = require("express");
const connectToDB = require("./config/db");
const authRouter = require("./routes/auth.routes");
const publicPostRouter = require("./routes/publicPost.routes");
const privatePostRouter = require("./routes/privatePost.routes");

const app = express();
app.use(express.json());

connectToDB();

app.use("/api/auth", authRouter);
app.use("/api/posts", publicPostRouter);
app.use("/api/posts", privatePostRouter);

app.use((req, res) => {
  res.status(404).json({ err: "Route not found" });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server running on port - ${PORT}`);
});
