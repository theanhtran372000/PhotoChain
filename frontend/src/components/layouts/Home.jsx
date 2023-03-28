import EtherCard from "../widgets/EtherCard";
import Input from "../widgets/Input";

import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import { LicenseContext } from "../../context/LicenseContext";

import { addInputFile, addJsonFile } from "../../utils/ipfs";
import { sendRequest } from "../../utils/aihost";
import { delay } from "../../utils/common";

const SubmitButton = ({ onSubmit, loading }) => {
  return (
    <button
      onClick={onSubmit}
      disabled={loading}
      className={`w-full py-3 light-shadow rounded-lg bg-white ${
        !loading ? "glow-on-hover-square" : ""
      } disabled:bg-gray-200 disabled:cursor-default`}
    >
      <p className="text-transparent tracking-wider text-2xl font-semibold">
        {loading ? "Loading..." : "Add image"}
      </p>
    </button>
  );
};

const Home = () => {
  // Import smart contract functions
  const { currentAccount, getAllHostUrls, waitExecFinished } =
    useContext(LicenseContext);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add image handler
  const onSubmit = async () => {
    setLoading(true);

    // Add image to IPFS
    const imageInfo = await addInputFile(uploadFile);
    const cid = imageInfo.path;
    console.log(imageInfo);

    // Add meta to IPFS
    const metadata = {
      title,
      description,
    };
    const jsonFile = await addJsonFile(metadata);
    console.log(jsonFile);

    const allHostUrls = await getAllHostUrls();
    const code = new Date().getTime();

    // Delay to wait IPFS
    await delay(2000); // delay 1s

    for (const host of allHostUrls) {
      sendRequest(host, code, cid, cid, jsonFile.path, currentAccount);
    }
    sendRequest();

    waitExecFinished(code, setLoading);
  };

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="flex-1 mr-20">
        <div className="w-full flex flex-col justify-between items-center">
          <Input
            placeholder="Image title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <Input
            placeholder="Image description"
            type="textarea"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Input
            placeholder="Upload image"
            type="file"
            value={uploadFile}
            onChange={(e) => {
              setUploadFile(e.target.files[0]);
              console.log(e.target.value);
            }}
          />

          <SubmitButton onSubmit={onSubmit} loading={loading} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Link to="/info">
          <EtherCard account={currentAccount} />
        </Link>
      </div>
    </div>
  );
};

export default Home;
