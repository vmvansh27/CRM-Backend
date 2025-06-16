const express = require("express");
const router = express.Router();
const SalesForm = require("../models/SalesForm");
const Billing = require("../models/Billing");
const Company = require("../models/Company");

function calculateInstallment(sellingPrice, billingInstruction) {
    if (billingInstruction === "Monthly") return sellingPrice;
    if (billingInstruction === "Quarterly") return sellingPrice / 4;
    if (billingInstruction === "HalfYearly") return sellingPrice / 2;
    if (billingInstruction === "Yearly") return sellingPrice;
    return sellingPrice;
}

function calculateNextBillingDate(instruction, startDateStr) {
    const startDate = new Date(startDateStr);
    switch (instruction) {
        case "Monthly":
            startDate.setMonth(startDate.getMonth() + 1);
            break;
        case "Quarterly":
            startDate.setMonth(startDate.getMonth() + 3);
            break;
        case "HalfYearly":
            startDate.setMonth(startDate.getMonth() + 6);
            break;
        case "Yearly":
            startDate.setFullYear(startDate.getFullYear() + 1);
            break;
        case "Triennially":
            startDate.setFullYear(startDate.getFullYear() + 3);
            break;
        default:
            startDate.setMonth(startDate.getMonth() + 1);
    }
    return startDate;
}

router.post("/", async (req, res) => {
    try {
        const {
            companyName,
            customerName,
            email,
            mobile,
            address,
            referenceSource,
            services,
            yearlyCost,
            serviceCommitments,
            demoStatus,
            backup,
            filledBy
        } = req.body;

        let company = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });

        if (!company) {
            company = new Company({ companyName, customerName, email, mobile, address, services, filledBy });
            await company.save();
        } else {
            const existingNames = company.services.map(s => s.serviceName.toLowerCase());
            const newServices = services?.filter(s => !existingNames.includes(s.serviceName.toLowerCase())) || [];

            if (newServices.length > 0) {
                company.services.push(...newServices);
                await company.save();
            }
        }

        const newSalesForm = new SalesForm({ companyId: company._id, referenceSource, services, yearlyCost, serviceCommitments, demoStatus, backup, filledBy });

        await newSalesForm.save();

        // Prepare Billing services with installment and nextBillingDate
        const billingServices = (services || []).map(service => ({
            serviceName: service.serviceName,
            costPrice: parseFloat(service.costPrice) || 0,
            sellingPrice: parseFloat(service.sellingPrice) || 0,
            billingInstruction: service.billingInstruction,
            cost: parseFloat(service.sellingPrice) * 12 || 0,
            installment: calculateInstallment(parseFloat(service.sellingPrice), service.billingInstruction),
            nextBillingDate: calculateNextBillingDate(service.billingInstruction, service.billingDate),
            status: "Pending",
            invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            notes: ""
        }));

        const billing = new Billing({ companyId: company._id, services: billingServices });
        await billing.save();

        res.status(201).json({ message: "SalesForm and Billing created successfully." });

    } catch (error) {
        console.error("Error creating sales/billing entry:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

// ✅ Lookup company by name
router.get('/company/:companyName', async (req, res) => {
    try {
        const regex = new RegExp(req.params.companyName, 'i'); // case-insensitive match
        const companies = await Company.find({ companyName: { $regex: regex } });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
