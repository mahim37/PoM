import {
    CrossbarClient,
    SwitchboardClient,
    Aggregator,
    ON_DEMAND_MAINNET_QUEUE,
    ON_DEMAND_TESTNET_QUEUE,
} from "@switchboard-xyz/aptos-sdk";

import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


const config = new AptosConfig({
    network: Network.TESTNET, // network a necessary param / if not passed in, full node url is required
});

const aptos = new Aptos(config);

const client = new SwitchboardClient(aptos);

