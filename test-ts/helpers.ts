import { BN } from "bn.js";

const testTokenDecimals = 18;
export const parseDecimalValue = (value: number) => web3.utils.toBN(value * (10 ** testTokenDecimals));


export const EMPTY = ''
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const BN_ZERO = new BN(0)
export const BN_ONE = new BN(1)

export interface ITxError {
    reason: string
}

export function toTxError(error: any): ITxError {
    if(error['reason']) { return error }
    const data = error.data
    const errKey = Object.keys(data)[0];
    return data[errKey]
}

export async function assertErrorReason(func: () => Promise<any>, expectedReason: string): Promise<void> {
    try {
        await func()
    }
    catch(error: any) {
        const txErr = toTxError(error)
        expect(txErr.reason).to.eq(expectedReason)
    }
}