const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Hello World!" });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
