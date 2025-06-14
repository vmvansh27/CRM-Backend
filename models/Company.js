const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true, trim: true },
    billingDate: { type: Date, required: true },
    yearlyCost: { type: Number, required: true },
    billingInstruction: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
});

const CompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true, unique: true, trim: true },
    customerName: String,
    email: String,
    mobile: String,
    address: String,
    services: [ServiceSchema],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }, // 👈 added
    filledBy: { type: String, default: "" }, // 👈 added
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);