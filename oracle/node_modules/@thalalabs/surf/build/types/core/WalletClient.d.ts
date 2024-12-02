import { useWallet } from '@aptos-labs/wallet-adapter-react';
import type { ABIRoot, ABIWalletClient, EntryPayload } from '../types/index.js';
type Wallet = ReturnType<typeof useWallet>;
export declare class WalletClient {
    private wallet;
    constructor({ wallet }: {
        wallet: Wallet;
    });
    submitTransaction(payload: EntryPayload): Promise<any>;
    useABI<T extends ABIRoot>(abi: T): ABIWalletClient<T>;
}
export {};
//# sourceMappingURL=WalletClient.d.ts.map