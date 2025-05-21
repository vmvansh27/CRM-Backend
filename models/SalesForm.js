const mongoose = require("mongoose");

const SalesFormSchema = new mongoose.Schema({
    companyName: String,
    customerName: String,
    email: String,
    mobile: String,
    address: String,
    referenceSource: String,
    billingDate: String,
    services: [String],
    yearlyCost: Number,
    billingInstructions: String,
    serviceCommitments: String,
    demo: String,
    backup: String,
    filledBy: String,
}, { timestamps: true });

module.exports = mongoose.model("SalesForm", SalesFormSchema);
