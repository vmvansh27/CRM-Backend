const mongoose = require("mongoose");

// const billingServiceSchema = new mongoose.Schema({
//     serviceName: String,
//     costPrice: Number,
//     sellingPrice: Number,
//     billingInstruction: String,
//     cost: Number,
//     nextBillingDate: Date,
//     installment: Number, // NEW
//     status: { type: String, default: 'Pending' },
//     invoiceNumber: String,
//     notes: String,
//     paymentHistory: [
//         {
//             amount: Number,
//             date: Date,
//             status: String
//         }
//     ],
// });

// const billingSchema = new mongoose.Schema({
//     companyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Company",
//         required: true
//     },
//     services: [billingServiceSchema],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model("Billing", billingSchema);


const billingServiceSchema = new mongoose.Schema({
    serviceName: String,
    costPricePerMonth: Number,
    sellingPricePerMonth: Number,
    billingInstruction: String,
    installment: Number, // Number of payments in a year
    totalCostPrice: Number, // total for this period
    totalSellingPrice: Number, // total for this period
    nextBillingDate: Date,
    status: { type: String, default: 'Pending' },
    invoiceNumber: String,
    notes: String,
    paymentHistory: [
        {
            amount: Number,
            date: Date,
            status: String
        }
    ],
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
