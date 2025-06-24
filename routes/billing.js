

// const express = require("express");
// const router = express.Router();
// const Company = require("../models/Company");
// const Billing = require("../models/Billing");
// const SalesForm = require("../models/SalesForm"); // <- Import your sales form

// function getPeriod(instruction) {
//     if (instruction.toLowerCase() === "half-yearly") return 6;
//     if (instruction.toLowerCase() === "quarterly") return 3;
//     if (instruction.toLowerCase() === "yearly") return 12;
//     return 1; // Monthly by default
// }

// function getInstallments(instruction) {
//     if (instruction.toLowerCase() === "half-yearly") return 2;
//     if (instruction.toLowerCase() === "quarterly") return 4;
//     if (instruction.toLowerCase() === "yearly") return 1;
//     return 12; // Monthly by default
// }

// function calculateNextBillingDate(instruction, startDateStr) {
//     const start = new Date(startDateStr);
//     if (instruction.toLowerCase() === "half-yearly") {
//         start.setMonth(start.getMonth() + 6);
//     } else if (instruction.toLowerCase() === "quarterly") {
//         start.setMonth(start.getMonth() + 3);
//     } else if (instruction.toLowerCase() === "yearly") {
//         start.setFullYear(start.getFullYear() + 1);
//     } else { // Monthly by default
//         start.setMonth(start.getMonth() + 1);
//     }
//     return start;
// }

// // GET /api/billing - fetch all billing entries with company info
// router.get("/", async (req, res) => {
//     try {
//         const billings = await Billing.find()
//             .populate("companyId", "companyName customerName email mobile filledBy")
//             .lean();

//         // Loop through each billing and match with its sales form
//         const enriched = [];

//         for (const b of billings) {
//             // find matching sales form by companyId
//             const allSalesForms = await SalesForm.find({ companyId: b.companyId._id }).lean();


//             b.services = b.services?.map((s) => {
//                 if (sales && sales.services) {
//                     // match service by serviceName
//                     const matching = sales.services.find((item) =>
//                         item.serviceName === s.serviceName
//                     );
//                     if (matching) {
//                         const installmentCount = getInstallments(s.billingInstruction);
//                         return {
//                             ...s,
//                             costPrice: matching.costPrice,
//                             sellingPrice: matching.sellingPrice,
//                             totalCostPrice: matching.costPrice,
//                             totalSellingPrice: matching.sellingPrice,
//                             installment: matching.sellingPrice * getPeriod(s.billingInstruction),
//                         };
//                     }
//                 }
//                 return s;
//             });

//             enriched.push({
//                 _id: b._id,
//                 companyName: b.companyId?.companyName || "Unknown",
//                 customerName: b.companyId?.customerName || "Unknown",
//                 email: b.companyId?.email || "",
//                 mobile: b.companyId?.mobile || "",
//                 filledBy: b.companyId?.filledBy || "Unknown",
//                 services: b.services
//             });
//         }

//         res.json(enriched);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch billing data", details: error.message });
//     }
// });

// // PATCH /api/billing/:billingId/service/:index
// // Update service's next billing and add to payment history
// router.patch("/:billingId/service/:index", async (req, res) => {
//     const { billingId, index } = req.params;

//     try {
//         const billing = await Billing.findById(billingId);
//         if (!billing) {
//             return res.status(404).json({ error: "Billing not found" });
//         }
//         if (!billing.services || !billing.services[index]) {
//             return res.status(404).json({ error: "Service not found" });
//         }

//         // Push into paymentHistory
//         billing.services[index].paymentHistory = billing.services[index].paymentHistory || [];

//         billing.services[index].paymentHistory.push({
//             amount: billing.services[index].totalSellingPrice,
//             date: new Date(),
//             status: "Cleared"
//         });

//         // Update service's nextBillingDate and reset its status
//         billing.services[index].nextBillingDate = calculateNextBillingDate(
//             billing.services[index].billingInstruction,
//             billing.services[index].nextBillingDate
//         );

//         billing.services[index].status = "Pending";

//         await billing.save();

//         res.json({ message: "Status updated and next cycle set successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to update service", details: error.message });
//     }
// });

// // PATCH /api/billing/:billingId/service/:serviceIndex/billingNumber
// router.patch('/:billingId/service/:serviceIndex/billingNumber', async (req, res) => {
//     const { billingNumber } = req.body;
//     const { billingId, serviceIndex } = req.params;

//     try {
//         const billing = await Billing.findById(billingId);
//         if (!billing) return res.status(404).send("Billing record not found");

