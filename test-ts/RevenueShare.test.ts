import BN from "bn.js";
import {
    RevenueShareInstance,
    TestERC20Instance,
} from "../types/truffle-contracts";
import { assertErrorReason, BN_ZERO, parseDecimalValue, ZERO_ADDRESS } from "./helpers";

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
        await assertErrorReason(() => revenueShare.withdrawl({ from: otherAddress }), 'Caller has no permision')
    });

    it('cannotset zero proportion', async () => {
        await assertErrorReason(() => revenueShare.setOortProportion(0, { from: owner }), 'Cannot set zero proportion')
    });

    it('cannot set proportion more than 100', async () => {
        await assertErrorReason(() => revenueShare.setOortProportion(101, { from: owner }), 'Cannot set proportion more that 100%')
    });

    it('cannot set envelopWithdrawlAddress zero', async () => {
        await assertErrorReason(() => revenueShare.setEnvelopWithdrawlAddress(ZERO_ADDRESS, { from: owner }), 'New envelopWithdrawlAddress is the zero address')
    });

    it('cannot set oortWithdrawlAddress zero', async () => {
        await assertErrorReason(() => revenueShare.setOortWithdrawlAddress(ZERO_ADDRESS, { from: owner }), 'New oortWithdrawlAddress is the zero address')
    });
})
