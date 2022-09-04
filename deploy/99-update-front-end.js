const { network, ethers } = require('hardhat');
require('dotenv').config();

const fs = require('fs');
const { getContractAddress } = require('ethers/lib/utils');
const FRONT_END_ADDRESSES_FILE =
  '../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json';
const FRONT_END_ABI_FILE =
  '../nextjs-smartcontract-lottery-fcc/constants/abi.json';

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log('Updating front end!');
    updateContractAddresses();
    updateAbi();
    console.log('updated');
  }
};

async function updateAbi() {
  const raffle = await ethers.getContract('Raffle');
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    raffle.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const raffle = await ethers.getContract('Raffle');
  const chainId = network.config.chainId.toString();
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, 'utf8')
  );

  if (network.config.chainId.toString() in currentAddresses) {
    if (
      !currentAddresses[network.config.chainId.toString()].includes(
        raffle.address
      )
    ) {
      currentAddresses[network.config.chainId.toString()].push(raffle.address);
    }
  } else {
    currentAddresses[network.config.chainId.toString()] = [raffle.address];
  }
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}

module.exports.tags = ['all', 'frontend'];
