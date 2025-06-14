const express = require("express");
const router = express.Router();
const ServiceDetails = require("../models/ServiceDetails");
const Company = require("../models/Company");

// GET all service details (optionally by company)
router.get("/", async (req, res) => {
    try {
        const { companyId } = req.query;
        const query = companyId ? { companyId } : {};
        const data = await ServiceDetails.find(query).populate("companyId", "companyName customerName email");
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch service details", details: error.message });
    }
});

// POST or UPDATE service details
router.post("/", async (req, res) => {
    try {
        const { companyId, serviceName, ip, config, portNo } = req.body;

        const existing = await ServiceDetails.findOne({ companyId, serviceName });

        if (existing) {
            existing.ip = ip;
            existing.config = config;
            existing.portNo = portNo;
            await existing.save();
            return res.json({ message: "Service details updated", details: existing });
        }

        const newEntry = new ServiceDetails({ companyId, serviceName, ip, config, portNo });
        await newEntry.save();
        res.status(201).json({ message: "Service details saved", details: newEntry });
    } catch (error) {
        res.status(500).json({ error: "Failed to save service details", details: error.message });
    }
});

module.exports = router;