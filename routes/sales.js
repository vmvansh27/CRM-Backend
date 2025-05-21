const express = require("express");
const router = express.Router();
const SalesForm = require("../models/SalesForm");
const Billing = require("../models/Billing");

// @route   POST /api/sales
// @desc    Submit new sales order form
// @route   POST /api/sales
// @desc    Submit new sales order form and create billing entry

function calculateNextBillingDate(instruction, startDateStr) {
    const startDate = new Date(startDateStr);
    switch (instruction) {
        case "Monthly":
            startDate.setMonth(startDate.getMonth() + 1);
            break;
        case "Quarterly":
            startDate.setMonth(startDate.getMonth() + 3);
            break;
        case "Yearly":
            startDate.setFullYear(startDate.getFullYear() + 1);
            break;
        default:
            startDate.setMonth(startDate.getMonth() + 1); // default fallback
    }
    return startDate;
}

router.post("/", async (req, res) => {
    try {
        const newEntry = new SalesForm(req.body);
        const savedEntry = await newEntry.save();

        // Create initial billing entry
        const nextBillingDate = calculateNextBillingDate(savedEntry.billingInstructions, savedEntry.billingDate);
        const yearlyCost = parseFloat(savedEntry.yearlyCost || 0);

        // let yearlyCost = savedEntry.yearlyCost;

        // if (typeof yearlyCost === "string") {
        //     yearlyCost = parseFloat(yearlyCost);
        // }
        // if (isNaN(yearlyCost)) {
        //     yearlyCost = 0;
        // }


        const billing = new Billing({
            customerId: savedEntry._id,
            billingInstruction: savedEntry.billingInstructions,
            totalCost: yearlyCost,
            nextBillingDate,
            status: "Pending",
            invoiceNumber: `INV-${Date.now()}`,
        });

        await billing.save();

        res.status(201).json({ message: "Sales form and billing created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});


module.exports = router;
