"useClient"
import { useBalance } from "@repo/store/useBalance";

export function ClientBalance(){
    const balance = useBalance();
    return <div>
        hi there {balance}
    </div>
}


