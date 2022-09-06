import React from "react";

function Navbar({ account, Web3Handler }) {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/">Home</a>
            </li>
            <li tabIndex={0}>
              <a className="justify-between">
                Funds
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2 bg-base-100 ">
                <li className="border-b">
                  <a href="/transfer">Transfer</a>
                </li>
                <li>
                  <a href="/receive">Receive</a>
                </li>
              </ul>
            </li>
            <li>
              <label htmlFor="my-modal-5" className=" modal-button">
                Disconnect Wallet
              </label>
            </li>
          </ul>
        </div>
        <a href="/" className="btn btn-ghost normal-case text-xl">
          Vaultr🔐
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <a href="/">Home</a>
          </li>
          <li tabIndex={0}>
            <a>
              Funds
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2">
              <li>
                <a href="/transfer">Transfer</a>
              </li>
              <li>
                <a href="/receive">Receive</a>
              </li>
            </ul>
          </li>
          <li>
            <label htmlFor="my-modal-5" className=" modal-button">
              Disconnect Wallet
            </label>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {account ? (
          <div>
            <button className="btn">
              {" "}
              {account.slice(0, 5) + "..." + account.slice(38, 42)}
            </button>
          </div>
        ) : (
          <div>
            <button onClick={Web3Handler} className="btn">
              connect wallet
            </button>
          </div>
        )}
      </div>
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">To disconnect:</h3>
          <p className="py-4">
            Open Metamask and click on the "Connected" button with the green
            dot. There you are able to disconnect your wallet since we are not
            able to manually do it for you!
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-5" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
