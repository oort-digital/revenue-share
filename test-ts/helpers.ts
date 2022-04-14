import { BN } from "bn.js";

const testTokenDecimals = 18;
export const parseDecimalValue = (value: number) => web3.utils.toBN(value * (10 ** testTokenDecimals));


export const EMPTY = ''
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const BN_ZERO = new BN(0)
export const BN_ONE = new BN(1)