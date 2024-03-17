'use client'
import { createContext, useState, useContext, useEffect } from 'react'; 
import * as eth from "ethers";
import { Contract, ethers } from "ethers";
import contractAddress from "../../contracts/contract-address-localhost.json";
import Antrix from "../../contracts/Antrix.json";
export const BlockchainConfig = createContext();

export const BlockchainProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState(null);
    const [contract, setContract] = useState(undefined);
    const HARDHAT_NETWORK_ID=31337;
    async function connectWallet() {
        try {
          const [address] = await window.ethereum.request({method: "eth_requestAccounts"});
    
          await checkNetwork();
          initiliazeDapp(address);
    
          window.ethereum.on("accountsChanged", ([newAddress]) => {
            if (newAddress === undefined) {
              setContract(undefined);
              setCurrentAccount(undefined);
              return;
            }
            initiliazeDapp(newAddress);
          });
          
        } catch(e) {
          console.error(e.message);
        }
      }
    
      async function initiliazeDapp(address) {
        setCurrentAccount(address);
        const contract = await initContract();
        setContract(contract)
      }
    
      async function initContract() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          contractAddress.Antrix,
          Antrix.abi,
          await provider.getSigner(0)
        );
    
        setContract(contract);
        return contract;
      }
    
      async function switchNetwork() {
        const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
        
        return await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{chainId: chainIdHex}]
        });
      }
    
      async function checkNetwork() {
        if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID.toString()) {
          return switchNetwork();
        }
    
        return null;
      }


    return (
        <BlockchainConfig.Provider value={{ connectWallet, currentAccount, errorMessage , contract,initiliazeDapp }}>
            {children}
        </BlockchainConfig.Provider>
    );
};
