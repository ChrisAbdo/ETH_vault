import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ethers, utils } from "ethers";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Web3 from "web3";

const Home = () => {
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
      // take the to and from values from the receipt
      const to = receipt.to;
      const from = receipt.from;

      // combine the to and from values into a single string
      const combined = `From: ${from} To: ${to}`;

      // run handleadd to add the transaction to the list
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
      <div className="pt-12">
        <h1 className="text-4xl">ABD0xChange</h1>
      </div>

      {/* Web3 Stuff */}
      <input className="border" placeholder="Address of Recipient" id="input" />
      <input
        type="number"
        className="border"
        placeholder="# of ETH"
        id="amount"
      />
      <button className="border" type="submit" onClick={transferEth}>
        Transfer
      </button>

      {/* Todo stuff */}
      <div className="pt-12">
        {/* <input
          type="text"
          value={todoItem}
          className="w-full rounded py-2 px-4 text-gray-900 border"
          onChange={(e) => setTodoItem(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="Add todo item"
        /> */}
      </div>

      <ul className="pt-12">
        <h1 className="text-4xl">Recent completed transaction:</h1>
        {items
          .filter(({ done }) => !done)
          .map(({ id, message }) => (
            <li key={id} className="border" onClick={() => handleDone(id)}>
              {message}
            </li>
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
};

export default Home;
