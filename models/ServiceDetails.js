const mongoose = require("mongoose");

const serviceDetailsSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    serviceName: { type: String, required: true },
    ip: { type: String, default: "" },
    config: { type: String, default: "" },
    portNo: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }, // 👈 added
    filledBy: { type: String, default: "" }, // 👈 added
}, { timestamps: true });

serviceDetailsSchema.index({ companyId: 1, serviceName: 1 }, { unique: true });

module.exports = mongoose.model("ServiceDetails", serviceDetailsSchema);