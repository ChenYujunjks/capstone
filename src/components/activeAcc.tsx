import { useActiveAccount } from "thirdweb/react";

export const ActiveAcc = () => {
  const activeAccount = useActiveAccount();

  const triggerman = () => {
    console.log("address", activeAccount?.address);
  };

  return (
    <button
      className="bg-violet-700 text-zinc-100 px-6 py-3 rounded-lg mb-6 hover:bg-violet-800 transition-all ease-in-out duration-300 font-semibold tracking-tight shadow-lg"
      onClick={triggerman}
    >
      Get Wallet Address
    </button>
  );
};