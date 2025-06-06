const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Routes
app.use("/api/sales", require("./routes/sales"));
app.use("/api/billing", require("./routes/billing"));
app.use("/api/company", require("./routes/company")); // ✅ New route

const serviceDetailsRoutes = require("./routes/serviceDetails");
app.use("/api/service-details", serviceDetailsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
