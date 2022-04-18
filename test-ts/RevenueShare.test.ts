import BN from "bn.js";
import {
    RevenueShareInstance,
    TestERC20Instance,
} from "../types/truffle-contracts";
import { assertErrorReason, BN_ZERO, formatTokenAmount, parseTokenAmount, ZERO_ADDRESS } from "./helpers";

const TestERC20Contract = artifacts.require('TestERC20');
const RevenueShareContract = artifacts.require('RevenueShare');


const proportionDecimals = 2
const oortProportion = 65.5
const oortProportionBN = new BN(oortProportion * (10 ** proportionDecimals))

const envelopProportion = 100 - oortProportion

const balance = 1000
const balanceBN = formatTokenAmount(balance)

contract('RevenueShare', (accounts) => {
    // blockchain test setup
    const [owner, oortWithdrawlAddress, envelopWithdrawlAddress, otherAddress] = accounts
    console.log("owner                      ", owner)
    console.log("oortWithdrawlAddress       ", oortWithdrawlAddress)
    console.log("envelopWithdrawlAddress    ", envelopWithdrawlAddress)
    console.log('oortProportion             ', oortProportion)
    console.log('envelopProportion          ', envelopProportion)

    let erc20: TestERC20Instance
    let revenueShare: RevenueShareInstance

    before(async () => {
        erc20 = await TestERC20Contract.new({from: owner});
        console.log("erc20", erc20.address)
     
        revenueShare = await RevenueShareContract.new({from: owner})
        await revenueShare.initialize(erc20.address, oortWithdrawlAddress, envelopWithdrawlAddress, oortProportionBN, {from: owner});

        await erc20.mint(revenueShare.address, balanceBN, {from: owner})
    });

    it('balance test', async () => {
        const expectedEnvelopBalance = balance / 100 * envelopProportion
        const expectedOortBalance = balance / 100 * oortProportion

        const totalBalance = parseTokenAmount(await revenueShare.getTotalBalance())
        const envelopBalance = parseTokenAmount(await revenueShare.getEnvelopBalance())
        const oortBalance = parseTokenAmount(await revenueShare.getOortBalance())
        /*
        console.log('totalBalance:              ',  totalBalance)
        console.log('expectedEnvelopBalance:    ',  expectedEnvelopBalance)
        console.log('envelopBalance:            ',  envelopBalance)
        console.log('expectedOortBalance:       ',  expectedOortBalance)
        console.log('oortBalance:               ',  oortBalance)
        */
        
        expect(totalBalance).eq(balance.toString())
        expect(oortBalance).eq(expectedOortBalance.toString())
        expect(envelopBalance).eq(expectedEnvelopBalance.toString())
    });

    it('withdrawl test', async () => {
       
        const expectedEnvelopBalance = balance / 100 * envelopProportion
        const expectedOortBalance = balance / 100 * oortProportion

        await revenueShare.withdrawl({ from: oortWithdrawlAddress })

        const envelopBalance = parseTokenAmount(await erc20.balanceOf(envelopWithdrawlAddress))
        const oortBalance = parseTokenAmount(await erc20.balanceOf(oortWithdrawlAddress))
        const totalBalance = await revenueShare.getTotalBalance()

        // console.log('expectedEnvelopBalance:   ',  expectedEnvelopBalance.toString())
        // console.log('envelopBalance:           ',  envelopBalance.toString())
        // console.log('expectedOortBalance:   ',  expectedOortBalance.toString())
        // console.log('oortBalance:           ',  oortBalance.toString())
        
        expect(totalBalance.eq(BN_ZERO)).to.true
        expect(oortBalance).eq(expectedOortBalance.toString())
        expect(envelopBalance).eq(expectedEnvelopBalance.toString())
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
