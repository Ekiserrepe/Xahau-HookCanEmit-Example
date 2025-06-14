const xrpl = require('xrpl');
const { derive, utils, signAndSubmit } = require("xrpl-accountlib");

const seed = 'your_seed';
const network = "wss://xahau-test.net";

async function connectAndQuery() {
  const client = new xrpl.Client('wss://xahau-test.net');
  const account = derive.familySeed(seed, { algorithm: "secp256k1" });
  console.log(`Account: ${JSON.stringify(account)}`);

  try {
    await client.connect();
    console.log('Connected to Xahau');
    const my_wallet = xrpl.Wallet.fromSeed(seed);
    const networkInfo = await utils.txNetworkAndAccountValues(network, account);

    const prepared = {
      "TransactionType": "SetHook",
      "Account": my_wallet.address,
      "Flags": 0,
      "Hooks": [
        {
          "Hook": {
            "HookHash": "319E16820BAEF9A08C51F52C97338D4CF09E6E53991B4131820A079721C64EA1",
            "HookNamespace": "0000000000000000000000000000000000000000000000000000000000000000",
            "HookOn": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFFFFFFF7FFFFFBFFFFE",
            "HookCanEmit": "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFBFFFFF",
          }
        }
      ],
      ...networkInfo.txValues,
    };

    const tx = await signAndSubmit(prepared, network, account);
    console.log("Info tx:", JSON.stringify(tx, null, 2)); 
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('Disconnected from Xahau');
  }
}


connectAndQuery();
