const LoveCoin = artifacts.require("../src/contracts/LoveCoin");

//Helper function to convert readable tokens to contract tokens
function tokens(n){
  return web3.utils.toWei(n,"ether");
}

module.exports = function (deployer, network, accounts) {
  deployer.deploy(LoveCoin,tokens('100'));
};