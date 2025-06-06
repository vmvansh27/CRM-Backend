
// const express = require("express");
// const router = express.Router();
// const SalesForm = require("../models/SalesForm");
// const Billing = require("../models/Billing");

// function calculateNextBillingDate(instruction, startDateStr) {
//     const startDate = new Date(startDateStr);
//     switch (instruction) {
//         case "Monthly":
//             startDate.setMonth(startDate.getMonth() + 1);
//             break;
//         case "Quarterly":
//             startDate.setMonth(startDate.getMonth() + 3);
//             break;
//         case "Half Yearly":
//             startDate.setMonth(startDate.getMonth() + 6);
//             break;
//         case "Annually":
//         case "Yearly":
//             startDate.setFullYear(startDate.getFullYear() + 1);
//             break;
//         case "Triennially":
//             startDate.setFullYear(startDate.getFullYear() + 3);
//             break;
//         default:
//             startDate.setMonth(startDate.getMonth() + 1); // default to monthly
//     }
//     return startDate;
// }

// // ✅ Create Sales Entry and Billing Document
// router.post("/", async (req, res) => {
//     try {
//         console.log("Incoming Sales Form:", req.body);

//         // Save the sales form
//         const newEntry = new SalesForm(req.body);
//         const savedEntry = await newEntry.save();

//         // Map services to billing
//         const billingServices = (savedEntry.services || []).map(service => ({
//             serviceName: service.serviceName,
//             billingInstruction: service.billingInstruction,
//             cost: parseFloat(service.cost) || 0,
//             nextBillingDate: calculateNextBillingDate(service.billingInstruction, service.billingDate),
//             status: "Pending",
//             invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//             notes: ""
//         }));

//         // Save billing info
//         const billing = new Billing({
//             customerId: savedEntry._id,
//             services: billingServices
//         });

//         await billing.save();

//         res.status(201).json({ message: "Sales form and billing created successfully" });
//     } catch (error) {
//         console.error("Error creating sales/billing entry:", error);
//         res.status(500).json({ error: "Something went wrong", details: error.message });
//     }
// });

// // ✅ Lookup company by name
// router.get('/company/:companyName', async (req, res) => {
//     const { companyName } = req.params;
//     try {
//         const company = await SalesForm.findOne({
//             companyName: { $regex: `^${companyName}$`, $options: 'i' }
//         });

//         if (!company) {
//             return res.status(404).json({ error: 'Company not found' });
//         }

//         res.json({ company });
//     } catch (error) {
//         console.error('Error fetching company:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const SalesForm = require("../models/SalesForm");
const Billing = require("../models/Billing");
const Company = require("../models/Company");

function calculateNextBillingDate(instruction, startDateStr) {
    const startDate = new Date(startDateStr);
    switch (instruction) {
        case "Monthly":
            startDate.setMonth(startDate.getMonth() + 1);
            break;
        case "Quarterly":
            startDate.setMonth(startDate.getMonth() + 3);
            break;
        case "Half Yearly":
            startDate.setMonth(startDate.getMonth() + 6);
            break;
        case "Annually":
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

// ✅ Create SalesForm and Billing, using Company reference
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

        // Check if company exists
        // let company = await Company.findOne({ companyName: { $regex: `^${companyName}$`, $options: 'i' } });

        let company = await Company.findOne({ companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } });


        if (!company) {
            // Create new company if not exists
            company = new Company({ companyName, customerName, email, mobile, address });
            await company.save();
        }

        // Create SalesForm with companyId
        const newSalesForm = new SalesForm({
            companyId: company._id,
            referenceSource,
            services,
            yearlyCost,
            serviceCommitments,
            demoStatus,
            backup,
            filledBy
        });
        const savedForm = await newSalesForm.save();

        // Prepare Billing services
        const billingServices = (services || []).map(service => ({
            serviceName: service.serviceName,
            billingInstruction: service.billingInstruction,
            cost: parseFloat(service.cost) || 0,
            nextBillingDate: calculateNextBillingDate(service.billingInstruction, service.billingDate),
            status: "Pending",
            invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            notes: ""
        }));

        const billing = new Billing({
            companyId: company._id,
            services: billingServices
        });

        await billing.save();

        res.status(201).json({ message: "SalesForm and Billing created successfully." });

    } catch (error) {
        console.error("Error creating sales/billing entry:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

// ✅ Lookup company by name
router.get('/company/:companyName', async (req, res) => {
    const { companyName } = req.params;
    try {
        const company = await Company.findOne({
            companyName: { $regex: `^${companyName}$`, $options: 'i' }
        });

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json({ company });
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
