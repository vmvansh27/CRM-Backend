


const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceName: String,
    cost: Number,
    billingInstruction: String,
    billingDate: String, // Start billing date (used to compute nextBillingDate)
});

const SalesFormSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    services: [ServiceSchema],
    yearlyCost: String,
    serviceCommitments: String,
    demoStatus: String,
    backup: String,
    filledBy: String,
}, { timestamps: true });

module.exports = mongoose.model("SalesForm", SalesFormSchema);
