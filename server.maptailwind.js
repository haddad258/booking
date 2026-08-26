const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4008;

app.use(express.static(path.join(__dirname, "cuirz/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "cuirz/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});