const mongoose = require("mongoose");

const billingServiceSchema = new mongoose.Schema({
    serviceName: String,
    costPrice: Number,
    sellingPrice: Number,
    billingInstruction: String,
    cost: Number, // yearly cost
    nextBillingDate: Date,
    status: {
        type: String,
        default: "Pending"
    },
    invoiceNumber: String,
    notes: String
});

const billingSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    services: [billingServiceSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Billing", billingSchema);