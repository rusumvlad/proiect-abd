const express = require("express");
const app = express();
const port = 4000;
const connectDB = require("./dbConnect");
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/states", require("./routes/states"));

app.listen(port, () => {
  console.log(`ABD APP is running on http://localhost:${port}`);
});