//         billing.services[serviceIndex].billingNumber = billingNumber;
//         await billing.save();
//         res.status(200).send("Billing number updated");
//     } catch (err) {
//         res.status(500).send("Failed to update billing number");
//     }
// });


// module.exports = router;



const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const Billing = require("../models/Billing");
const SalesForm = require("../models/SalesForm");

function getPeriod(instruction) {
    if (instruction.toLowerCase() === "half-yearly") return 6;
    if (instruction.toLowerCase() === "quarterly") return 3;
    if (instruction.toLowerCase() === "yearly") return 12;
    return 1; // Monthly by default
}

function getInstallments(instruction) {
    if (instruction.toLowerCase() === "half-yearly") return 2;
    if (instruction.toLowerCase() === "quarterly") return 4;
    if (instruction.toLowerCase() === "yearly") return 1;
    return 12; // Monthly by default
}

function calculateNextBillingDate(instruction, startDateStr) {
    const start = new Date(startDateStr);
    if (instruction.toLowerCase() === "half-yearly") {
        start.setMonth(start.getMonth() + 6);
    } else if (instruction.toLowerCase() === "quarterly") {
        start.setMonth(start.getMonth() + 3);
    } else if (instruction.toLowerCase() === "yearly") {
        start.setFullYear(start.getFullYear() + 1);
    } else {
        start.setMonth(start.getMonth() + 1);
    }
    return start;
}

// GET /api/billing - fetch all billing entries with company info
router.get("/", async (req, res) => {
    try {
        const billings = await Billing.find()
            .populate("companyId", "companyName customerName email mobile filledBy")
            .lean();

        const enriched = [];

        for (const b of billings) {
            const allSalesForms = await SalesForm.find({ companyId: b.companyId._id }).lean();

            b.services = b.services?.map((s) => {
                let matching = null;

                for (const form of allSalesForms) {
                    matching = form.services.find(
                        (item) => item.serviceName === s.serviceName
                    );
                    if (matching) break;
                }

                if (matching) {
                    const selling = Number(matching.sellingPrice) || 0;
                    const cost = Number(matching.costPrice) || 0;
                    const period = getPeriod(s.billingInstruction);

                    return {
                        ...s,
                        costPrice: cost,
                        sellingPrice: selling,
                        totalCostPrice: cost,
                        totalSellingPrice: selling,
                        installment: selling * period,
                    };
                }

                // fallback if not matched
                return {
                    ...s,
                    costPrice: 0,
                    sellingPrice: 0,
                    totalCostPrice: 0,
                    totalSellingPrice: 0,
                    installment: s.installment || 0,
                };
            });

            enriched.push({
                _id: b._id,
                companyName: b.companyId?.companyName || "Unknown",
                customerName: b.companyId?.customerName || "Unknown",
                email: b.companyId?.email || "",
                mobile: b.companyId?.mobile || "",
                filledBy: b.companyId?.filledBy || "Unknown",
                services: b.services
            });
        }

        res.json(enriched);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch billing data", details: error.message });
    }
});

// PATCH /api/billing/:billingId/service/:index
router.patch("/:billingId/service/:index", async (req, res) => {
    const { billingId, index } = req.params;

    try {
        const billing = await Billing.findById(billingId);
        if (!billing) {
            return res.status(404).json({ error: "Billing not found" });
        }
        if (!billing.services || !billing.services[index]) {
            return res.status(404).json({ error: "Service not found" });
        }

        billing.services[index].paymentHistory = billing.services[index].paymentHistory || [];

        billing.services[index].paymentHistory.push({
            amount: billing.services[index].totalSellingPrice,
            date: new Date(),
            status: "Cleared"
        });

        billing.services[index].nextBillingDate = calculateNextBillingDate(
            billing.services[index].billingInstruction,
            billing.services[index].nextBillingDate
        );

        billing.services[index].status = "Pending";

        await billing.save();

        res.json({ message: "Status updated and next cycle set successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update service", details: error.message });
    }
});

// PATCH billing number
router.patch('/:billingId/service/:serviceIndex/billingNumber', async (req, res) => {
    const { billingNumber } = req.body;
    const { billingId, serviceIndex } = req.params;

    try {
        const billing = await Billing.findById(billingId);
        if (!billing) return res.status(404).send("Billing record not found");

        billing.services[serviceIndex].billingNumber = billingNumber;
        await billing.save();
        res.status(200).send("Billing number updated");
    } catch (err) {
        res.status(500).send("Failed to update billing number");
    }
});

module.exports = router;
