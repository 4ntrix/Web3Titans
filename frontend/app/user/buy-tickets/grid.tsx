import React from "react";
import {formatEther,parseEther } from "ethers";
const CardGrid = ({ items ,buyTickets }) => {

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 hover:cursor-pointer">
            {items.map((item, i) => (
                <div key={i} className={`col-span-${i === 0 ? `3` : `1`}`}>
                    <div className="bg-white bg-opacity-25 hover:bg-opacity-35 rounded-lg shadow-lg shadow-indigo-700/80">
                        <div className="p-4 flex flex-col justify-between">
                            <div className='text-center'>
                                <div className="mb-2 flex items-center justify-center"><img className="w-1/2 h-1/2 mx-0 my-1" src={item[7]} alt="item image"></img></div>
                                <h3 className="text-lg font-semibold mb-2">{item[1]}</h3>
                                <p className="text-white">{formatEther(item[2])} ETH</p> {/* Use the formatEther function */}
                                <p className="text-white">Date : {item[4]}</p> {/* Use the formatEther function */}
                                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={()=>{buyTickets(parseInt(item[0]), { value:item[2] })}}>Buy Now</button>
                            </div>
                            <div className="mt-4 flex justify-center">{item.icon}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CardGrid;
