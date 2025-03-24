require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/7e173d4b8e214008a851bd204b19de68",
      accounts: ["820721dcb7f17fd0f3c49b91108daa773ba8f05e117ac70fee364cf6e60e7f39"]
    }
  }
};