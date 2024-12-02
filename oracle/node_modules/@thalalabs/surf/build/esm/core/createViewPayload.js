import { ensureNumber } from '../ensureTypes.js';
import { parseTypeTag, } from '@aptos-labs/ts-sdk';
export function createViewPayload(abi, payload) {
    const fnAbi = abi.exposed_functions.filter((f) => f.name === payload.function)[0];
    const type_arguments = payload.typeArguments;
    const val_arguments = payload.functionArguments;
    if (fnAbi === undefined)
        throw new Error(`Function ${payload.function} not found in ABI`);
    if (fnAbi.params.length !== val_arguments.length)
        throw new Error(`Function ${payload.function} expects ${fnAbi.params.length} arguments, but ${payload.functionArguments.length} were provided`);
    if (fnAbi.generic_type_params.length !== type_arguments.length)
        throw new Error(`Function ${payload.function} expects ${fnAbi.generic_type_params.length} type arguments, but ${payload.functionArguments.length} were provided`);
    const args = fnAbi.params.map((type, i) => {
        const arg = payload.functionArguments[i];
        if (['u8', 'u16', 'u32'].includes(type)) {
            return ensureNumber(arg);
        }
        else if (['u64', 'u128', 'u256'].includes(type)) {
            if (!arg?.toString) {
                throw new Error(`Expecting a bigint, but got ${arg}`);
            }
            return arg.toString();
        }
        else if (type.includes('vector')) {
            return encodeVector(type, arg);
        }
        else {
            return arg;
        }
    });
    return {
        function: `${payload.address ?? abi.address}::${abi.name}::${payload.function}`,
        functionArguments: args,
        typeArguments: payload.typeArguments,
        abi: constructViewAbiObj(fnAbi),
    };
}
function constructViewAbiObj(abi) {
    if (!abi.is_view) {
        throw new Error(`not an view function`);
    }
    const params = [];
    for (let i = 0; i < abi.params.length; i += 1) {
        params.push(parseTypeTag(abi.params[i], { allowGenerics: true }));
    }
    const returnTypes = [];
    for (let i = 0; i < abi.return.length; i += 1) {
        returnTypes.push(parseTypeTag(abi.return[i], { allowGenerics: true }));
    }
    return {
        typeParameters: abi.generic_type_params,
        parameters: params,
        returnTypes,
    };
}
function encodeVector(type, value) {
    const regex = /vector<([^]+)>/;
    const match = type.match(regex);
    if (!match) {
        throw new Error(`Unsupported type: ${type}`);
    }
    const innerType = match[1];
    if (!innerType) {
        throw new Error(`Unsupported type: ${type}`);
    }
    if (innerType === 'u8') {
        if (typeof value === 'string' || value instanceof Uint8Array)
            return value;
        if (Array.isArray(value)) {
            return value;
        }
        throw new Error(`Invalid u8 value: ${value}`);
    }
    else if (['bool', 'u16', 'u32'].includes(innerType)) {
        return value;
    }
    else if (['u64', 'u128', 'u256'].includes(innerType)) {
        return value.map((v) => v.toString());
    }
    else {
        return value;
    }
}
//# sourceMappingURL=createViewPayload.js.map