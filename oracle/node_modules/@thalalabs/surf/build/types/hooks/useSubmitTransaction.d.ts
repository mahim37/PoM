import type { EntryPayload } from '../types/index.js';
import { InputGenerateTransactionOptions } from '@aptos-labs/ts-sdk';
export declare const useSubmitTransaction: () => {
    submitTransaction: (payload: EntryPayload, options?: InputGenerateTransactionOptions) => Promise<any>;
    reset: () => void;
    isLoading: boolean;
    isIdle: boolean;
    data: any;
    error: Error | undefined;
};
//# sourceMappingURL=useSubmitTransaction.d.ts.map