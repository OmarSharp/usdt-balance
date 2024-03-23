import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';

// Used Typescript Generics
const USDT_CONTRACT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';
interface Web3Interface {
  eth: {
    getBlockNumber(): Promise<string>;
    getBalance(address: string): Promise<string>;
    Contract: any;
  };
}

const App: React.FC = () => {
  const [lastBlockNumber, setLastBlockNumber] = useState<number | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  
  const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/69bd32ad800647eb877a722d73af472d'));


  useEffect(() => {
    const fetchLastBlockNumber = async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      setLastBlockNumber(Number(blockNumber));
    };

    fetchLastBlockNumber();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      const uBalance = await web3.eth.getBalance(USDT_CONTRACT_ADDRESS);
      setUsdtBalance(Number(uBalance));
    };

    fetchBalance();
  }, []);

  const fetchUsdtBalance = async () => {
    if (!address) return;

    const contract = new web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          payable: true,
          stateMutability: 'view',
          type: 'function',
        },
      ],
      USDT_CONTRACT_ADDRESS
    );

    try {
      const balance: string = await contract.methods.balanceOf(address).call() as string;
      setUsdtBalance(Number(balance));
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  };

  return (
    <div>
      <h1>Last Block Number: {lastBlockNumber}</h1>
      <div>
        <input
          type="text"
          placeholder="Enter address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={fetchUsdtBalance}>Fetch USDT Balance</button>
      </div>
      {usdtBalance && <p>USDT Balance: {usdtBalance} </p>}
    </div>
  );
};
export default App;


//Used Typescript

/*const USDT_CONTRACT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const App: React.FC = () => {
  const [lastBlockNumber, setLastBlockNumber] = useState<number | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const fetchLastBlockNumber = async () => {
      const web3 = new Web3('https://mainnet.infura.io/v3/69bd32ad800647eb877a722d73af472d');
      const blockNumber = await web3.eth.getBlockNumber();
      setLastBlockNumber(Number(blockNumber));

    };

    fetchLastBlockNumber();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      const web3 = new Web3('https://mainnet.infura.io/v3/69bd32ad800647eb877a722d73af472d');
      const uBalance = await web3.eth.getBalance(USDT_CONTRACT_ADDRESS);
      setUsdtBalance(Number(uBalance));


    };

    fetchBalance();
  }, []);
 
  
  const fetchUsdtBalance = async () => {
    if (!address) return;

    const web3 = new Web3('https://mainnet.infura.io/v3/69bd32ad800647eb877a722d73af472d');
    const contract = new web3.eth.Contract(
      // @ts-ignore
      [
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          payable: true,
          stateMutability: 'view',
          type: 'function',
        },
      ],
      USDT_CONTRACT_ADDRESS
    );

   
   try {
    console.log(web3.eth.getBalance(USDT_CONTRACT_ADDRESS)); 
    const balance: string = await contract.methods.balanceOf(address).call() as string;
    setUsdtBalance(Number(balance));
   }catch (error) {
    console.error("Error fetching USDT balance:", error);
  }

    
  };*/






