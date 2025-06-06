// const mongoose = require("mongoose");

// const CompanySchema = new mongoose.Schema({
//     companyName: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true
//     },
//     customerName: String,
//     email: String,
//     mobile: String,
//     address: String
// }, { timestamps: true });

// module.exports = mongoose.model("Company", CompanySchema);


// const mongoose = require("mongoose");

// const ServiceSchema = new mongoose.Schema({
//     serviceName: { type: String, required: true, trim: true },
//     billingDate: { type: Date, required: true },
//     yearlyCost: { type: Number, required: true },
//     billingInstruction: { type: String, required: true }, // e.g., "Monthly", "Quarterly"
//     // you can add more fields as needed, e.g., status, notes, etc.
// });

// const CompanySchema = new mongoose.Schema({
//     companyName: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//     },
//     customerName: String,
//     email: String,
//     mobile: String,
//     address: String,
//     services: [ServiceSchema], // array of service subdocuments
// }, { timestamps: true });

// module.exports = mongoose.model("Company", CompanySchema);



const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true, trim: true },
    billingDate: { type: Date, required: true },
    yearlyCost: { type: Number, required: true },
    billingInstruction: { type: String, required: true }, // e.g., "Monthly", "Quarterly"
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }, // added status with default
    // you can add more fields as needed, e.g., notes, etc.
});

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    customerName: String,
    email: String,
    mobile: String,
    address: String,
    services: [ServiceSchema], // array of service subdocuments
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);
