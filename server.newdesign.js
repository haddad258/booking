const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4006;

app.use(express.static(path.join(__dirname, "hotel-booking-newdesign/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "hotel-booking-newdesign/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});