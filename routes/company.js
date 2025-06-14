const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

// POST /api/company - Create new company or append services if company exists
router.post("/", async (req, res) => {
    try {
        const companyNameTrimmed = req.body.companyName.trim();

        // let company = await Company.findOne({
        //     companyName: { $regex: `^${companyNameTrimmed}$`, $options: "i" },
        // });
        let company = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });




        if (company) {
            // Company exists — append new services if any
            if (req.body.services && Array.isArray(req.body.services)) {
                // Filter out services that already exist by serviceName, to avoid duplicates
                const existingServiceNames = company.services.map((s) =>
                    s.serviceName.toLowerCase()
                );

                const newServices = req.body.services.filter(
                    (s) => !existingServiceNames.includes(s.serviceName.toLowerCase())
                );

                if (newServices.length > 0) {
                    company.services.push(...newServices);
                    await company.save();
                    return res.json({
                        message: "New services appended to existing company",
                        company,
                    });
                } else {
                    return res.status(400).json({ message: "No new services to add" });
                }
            } else {
                return res.status(400).json({ message: "No services provided to add" });
            }
        } else {
            // Company does not exist — create new company
            const newCompany = new Company(req.body);
            await newCompany.save();
            return res.status(201).json({ message: "Company created", company: newCompany });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to create or update company", details: error.message });
    }
});

// GET /api/company - Get all companies (for dropdown etc.)
router.get("/", async (req, res) => {
    try {
        const companies = await Company.find().sort({ companyName: 1 });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch companies", details: error.message });
    }
});

// GET /api/company/:companyName - Get company by name
router.get("/:companyName", async (req, res) => {
    try {
        const company = await Company.findOne({
            companyName: { $regex: `^${req.params.companyName}$`, $options: "i" },
        });
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ error: "Error fetching company", details: error.message });
    }
});

// PATCH /api/company/:companyId/service/:serviceIndex - update service status
router.patch("/:companyId/service/:serviceIndex", async (req, res) => {
    try {
        const { companyId, serviceIndex } = req.params;
        const { status } = req.body;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        if (
            !company.services ||
            serviceIndex < 0 ||
            serviceIndex >= company.services.length
        ) {
            return res.status(400).json({ error: "Invalid service index" });
        }

        // Validate status value
        const validStatuses = ["Pending", "Paid"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        company.services[serviceIndex].status = status;
        await company.save();

        res.json({
            message: "Service status updated",
            service: company.services[serviceIndex],
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to update service status",
            details: error.message,
        });
    }
});

module.exports = router;