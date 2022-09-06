import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ethers, utils } from "ethers";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Web3 from "web3";

function receive() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    loadBlockchainData();

    if (window.ethereum && account === null) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  }, [account]);

  const loadBlockchainData = async () => {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      setWeb3(web3);

      const accounts = await web3.eth.getAccounts();

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const networkId = await web3.eth.net.getId();

      // Event listeners...
      window.ethereum.on("accountsChanged", function (accounts) {
        setAccount(accounts[0]);
      });

      window.ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    }
  };

  // Enable metamask connection
  const Web3Handler = async () => {
    const notification = toast.loading("Connecting...");
    if (web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        toast.success("Connected to Metamask");
      } catch (err) {
        console.log(err);
        toast.error("Error connecting to Metamask");
      }
    }
  };

  function copyAccountToClipboard() {
    const accountValue = document.getElementById("accountCopy");
    navigator.clipboard.writeText(accountValue.innerHTML);
    toast.success("Copied to clipboard!");
  }

  return (
    <div data-theme="halloween" className="min-h-screen">
      <Navbar Web3Handler={Web3Handler} account={account} />

      <div className="mt-56 flex flex-col items-center justify-center">
        <div className="card w-full bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl">Receive Funds</h2>
            <p className="xs:text-sm">Your wallet address: {account} </p>

            <div className="card-actions justify-end">
              <label
                htmlFor="my-modal-6"
                className="btn modal-button  btn-primary"
              >
                Share
              </label>

              <input type="checkbox" id="my-modal-6" className="modal-toggle" />
              <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">
                    Share your wallet address
                  </h3>
                  <p id="accountCopy" className="py-4">
                    {account}
                  </p>

                  <button onClick={copyAccountToClipboard} className="btn mr-2">
                    Copy
                  </button>
                  <button disabled className="btn">
                    Vaultr Link
                  </button>

                  <div className="modal-action">
                    <label htmlFor="my-modal-6" className="btn">
                      Yay!
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default receive;

// 0xA5Fa60A7cb91212A642F5f86e92A55AbBD51B28f
// 0x944aFe2AF5C3d5637F1F3cDB4a130f272DE73420
