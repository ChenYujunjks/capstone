"use client";

import { useEffect, useState } from "react";
import {
  useActiveWallet,
  useActiveWalletSigner,
  useReadContract,
} from "thirdweb/react";
import { getContract } from "thirdweb";
import crypto from "crypto-js";

export default function ReceiveMessages() {
  const activeWallet = useActiveWallet();
  const signer = useActiveWalletSigner();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeWallet && signer) {
        try {
          const contract = getContract({
            address: "<your-contract-address>",
            chain: "ethereum", // Replace with your contract's chain
            client: signer,
          });

          const { data: encryptedMessages } = useReadContract({
            contract,
            functionName: "getMessages",
            args: [],
          });

          const decryptedMessages = encryptedMessages.map((msg) => ({
            sender: msg.sender,
            recipient: msg.recipient,
            content: crypto.AES.decrypt(
              msg.encryptedContent,
              "<recipient-private-key>"
            ).toString(crypto.enc.Utf8),
            timestamp: msg.timestamp,
          }));

          setMessages(decryptedMessages);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [activeWallet, signer]);

  return (
    <div className="p-4 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <h2 className="text-2xl font-bold mb-6">Received Messages</h2>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-zinc-800 rounded"
            >
              <p>
                <strong>From:</strong> {message.sender}
              </p>
              <p>
                <strong>Message:</strong> {message.content}
              </p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(message.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No messages received yet.</p>
        )}
      </div>
    </div>
  );
}
