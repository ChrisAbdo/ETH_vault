import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ethers, utils } from "ethers";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Web3 from "web3";
import Marquee from "react-fast-marquee";

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

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-lg">
            <Marquee
              className="mb-6 border-b border-t border-primary text-2xl font-bold bg-black"
              gradient={false}
            >
              &nbsp;built for efficiency. optimized gas costs. no additional
              fees.
            </Marquee>
            <h1 className="text-5xl font-bold">welcome to Vaultr</h1>
            <p className="py-6">
              a stand-alone decentralized cryptocurrency wallet and exchange
            </p>
            {account ? (
              <a href="/transfer" className="btn btn-primary">
                transfer funds
              </a>
            ) : (
              <button onClick={Web3Handler} className="btn btn-primary">
                Connect to Metamask
              </button>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-black footer items-center p-4 text-neutral-content">
        <div className="items-center grid-flow-col">
          🔐
          <p>built by Chris Abdo</p>
        </div>
        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.twitter.com/chrisabdo_eth"
            className="hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.github.com/chrisabdo"
            className="hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/christopher-abdo/"
            className="hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
