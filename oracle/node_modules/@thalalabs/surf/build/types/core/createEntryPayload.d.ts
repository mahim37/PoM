import type { ABIRoot, EntryPayload, EntryRequestPayload } from '../types/index.js';
import { EntryFunctionName } from '../types/extractor/functionExtractor.js';
/**
 * Create a payload for calling a entry function.
 *
 * @param abi The ABI JSON contains the entry function. For type inference and encoding/decoding purpose.
 * @param payload.function The function name.
 * @param payload.arguments The input arguments for function.
 * @param payload.type_arguments The generic type arguments for function.
 * @returns The payload object to be used in `simulateTransaction` or `submitTransaction` method.
 * @example
 * const payload = createEntryPayload(COIN_ABI, {
 *   function: 'transfer',
 *   functionArguments: ['0x1', 1],
 *   typeArguments: ['0x1::aptos_coin::AptosCoin'],
 * });
 *
 * const result = await client.submitTransaction({
 *   payload,
 *   signer: account,
 * });
 */
export declare function createEntryPayload<T extends ABIRoot, TFuncName extends EntryFunctionName<T>>(abi: T, payload: EntryRequestPayload<T, TFuncName>): EntryPayload;
//# sourceMappingURL=createEntryPayload.d.ts.map