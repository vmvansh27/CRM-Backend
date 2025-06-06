

// const mongoose = require("mongoose");

// // Sub-schema for each service entry
// const BillingEntrySchema = new mongoose.Schema({
//     serviceName: String,
//     billingInstruction: String, // Monthly, Quarterly, etc.
//     cost: Number,
//     nextBillingDate: Date,
//     status: {
//         type: String,
//         enum: ["Pending", "Paid"],
//         default: "Pending"
//     },
//     invoiceNumber: String,
//     notes: String
// }, { _id: false }); // Disable _id for subdocuments

// // Main billing schema
// const BillingSchema = new mongoose.Schema({
//     customerId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "SalesForm",
//         required: true,
//     },
//     services: [BillingEntrySchema]
// }, { timestamps: true });

// module.exports = mongoose.model("Billing", BillingSchema);


const mongoose = require("mongoose");

// Sub-schema for each service entry
const BillingEntrySchema = new mongoose.Schema({
    serviceName: String,
    billingInstruction: String, // Monthly, Quarterly, etc.
    cost: Number,
    nextBillingDate: Date,
    status: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },
    invoiceNumber: String,
    notes: String
}, { _id: false }); // Disable _id for subdocuments

// Main billing schema
const BillingSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    services: [BillingEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model("Billing", BillingSchema);
