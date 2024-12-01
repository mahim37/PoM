import { useState } from "react";

const SendRawTransaction = ({ apiFn }: {apiFn: any}) => {
  const [network, setNetwork] = useState<string>("APTOS_TESTNET");
  const [instructions, setInstructions] = useState<any[]>([
    {
      keys: [
        {
          pubkey: "GQkXkHF8LTwyZiZUcBWwYJeJBFEqR4vRCV4J5Xe7zGiQ",
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: "Eeaq9tfNzk2f8ijdiHNZpjsBV96agB2F3bNmwx6fdVr6",
          isSigner: false,
          isWritable: true,
        },
      ],
      programId: "11111111111111111111111111111111",
      data: [2, 0, 0, 0, 128, 150, 152, 0, 0, 0, 0, 0],
    },
  ]);
  const [signers, setSigners] = useState<string[]>([
    "GQkXkHF8LTwyZiZUcBWwYJeJBFEqR4vRCV4J5Xe7zGiQ",
  ]);

  const sendTransaction = async () => {
    const requestData = {
    network_name: "APTOS_TESTNET",
    transaction: {
      transactions: [
        {
          function: "0x1::aptos_account::transfer", 
          typeArguments: [], 
          functionArguments:[ 
            "0xc987d0b6e06fdfad7d2b690561ab5f36641162893fe2fd0376fa222452d89365",
            100000000,
          ] 
        }
      ]
    }
    };

    apiFn(requestData)
      .then((result: any) => {
        console.log(result);
        console.log(result.jobId);
      })
      .catch((error: any) => {
        console.error(`error:`, error);
      });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Execute Raw Solana Transaction</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <textarea
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={JSON.stringify(instructions, null, 2)}
          onChange={(e) => setInstructions(JSON.parse(e.target.value))}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Signers
        </label>
        <input
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          value={signers.join(", ")}
          onChange={(e) => setSigners(e.target.value.split(", "))}
        />
      </div>
      <button
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
        onClick={sendTransaction}
      >
        Send Transaction
      </button>
    </div>
  );
};

export default SendRawTransaction;
