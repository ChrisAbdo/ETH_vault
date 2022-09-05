import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ethers, utils } from "ethers";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Web3 from "web3";

function transfer() {
  const [todoItem, setTodoItem] = useState("");
  const [items, setItems] = useState([]);
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

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  const handleAdd = () => {
    if (todoItem) {
      setItems([
        {
          id: uuidv4(),
          message: todoItem,
          done: false,
        },
        ...items,
      ]);

      setTodoItem("");
    }
  };

  const handleDone = (id) => {
    const _items = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          done: !item.done,
        };
      }

      return item;
    });

    setItems(_items);
  };

  async function transferEth() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();

    const DefaultAccount = await signer.getAddress();
    const recipient = document.getElementById("input").value;
    const amount = document.getElementById("amount").value;

    const notification = toast.loading("Processing...");

    try {
      const tx = await signer.sendTransaction({
        from: DefaultAccount,
        to: recipient,
        value: ethers.utils.parseEther(amount),
        nonce: await provider.getTransactionCount(DefaultAccount, "latest"),
        gasLimit: ethers.utils.hexlify(21000),
        gasPrice: ethers.utils.hexlify(parseInt(await provider.getGasPrice())),
      });

      const receipt = await tx.wait();

      const to = receipt.to;
      const from = receipt.from;
      const balance = await provider.getBalance(from);

      const combined = `FROM: ${
        from.slice(0, 5) + "..." + from.slice(38, 42)
      } --> TO: ${to.slice(0, 5) + "..." + to.slice(38, 42)} 
      BALANCE: ${ethers.utils.formatEther(balance)}`;

      setItems([
        {
          id: uuidv4(),
          message: combined,
          done: false,
        },
        ...items,
      ]);

      console.log(combined);

      toast.success("Successful transfer!", {
        id: notification,
      });
    } catch (err) {
      toast.error("Something went wrong, try again!", {
        id: notification,
      });
      console.error("contract call error", err);
    }
  }
  return (
    <div data-theme="halloween" className="min-h-screen">
      <Navbar Web3Handler={Web3Handler} account={account} />

      {/* Web3 Stuff */}

      <div className="flex flex-col items-center justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-3xl">Transfer</h2>
            <input
              type="text"
              id="input"
              placeholder="Address of Recipient"
              className="input input-bordered input-accent w-full"
            />
            <input
              type="number"
              min={0}
              className="input input-bordered input-accent w-full"
              placeholder="# of ETH"
              id="amount"
            />

            <div className="card-actions justify-end">
              <button
                className="btn btn-success btn-outline"
                type="submit"
                onClick={transferEth}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Todo stuff */}
      <div className="pt-12"></div>

      <ul className="pt-12">
        <h1 className="text-4xl">Completed Transactions:</h1>
        {items
          .filter(({ done }) => !done)
          .map(({ id, message }) => (
            <div
              key={id}
              className="alert alert-success shadow-lg mb-2 mt-2 cursor-pointer"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{message}</span>
              </div>
            </div>
          ))}

        {items
          .filter(({ done }) => done)
          .map(({ id, message }) => (
            <li key={id} onClick={() => handleDone(id)}>
              {message}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default transfer;

// 0xA5Fa60A7cb91212A642F5f86e92A55AbBD51B28f
// 0x944aFe2AF5C3d5637F1F3cDB4a130f272DE73420
