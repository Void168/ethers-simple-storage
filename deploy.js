const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

main = async () => {
  // compile them in our code
  // compile them separately
  // http://0.0.0.0:8545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  //   const encryptedJson = fs.readFileSync("./.encryptKey.json", "utf-8");
  //   let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //     encryptedJson,
  //     process.env.PRIVATE_KEY_PASSWORD
  //   );
  //   wallet = await wallet.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);
  console.log(`Contract Address: ${contract.address}`);
  // Get Number
  const currentFavouriteNumber = await contract.retrieve();
  console.log(`Current Favourite Number: ${currentFavouriteNumber.toString()}`);

  const transitionResponse = await contract.store("7");
  const transitionRecepit = await transitionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();
  console.log(`Updated favourite number is: ${updatedFavouriteNumber}`);
};

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
