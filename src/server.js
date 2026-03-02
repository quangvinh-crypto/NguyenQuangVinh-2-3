const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");
const roleRoutes = require("./routes/role.routes");

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "User/Role backend is running" });
});

app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect DB:", error.message);
    process.exit(1);
  });
