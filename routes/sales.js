// // const express = require("express");
// // const router = express.Router();
// // const SalesForm = require("../models/SalesForm");
// // const Billing = require("../models/Billing");

// // // @route   POST /api/sales
// // // @desc    Submit new sales order form
// // // @route   POST /api/sales
// // // @desc    Submit new sales order form and create billing entry

// // function calculateNextBillingDate(instruction, startDateStr) {
// //     const startDate = new Date(startDateStr);
// //     switch (instruction) {
// //         case "Monthly":
// //             startDate.setMonth(startDate.getMonth() + 1);
// //             break;
// //         case "Quarterly":
// //             startDate.setMonth(startDate.getMonth() + 3);
// //             break;
// //         case "Yearly":
// //             startDate.setFullYear(startDate.getFullYear() + 1);
// //             break;
// //         default:
// //             startDate.setMonth(startDate.getMonth() + 1); // default fallback
// //     }
// //     return startDate;
// // }

// // router.post("/", async (req, res) => {
// //     try {
// //         const newEntry = new SalesForm(req.body);
// //         const savedEntry = await newEntry.save();

// //         // Create initial billing entry
// //         const nextBillingDate = calculateNextBillingDate(savedEntry.billingInstructions, savedEntry.billingDate);
// //         const yearlyCost = parseFloat(savedEntry.yearlyCost || 0);

// //         // let yearlyCost = savedEntry.yearlyCost;

// //         // if (typeof yearlyCost === "string") {
// //         //     yearlyCost = parseFloat(yearlyCost);
// //         // }
// //         // if (isNaN(yearlyCost)) {
// //         //     yearlyCost = 0;
// //         // }


// //         const billing = new Billing({
// //             customerId: savedEntry._id,
// //             billingInstruction: savedEntry.billingInstructions,
// //             totalCost: yearlyCost,
// //             nextBillingDate,
// //             status: "Pending",
// //             invoiceNumber: `INV-${Date.now()}`,
// //         });

// //         await billing.save();

// //         res.status(201).json({ message: "Sales form and billing created successfully" });
// //     } catch (error) {
// //         res.status(500).json({ error: "Something went wrong", details: error.message });
// //     }
// // });


// // module.exports = router;


// // const express = require("express");
// // const router = express.Router();
// // const SalesForm = require("../models/SalesForm");
// // const Billing = require("../models/Billing");

// // function calculateNextBillingDate(instruction, startDateStr) {
// //     const startDate = new Date(startDateStr);
// //     switch (instruction) {
// //         case "Monthly":
// //             startDate.setMonth(startDate.getMonth() + 1);
// //             break;
// //         case "Quarterly":
// //             startDate.setMonth(startDate.getMonth() + 3);
// //             break;
// //         case "Half Yearly":
// //             startDate.setMonth(startDate.getMonth() + 6);
// //             break;
// //         case "Annually":
// //         case "Yearly":
// //             startDate.setFullYear(startDate.getFullYear() + 1);
// //             break;
// //         case "Triennially":
// //             startDate.setFullYear(startDate.getFullYear() + 3);
// //             break;
// //         default:
// //             startDate.setMonth(startDate.getMonth() + 1);
// //     }
// //     return startDate;
// // }

// // // Create Sales Entry and Related Billings
// // router.post("/", async (req, res) => {
// //     try {
// //         const newEntry = new SalesForm(req.body);
// //         const savedEntry = await newEntry.save();

// //         const serviceBillings = savedEntry.services || [];

// //         for (const service of serviceBillings) {
// //             const nextBillingDate = calculateNextBillingDate(service.billingInstruction, service.billingDate);

// //             const billing = new Billing({
// //                 customerId: savedEntry._id,
// //                 serviceName: service.name,
// //                 billingInstruction: service.billingInstruction,
// //                 totalCost: parseFloat(service.cost) || 0,
// //                 nextBillingDate,
// //                 status: "Pending",
// //                 invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
// //             });

// //             await billing.save();
// //         }

// //         res.status(201).json({ message: "Sales form and billing created successfully" });
// //     } catch (error) {
// //         res.status(500).json({ error: "Something went wrong", details: error.message });
// //     }
// // });

// // // ✅ GET route to fetch company info by name

// // router.get('/company/:companyName', async (req, res) => {
// //     const { companyName } = req.params;
// //     try {
// //         const company = await SalesForm.findOne({
// //             companyName: { $regex: `^${companyName}$`, $options: 'i' }
// //         });

// //         if (!company) {
// //             return res.status(404).json({ error: 'Company not found' });
// //         }

// //         res.json({ company });
// //     } catch (error) {
// //         console.error('Error fetching company:', error);
// //         res.status(500).json({ error: 'Internal Server Error' });
// //     }
// // });




// // module.exports = router;



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
//             startDate.setMonth(startDate.getMonth() + 1);
//     }
//     return startDate;
// }

// // ✅ Create Sales Entry and single Billing document per customer
// router.post("/", async (req, res) => {
//     try {
//         console.log("Incoming Sales Form:", req.body);  // DEBUG LOG
//         // Save the sales form data
//         const newEntry = new SalesForm(req.body);
//         const savedEntry = await newEntry.save();

//         const billingServices = (savedEntry.services || []).map(service => ({
//             serviceName: service.serviceName,
//             billingInstruction: service.billingInstruction,
//             cost: parseFloat(service.cost) || 0,
//             nextBillingDate: calculateNextBillingDate(service.billingInstruction, service.billingDate),
//             status: "Pending",
//             invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//             notes: ""
//         }));

//         // Save billing entry
//         const billing = new Billing({
//             customerId: savedEntry._id,
//             services: billingServices
//         });

//         await billing.save();

//         res.status(201).json({ message: "Sales form and billing created successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Something went wrong", details: error.message });
//     }
// });


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
            startDate.setMonth(startDate.getMonth() + 1); // default to monthly
    }
    return startDate;
}

// ✅ Create Sales Entry and Billing Document
router.post("/", async (req, res) => {
    try {
        console.log("Incoming Sales Form:", req.body);

        // Save the sales form
        const newEntry = new SalesForm(req.body);
        const savedEntry = await newEntry.save();

        // Map services to billing
        const billingServices = (savedEntry.services || []).map(service => ({
            serviceName: service.serviceName,
            billingInstruction: service.billingInstruction,
            cost: parseFloat(service.cost) || 0,
            nextBillingDate: calculateNextBillingDate(service.billingInstruction, service.billingDate),
            status: "Pending",
            invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            notes: ""
        }));

        // Save billing info
        const billing = new Billing({
            customerId: savedEntry._id,
            services: billingServices
        });

        await billing.save();

        res.status(201).json({ message: "Sales form and billing created successfully" });
    } catch (error) {
        console.error("Error creating sales/billing entry:", error);
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
});

// ✅ Lookup company by name
router.get('/company/:companyName', async (req, res) => {
    const { companyName } = req.params;
    try {
        const company = await SalesForm.findOne({
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
