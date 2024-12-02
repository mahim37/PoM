"use client"
import React, { useState, useEffect } from "react";
import { useLogout, useGetWallets } from "../../index"; // Path to the custom hook
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useOkto, OktoContextType } from "okto-sdk-react";
import SendRawTransaction from "../components/SendRawTransaction";

const Page = () => {
  const handleLogout = useLogout();
  const getWallets = useGetWallets();
  const [likes, setLikes] = useState<number[]>([0, 0]);
  const [dislikes, setDislikes] = useState<number[]>([0, 0]);
  const [walletsVisible, setWalletsVisible] = useState(false);
  const [walletsData, setWalletsData] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { executeRawTransaction } = useOkto() as OktoContextType;

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  const backendUrl = "http://localhost:8000";
  const sendScoreUpdate = async (username: string, multiplier: number) => {
    try {
      const response = await fetch(`${backendUrl}/getScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          multiplier,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update score");
      }

      const data = await response.json();
      console.log("Score updated:", data.score);

      // Debugging logs
      console.log("Passing executeRawTransaction to sendTransaction");
      console.log("Score:", data.score);

      if (data.score !== undefined) {
        const requestData = {
          network_name: "APTOS_TESTNET",
          transaction: {
            transactions: [
              {
                function:
                  "0xc987d0b6e06fdfad7d2b690561ab5f36641162893fe2fd0376fa222452d89365::main_module_working_sure::add_token_votes",
                typeArguments: [],
                functionArguments: ["temp_meme", Math.round(data.score)],
              },
            ],
          },
        };

        const res = await executeRawTransaction(requestData);
        console.log(res);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleLike = (index: number) => {
    const confirmLike = confirm(
      "Are you sure you want to like this? Your decision cannot be reverted."
    );
    if (!confirmLike) return;

    const newLikes = [...likes];
    newLikes[index] += 1;
    setLikes(newLikes);
    sendScoreUpdate("manan", 1); // Update score for "manan" with multiplier +1
  };

  const handleDislike = (index: number) => {
    const confirmDislike = confirm(
      "Are you sure you want to dislike this? Your decision cannot be reverted."
    );
    if (!confirmDislike) return;

    const newDislikes = [...dislikes];
    newDislikes[index] += 1;
    setDislikes(newDislikes);
    sendScoreUpdate("manan", -1); // Update score for "manan" with multiplier -1
  };

  const images = [
    "https://crossmint.myfilebase.com/ipfs/QmZHAwoi3AgvGxdiPaEtYdp97SDEHEmJqJyWmsVrmaX6bH",
    "https://crossmint.myfilebase.com/ipfs/QmQkHRGk4exbXfVNp9UyHerjNjKZZDLeejyw4WZaA8eXzo",
  ];

  const handleGetWallets = async () => {
    try {
      const wallets = await getWallets;
      setWalletsData(wallets);
      setWalletsVisible(true);
    } catch (error) {
      console.error("Failed to get wallets:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-5 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        Okto Logout
      </button>
      <button
        onClick={handleGetWallets}
        className="absolute top-4 left-4 px-5 py-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        Get Wallets
      </button>

      <h1 className="text-3xl font-bold mb-10 text-purple-300">NFT's</h1>
      <div className="flex flex-col items-center gap-4 px-6 md:px-20">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-700 hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-64 h-60 object-cover rounded-md mb-4"
            />
            <div className="flex space-x-6">
              <button
                onClick={() => handleLike(index)}
                className="px-4 py-2 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                👍 Like ({likes[index]})
              </button>
              <button
                onClick={() => handleDislike(index)}
                className="px-4 py-2 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                👎 Dislike ({dislikes[index]})
              </button>
            </div>
          </div>
        ))}
      </div>
      {walletsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-gray-800 rounded-lg w-11/12 max-w-2xl p-6">
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-purple-300">Wallets</h2>
              <button
                className="text-gray-400 hover:text-gray-200"
                onClick={() => setWalletsVisible(false)}
              >
                &times;
              </button>
            </div>
            <div className="text-left text-gray-100 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(walletsData, null, 2)}
              </pre>
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={() => setWalletsVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
