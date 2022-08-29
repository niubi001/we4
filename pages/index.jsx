import { NFTCard } from "../public/nftCard";
import { useState } from "react";
import arrow from "../public/images/right-arrow.png";

let puid;
const Home = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [disabled1, setDisabled] = useState("disabled");

  const api_key = "VgJrFKlks6HR78eXAzpoXZk2MEiulhme";

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");

    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };
    let fetchURL = `${baseURL}?owner=${wallet}`;
    if (collection.length) {
      console.log("fetching nfts for collection owned by address");
      fetchURL = `${fetchURL}&contractAddresses%5B%5D=${collection}`;
    }
    if (puid) {
      fetchURL = `${fetchURL}&pageKey=${puid}`;
      console.log(fetchURL);
    }
    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    puid = nfts.pageKey;
    if (puid) {
      setDisabled("");
    } else {
      setDisabled("disabled");
    }
    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };

      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      var fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;

      if (puid) {
        fetchURL = `${fetchURL}&startToken=${puid}`;
        console.log(fetchURL);
      }
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      puid = nfts.nextToken;
      if (puid) {
        setDisabled("");
      } else {
        setDisabled("disabled");
      }
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input
          className="w-1/5"
          disabled={fetchForCollection}
          type={"text"}
          placeholder="Add your wallet address"
          onChange={(e) => setWalletAddress(e.target.value)}
          value={wallet}
        ></input>
        <input
          className="w-1/5"
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder="Add the collection address"
        ></input>
        <label className="text-gray-600 ">
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className="mr-2"
          ></input>
          Fetch for collection
        </label>
        <div className="flex flex-col w-full justify-center items-center gap-y-2">
          <button
            className={
              "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
            }
            onClick={() => {
              puid = undefined;
              setDisabled("disabled");
              if (fetchForCollection) {
                fetchNFTsForCollection();
              } else fetchNFTs();
            }}
          >
            Let's go!{" "}
          </button>
          <button
            id="button_arrow"
            className="disabled:opacity-30 w-12"
            onClick={() => {
              if (fetchForCollection) {
                fetchNFTsForCollection();
              } else fetchNFTs();
            }}
            disabled={disabled1}
          >
            {" "}
            <div className="group relative w-12">
              <img className={"w-full"} src={arrow.src}></img>
              <div className="opacity-0 group-hover:opacity-100 duration-300 absolute inset-0 z-10 flex justify-center items-center text-fuchsia-400">
                next page
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center">
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NFTCard nft={nft}></NFTCard>;
          })}
      </div>
    </div>
  );
};

export default Home;
