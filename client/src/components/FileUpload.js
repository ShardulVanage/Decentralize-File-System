import { useState } from "react";
import axios from "axios";

function FileUpload({ contract, provider, account }) {
    // const [urlArr, setUrlArr] = useState([]);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (file) {
                try {
                    const formData = new FormData();
                    formData.append("file", file);

                    const resFile = await axios({
                        method: "post",
                        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                        data: formData,
                        headers: {
                            pinata_api_key: `df25d57ee8dee46bfce9`,
                            pinata_secret_api_key: `faf710fba55f378e0f42bf436969e0fedbd37e313776f97cf5282f92642c6c17`,
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                    const signer = contract.connect(provider.getSigner());
                    signer.add(account, ImgHash);

                    //setUrlArr((prev) => [...prev, ImgHash]);

                    //Take a look at your Pinata Pinned section, you will see a new file added to you list.
                } catch (error) {
                    alert("Error sending File to IPFS");
                    console.log(error);
                }
            }

            alert("Successfully Uploaded");
            setFileName("No image selected");
            setFile(null); //to again disable the upload button after upload
        } catch (error) {
            console.log(error.message); //this mostly occurse when net is not working
        }
    };
    const retrieveFile = (e) => {
        const data = e.target.files[0];
        console.log(data);

        const reader = new window.FileReader();

        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        };
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };
    return <div className="m-10 text-white">
        <form className="" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="bg-green-800 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-md px-3 py-3 mr-3 p-2 hover:shadow-lg hover:shadow-indigo-900 text-sm" >
                Choose Image
            </label>
            <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile} className=" hidden"></input>
            <span>file:{fileName}</span>
            <button type="submit" className=" rounded-md border-solid  border-blue-700 px-2 py-3 ml-3 bg-gradient-to-r from-sky-500 to-indigo-500 mr-3 p-2 hover:shadow-lg hover:shadow-indigo-900 text-sm" disabled={!file}> Upload</button>
        </form>
    </div>;
};
export default FileUpload