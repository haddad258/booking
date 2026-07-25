const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4001;

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, "hotel-booking-admin/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "hotel-booking-admin/dist", "index.html"));
=======
app.use(express.static(path.join(__dirname, "build")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
>>>>>>> 98b8a384889346c0e647ab5f884b8a670a3ec94c
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});