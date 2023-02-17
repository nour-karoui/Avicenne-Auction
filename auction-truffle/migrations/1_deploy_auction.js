const AuctionsFactory = artifacts.require("AuctionsFactory");

module.exports = (deployer) => {
    deployer.deploy(AuctionsFactory);
}