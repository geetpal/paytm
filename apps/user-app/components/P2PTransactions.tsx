
import { Card } from "@repo/ui/card"

export const P2PTransactions = ({transactions}: {
    transactions: {
        time: Date,
        amount: number,
        fromUserId: number,
        toUserId: number
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Peer to Peer Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Peer to Peer Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div className="text-sm">
                        Sent INR
                </div>
                <div className="text-slate-600 text-sm">
                        {t.time.toDateString()}
                </div>
                <div className="text-sm">From user {t.fromUserId}</div>
                <div className="text-sm">To user {t.toUserId}</div>
                <div className="flex flex-col justify-center">
                    Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}