import BN from "bn.js";
import {
    RevenueShareInstance,
    TestERC20Instance,
} from "../types/truffle-contracts";
import { BN_ZERO, parseDecimalValue } from "./helpers";

const TestERC20Contract = artifacts.require('TestERC20');
const RevenueShareContract = artifacts.require('RevenueShare');

const oortProportion = 70
const envelopProportion = 100 - oortProportion

const balance = 100

contract('RevenueShare', (accounts) => {
    // blockchain test setup
    const [owner, oortWithdrawlAddress, envelopWithdrawlAddress, otherAddress] = accounts
    console.log("owner", owner)
    console.log("oortWithdrawlAddress", oortWithdrawlAddress)
    console.log("envelopWithdrawlAddress", envelopWithdrawlAddress)

    let erc20: TestERC20Instance
    let revenueShare: RevenueShareInstance

    before(async () => {
        erc20 = await TestERC20Contract.new({from: owner});
        console.log("erc20", erc20.address)
     
        revenueShare = await RevenueShareContract.new({from: owner})
        await revenueShare.initialize(erc20.address, oortWithdrawlAddress, envelopWithdrawlAddress, oortProportion, {from: owner});

        await erc20.mint(revenueShare.address, parseDecimalValue(balance), {from: owner})
    });

    it('balance test', async () => {
        
        const expectedTotalBalance = parseDecimalValue(balance)

        const expectedEnvelopBalance = parseDecimalValue(balance / 100 * envelopProportion)
        const expectedOortBalance = parseDecimalValue(balance / 100 * oortProportion)

        const totalBalance = await revenueShare.getTotalBalance()
        const envelopBalance = await revenueShare.getEnvelopBalance()
        const oortBalance = await revenueShare.getOortBalance()
       
        // console.log('expectedEnvelopBalance:   ',  expectedEnvelopBalance.toString())
        // console.log('envelopBalance:           ',  envelopBalance.toString())
        // console.log('expectedOortBalance:   ',  expectedOortBalance.toString())
        // console.log('oortBalance:           ',  oortBalance.toString())
        
        expect(totalBalance.eq(expectedTotalBalance)).to.true
        expect(oortBalance.eq(expectedOortBalance)).to.true
        expect(envelopBalance.eq(expectedEnvelopBalance)).to.true
    });

    it('withdrawl test', async () => {
       
        const expectedEnvelopBalance = parseDecimalValue(balance / 100 * envelopProportion)
        const expectedOortBalance = parseDecimalValue(balance / 100 * oortProportion)

        await revenueShare.withdrawl({ from: oortWithdrawlAddress })

        const envelopBalance = await erc20.balanceOf(envelopWithdrawlAddress)
        const oortBalance = await erc20.balanceOf(oortWithdrawlAddress)
        const totalBalance = await revenueShare.getTotalBalance()

        // console.log('expectedEnvelopBalance:   ',  expectedEnvelopBalance.toString())
        // console.log('envelopBalance:           ',  envelopBalance.toString())
        // console.log('expectedOortBalance:   ',  expectedOortBalance.toString())
        // console.log('oortBalance:           ',  oortBalance.toString())
        
        expect(totalBalance.eq(BN_ZERO)).to.true
        expect(oortBalance.eq(expectedOortBalance)).to.true
        expect(envelopBalance.eq(expectedEnvelopBalance)).to.true
    });

    it('withdrawl no premission', async () => {
        try {
            await revenueShare.withdrawl({ from: otherAddress })
        }
        catch(error: any) {
            const data = error.data
            const errKey = Object.keys(data)[0];
            expect(data[errKey].reason).to.eq('Caller has no permision')
        }

     
    });

});
