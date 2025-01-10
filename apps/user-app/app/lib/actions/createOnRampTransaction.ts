"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        return {
            message: "User not logged in"
        }
    }
    const token = Math.random().toString();
    await prisma.onRampTransaction.create(
        {
            data: {
                userId: Number(userId),
                amount,
                provider,
                token,
                startTime: new Date(),
                status: "Processing",
            }
        })

    return {
        message: "On ramp transaction captured"
    }
}