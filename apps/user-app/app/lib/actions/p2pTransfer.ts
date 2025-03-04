"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(amount: number, to: string) {

    const session = await getServerSession(authOptions);
    const fromUser = session?.user?.id;

    const notLogged = "User not logged in"
    if (!fromUser) {
        return {
            notLogged
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    const message = "User not found"
    if (!toUser) {
        return {
            message
        }
    }
    try {
        await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUser)} FOR UPDATE`;
            const fromBalance = await tx.balance.findUnique({
                where: {
                    userId: Number(fromUser)
                }
            })
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient Funds")
            }

            await tx.balance.update({
                where: { userId: Number(fromUser) },
                data: { amount: { decrement: amount } }
            })


            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } }
            });

            await tx.p2pTransfer.create(
                {
                    data: {
                        amount,
                        timestamp: new Date(),
                        fromUserId: Number(fromUser),
                        toUserId: toUser.id
                    }
                })
        }
            // ,
            //     {
            //         isolationLevel: 'Serializable',
            //     }
        )
        const success = "Transfer Successful"
        return {
            success
        }
    } catch (error) {
        error || "Tranfer error"
    }
}