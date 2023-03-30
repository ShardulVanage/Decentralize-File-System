import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";

import Modal from "./components/Modal";
import "./App.css";
import Design from "./components/Design";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      <div className="w-full h-screen bg-banner-bg bg-no-repeat bg-center bg-cover relative overflow-hidden bg-black z-30 ">
        <div className="bg-black ">

          {!modalOpen && (
            <button className="share  " onClick={() => setModalOpen(true)}>
              Share
            </button>
          )}
          {modalOpen && (
            <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
          )}
        </div>


        <div className="  text-white flex-cols justify-center">
          <div className='max-w-2xl mx-auto'>
            <h1 className='text-5xl '>Decentralized File System </h1>
            <h3 className='p-4'><b>Account: </b>{account ? account : "not connected"}</h3>

            <div>
              <FileUpload account={account} provider={provider} contract={contract}></FileUpload>
            </div>
          </div>
          <div>
            <Display account={account} contract={contract} />
          </div>
        </div>



        <div class="bg">
          <div className="w-full h-screen absolute top-0 left-0 -z-10">

            <Design></Design>
          </div>
        </div>
      </div>

      {/* <div className="App">
        <h1 style={{ color: "white" }}>Gdrive 3.0</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div> */}
    </>
  );
}

export default App;
