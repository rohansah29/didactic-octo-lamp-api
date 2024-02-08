const express = require("express");
const cors = require("cors");
const { userRouter } = require("./routes/userRoutes");
const { connection } = require("./db");
const postRouter = require("./routes/postRoutes");

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api", userRouter);
app.use("/api",postRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


app.listen(8080, async() => {
    await connection;
    console.log("Connected to db.")
    console.log(`Server is running on port 8080.`);
});
