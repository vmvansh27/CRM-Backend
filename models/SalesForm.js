const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    serviceName: String,
    costPrice: Number,
    sellingPrice: Number,
    billingInstruction: String,
    billingDate: Date
});

const salesFormSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    referenceSource: String,
    services: [serviceSchema],
    yearlyCost: Number,
    serviceCommitments: String,
    demoStatus: String,
    backup: String,
    filledBy: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("SalesForm", salesFormSchema);