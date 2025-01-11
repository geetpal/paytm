import { getServerSession } from "next-auth";
import { P2PTransactions } from "../../../components/P2PTransactions"
import { SendCard } from "../../../components/SendCard"
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getP2PTransactions(){
    const session = await getServerSession(authOptions);
    const p2ptxn = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return p2ptxn.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        fromUserId: t.fromUserId,
        toUserId: t.toUserId
    }))
}


export default async function(){
    const p2ptransactions = await getP2PTransactions();

    return <div className="w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4 bg-slate-500">
                    <div>
                    <SendCard />
                    </div>
                    <div>
                        <P2PTransactions transactions={p2ptransactions} />
                    </div>
                </div>
    
</div>
}
