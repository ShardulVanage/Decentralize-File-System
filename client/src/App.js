import Upload from './artifacts/contracts/Upload.sol/Upload.json';//ABI
import{useState,useEffect} from "react";
import{ethers} from "ethers";
import FileUpload from './components/FileUpload';
import Model from './components/Model';
import Display from './components/Display';

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
        //if you close your vscode or terminal then you need to re-deploy your smart contract for contract addreeess (for steps go to README.md)
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);

  return (
    <div className="App">
     
     <h1>
      Decentralized File System
      </h1>
      
      <h3>account:{account?account:"not connected"}</h3>
    </div>
  );
}

export default App;
