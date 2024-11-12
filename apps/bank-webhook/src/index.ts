import express from "express";
import db from "@repo/db/client"
const app = express()

app.use(express.json())

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {

        //TODO: Add zod validation here?
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount
    }
    // Update balance in db, add txn
    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]),
            res.json({
                message: "Captured"
            })
    } catch (e) {
        console.log(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})

app.listen(3003);