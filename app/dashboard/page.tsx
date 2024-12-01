"use client";
import React, { useState, useEffect } from "react";
import { useLogout } from "../../index"; // Path to the custom hook
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const handleLogout = useLogout();
  const [likes, setLikes] = useState<number[]>([0, 0]); // Two images, initial likes/dislikes are 0
  const [dislikes, setDislikes] = useState<number[]>([0, 0]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session) {
      router.push("/"); // Redirect to home if not logged in
    }
  }, [session, status, router]);

  const handleLike = (index: number) => {
    const newLikes = [...likes];
    newLikes[index] += 1;
    setLikes(newLikes);
  };

  const handleDislike = (index: number) => {
    const newDislikes = [...dislikes];
    newDislikes[index] += 1;
    setDislikes(newDislikes);
  };

  const images = [
    "https://crossmint.myfilebase.com/ipfs/QmZHAwoi3AgvGxdiPaEtYdp97SDEHEmJqJyWmsVrmaX6bH",
    "https://crossmint.myfilebase.com/ipfs/QmZHAwoi3AgvGxdiPaEtYdp97SDEHEmJqJyWmsVrmaX6bH", // Duplicate for example purposes
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-5 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
      >
        Okto Logout
      </button>
      <h1 className="text-3xl font-bold mb-10 text-gray-700">NFT's</h1>
      <div className="flex flex-col items-center gap-4 px-6 md:px-20">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-lg shadow-lg p-3 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-64 h-60 object-cover rounded-md mb-4"
            />
            <div className="flex space-x-6">
              <button
                onClick={() => handleLike(index)}
                className="px-4 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                👍 Like ({likes[index]})
              </button>
              <button
                onClick={() => handleDislike(index)}
                className="px-4 py-2 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                👎 Dislike ({dislikes[index]})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;