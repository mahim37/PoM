import { ABIRoot, ExtractReturnType, ViewFunctionName, ViewPayload, ViewRequestPayload } from '../types/index.js';
/**
 * Create a payload for calling a view function.
 *
 * @param abi The ABI JSON contains the view function. For type inference and encoding/decoding purpose.
 * @param payload.function The function name.
 * @param payload.arguments The input arguments for function.
 * @param payload.type_arguments The generic type arguments for function.
 * @returns The payload object to be used in `view` method.
 * @example
 * const payload = createViewPayload(COIN_ABI, {
 *   function: 'balance',
 *   functionArguments: ['0x1'],
 *   typeArguments: ['0x1::aptos_coin::AptosCoin'],
 * });
 * const [balance] = await client.view({ payload });
 */
export declare function createViewPayload<T extends ABIRoot, TFuncName extends ViewFunctionName<T>>(abi: T, payload: ViewRequestPayload<T, TFuncName>): ViewPayload<ExtractReturnType<T, TFuncName>>;
//# sourceMappingURL=createViewPayload.d.ts.map