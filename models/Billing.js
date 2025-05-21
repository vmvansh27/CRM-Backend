const mongoose = require("mongoose");

const BillingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SalesForm",
        required: true,
    },
    billingInstruction: String, // Monthly, Quarterly, etc.
    totalCost: Number,
    nextBillingDate: Date,
    status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },
    invoiceNumber: String,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model("Billing", BillingSchema);
