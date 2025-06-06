

const express = require("express");
const router = express.Router();
const Billing = require("../models/Billing");
const Company = require("../models/Company");

// GET /api/billing - fetch all billing entries with company info
router.get("/", async (req, res) => {
    try {
        const billings = await Billing.find()
            .populate("companyId", "companyName customerName email mobile") // Updated to "companyId"
            .lean();

        // Format for frontend
        const formatted = billings.map(b => ({
            _id: b._id,
            companyName: b.companyId?.companyName || "Unknown",
            customerName: b.companyId?.customerName || "Unknown",
            email: b.companyId?.email || "",
            mobile: b.companyId?.mobile || "",
            services: b.services || []
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch billing data", details: error.message });
    }
});

// PATCH /api/billing/:billingId/service/:index - toggle a service status
router.patch("/:billingId/service/:index", async (req, res) => {
    const { billingId, index } = req.params;
    const { status } = req.body;

    try {
        const billing = await Billing.findById(billingId);
        if (!billing) {
            return res.status(404).json({ error: "Billing document not found" });
        }

        if (!billing.services || !billing.services[index]) {
            return res.status(404).json({ error: "Service index not found" });
        }

        billing.services[index].status = status;
        await billing.save();

        res.json({ message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update service status", details: error.message });
    }
});

module.exports = router;
