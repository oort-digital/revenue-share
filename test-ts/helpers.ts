import { BN } from "bn.js";


const tenBN = new BN(10)


const getUnit = (decimals: number): 'ether' => {

/*
noether: ‘0’
wei: ‘1’
kwei: ‘1000’
Kwei: ‘1000’
babbage: ‘1000’
femtoether: ‘1000’
mwei: ‘1000000’
Mwei: ‘1000000’
lovelace: ‘1000000’
picoether: ‘1000000’
gwei: ‘1000000000’
Gwei: ‘1000000000’
shannon: ‘1000000000’
nanoether: ‘1000000000’
nano: ‘1000000000’
szabo: ‘1000000000000’
microether: ‘1000000000000’
micro: ‘1000000000000’
finney: ‘1000000000000000’
milliether: ‘1000000000000000’
milli: ‘1000000000000000’
ether: ‘1000000000000000000’
kether: ‘1000000000000000000000’
grand: ‘1000000000000000000000’
mether: ‘1000000000000000000000000’
gether: ‘1000000000000000000000000000’
tether: ‘1000000000000000000000000000000’
*/
    const decimalsBN = new BN(decimals)
    const unitValue = tenBN.pow(decimalsBN).toString()

    if(unitValue === '1000000000000000000') {
        return 'ether'
    }

    throw new Error(`add mapping for ${unitValue}`)
}

export const formatTokenAmount = (value: number, decimals: number = 18) => {
    if(decimals < 3) {
        throw new Error('decimals must be 3 or more')
    }
    const unit = getUnit(decimals)
    return web3.utils.toWei(new BN(value), unit)
}


export const parseTokenAmount = (value: BN, decimals: number = 18): string => {
    if(decimals < 3) {
        throw new Error('decimals must be 3 or more')
    }
    const unit = getUnit(decimals)
    return web3.utils.fromWei(value, unit)
}

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