const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const clientRoutes = require("./clientRoutes");
const materialRoutes = require("./materialRoutes");
const rentRoutes = require("./rentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(clientRoutes);
app.use(materialRoutes);
app.use(rentRoutes);

app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`);
})