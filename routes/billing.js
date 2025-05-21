const express = require("express");
const router = express.Router();
const Billing = require("../models/Billing");

// GET /api/billing - fetch all billing entries with customer data
router.get("/", async (req, res) => {
    try {
        const billings = await Billing.find().populate("customerId", "companyName customerName billingInstructions");
        res.json(billings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch billing data", details: error.message });
    }
});

module.exports = router;
