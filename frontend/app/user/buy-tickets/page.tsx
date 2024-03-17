"use client";
import React, { useState, useContext, useEffect } from "react";
import CardGrid from "./grid";
import { NavbarDemo } from "@/app/nav";
import Footer from "@/app/components/Footer";
import { BlockchainConfig } from "@/app/Context/AppConfig";

const YourPage = () => {
  const { contract, initiliazeDapp, currentAccount } = useContext(BlockchainConfig);
  const [items, setItems] = useState([]);

  useEffect(() => {
    getNFTs();
  }, []); // Run once on mount

  async function getNFTs() {
    try {
      let nfts = await contract.getAllOccasions();
      console.log(nfts)
      setItems(nfts);
    } catch (error) {
      alert(error.message);
      console.log(error);
    }
  }

  async function buyTickets(_id , value){

    try {
      // Assuming contract is already defined
      const tx = await contract.buyTicket(_id,value);
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error("Transaction Failed");
      } else {
        await alert("NFT purchased successfully");
        // Call a function to update candidates list if needed
        // getCandidates(contract);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  }

  return (
    <div>
      <div className="pb-11">
        <NavbarDemo />
      </div>
      <div className="py-10">
        <div className="py-2">
          <CardGrid
            items={items}
            buyTickets={buyTickets} // Pass the entire items array as a prop
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default YourPage;
