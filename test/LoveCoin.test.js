const { assert } = require("chai");

const LoveCoin = artifacts.require("../src/contracts/LoveCoin");

require("chai")
    .use(require("chai-as-promised"))
    .should();

//Helper function to convert readable tokens to contract tokens
function tokens(n){
    return web3.utils.toWei(n,"ether");
}


contract("LoveCoin",([dev,man,woman])=>{
    let loveCoin;

    before(async()=>{
        //set up contracts
        loveCoin = await LoveCoin.new(tokens('100'),{from:dev});
    });

    describe("LoveCoin token deployment",async()=>{
        it("has a name", async()=>{
            const name = await loveCoin.name();
            assert.equal(name,"Love Coin");
        });
        it("has a symbol",async()=>{
            const symbol = await loveCoin.symbol();
            assert.equal(symbol,"LUV");
        });
        it("Sent dev fee",async()=>{
            let balance = await loveCoin.balanceOf(dev);
            assert.equal(balance,tokens('100'));
        });
    });

    describe("sign up two users",async()=>{
        it("Signs up new man",async()=>{
            const handle = "@big_burly_guy";
            await loveCoin.join(true,handle,{from:man});
            let user = await loveCoin.users(man);
            assert.equal(user.male,true,"user is male");
            assert.equal(user.score,'0',"score starts at 0");
            assert.equal(user.handle,handle,"handle is set");
        });
        it("Signs up new woman",async()=>{
            const handle = "@great_gal";
            await loveCoin.join(false,handle,{from:woman});
            let user = await loveCoin.users(woman);
            assert.equal(user.male,false,"user is female");
            assert.equal(user.male,'0',"score starts at 0");
            assert.equal(user.handle,handle,"handle is set");
        });
        it("Fills user arrays correctly",async()=>{
            let males = await loveCoin.maleUserCount();
            let females = await loveCoin.femaleUserCount();
            assert.equal(males,1,"one male user");
            assert.equal(females,1,"one female user");
        });
        it("Does not add new user when someone edits existing account",async()=>{
            let malesBefore = await loveCoin.maleUserCount().toString();
            await loveCoin.join(true,"new",{from:man});
            let malesAfter = await loveCoin.maleUserCount().toString();
            assert.equal(malesBefore,malesAfter);
        });
    });

    describe("like system",async()=>{
        it("man sends like",async()=>{
            await loveCoin.like(woman,{from:man});
            let like = await loveCoin.have_liked(woman,0);
            assert.equal(like,man,"Man's address shows up on have_liked list");
        });
        it("woman approves like",async()=>{
            await loveCoin.accept(man,{from:woman});
            let wbalance = await loveCoin.balanceOf(woman);
            let mbalance = await loveCoin.balanceOf(man);
            assert.isAbove(wbalance.toNumber(), 0, "Woman's loveCoin balance increases after accepting");
            assert.isAbove(mbalance.toNumber(),0, "Man's loveCoin balance increases after accpeting");
        });
    });
});