import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Licenses, Executor } from "../utils/contract";
import { MAX_PRIORITY_FEE, MAX_FEE } from "../utils/contract";

export const LicenseContext = React.createContext();

// Get Metamask object from windows
const { ethereum } = window;

// Get 2 smart contract objects
const getLicensesContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const licenseContract = new ethers.Contract(
    Licenses.ADDRESS,
    Licenses.ABI,
    signer
  );

  return licenseContract;
};

const getExecutorContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const executorContract = new ethers.Contract(
    Executor.ADDRESS,
    Executor.ABI,
    signer
  );

  return executorContract;
};

// Context provider
export const LicenseProvider = ({ children }) => {
  // Local state //
  const [currentAccount, setCurrentAccount] = useState("");

  // Hanlder

  // Wallet function //
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts && accounts.length > 0) {
        console.log("Selected account: ", accounts[0]);

        // Wallet connected
        setCurrentAccount(accounts[0]);

        // Do all preparation stubs here
        // ...
      } else {
        // Do something here

        console.log("No accounts found!");
      }
    } catch (error) {
      console.log("Error: ", error.message);
      throw new Error("No ethereum object!");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask!");

      // Get all accounts and let user choose
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error: ", error.message);
      throw new Error("No ethereum object!");
    }
  };

  // Web3 function: Only in license contract //

  // GETTER
  // Host info
  const getAllHostIds = async () => {
    const licenseContract = getLicensesContract();
    const availableHosts = await licenseContract.getAllHostIds();
    return availableHosts;
  };

  const getAllHostUrls = async () => {
    const licenseContract = getLicensesContract();
    const availableHosts = await licenseContract.getAllHostUrls();
    return availableHosts;
  };

  const getNumberOfHosts = async () => {
    const licenseContract = getLicensesContract();
    const nHosts = await licenseContract.getNumberOfHosts();
    return nHosts;
  };

  // Contract info
  const getBalance = async () => {
    const licenseContract = getLicensesContract();
    const balance = await licenseContract.getBalance();
    return balance / 1e18; // Return in ETH
  };

  // User info
  const getMyBalance = async () => {
    const licenseContract = getLicensesContract();
    const balance = await licenseContract.getMyBalance();
    return balance / 1e18; // Return in ETH
  };

  const getLicenseFee = async () => {
    const licenseContract = getLicensesContract();
    const fee = await licenseContract.getLicenseFee();
    return fee / 1e18; // Return in ETH
  };

  // License info
  const getAllLicensedIds = async () => {
    const licenseContract = getLicensesContract();
    const licensedIds = await licenseContract.getAllLicensedPhotoIds();
    return licensedIds;
  };

  const getLicenseId = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getLicenseId(photoId);
    return result;
  };

  const getLicenseInfo = async (licenseId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getLicenseInfo(licenseId);
    return result;
  };

  const getTotalLicense = async () => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getTotalLicense();
    return result;
  };

  const licenseIdExist = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.licenseIdExist(photoId);
    return result;
  };

  // Photo info
  const getAllPhotoIds = async () => {
    const licenseContract = getLicensesContract();
    const photoIds = await licenseContract.getAllPhotoIds();
    return photoIds;
  };

  const getAllLicensedPhotoIds = async () => {
    const licenseContract = getLicensesContract();
    const photoIds = await licenseContract.getAllLicensedPhotoIds();
    return photoIds;
  };

  const getPhotoInfo = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getPhotoInfo(photoId);
    return result;
  };

  const getPhotoLicenseInfo = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getPhotoLicenseInfo(photoId);
    return result;
  };

  const getPhotoHash = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getPhotoHash(photoId);
    return result;
  };

  const getMetaHash = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getMetaHash(photoId);
    return result;
  };

  const getMyPhotoIds = async () => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getMyPhotoIds();
    return result;
  };

  const getTotalPhotos = async () => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getTotalPhotos();
    return result;
  };

  const photoIdExist = async (photoId) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.photoIdExist(photoId);
    return result;
  };

  // Executor info
  const getFinalResult = async (execCode) => {
    const licenseContract = getLicensesContract();
    const result = await licenseContract.getFinalResult(execCode);
    return result;
  };

  // LISTEN
  // Listen to ExecutionFinised(execCode) event
  // TODO...
  const waitExecFinished = (execCode, setLoading) => {
    const licenseContract = getLicensesContract();
    console.log("Listening ...");
    licenseContract.on("ExecutionFinised", async (_execCode) => {
      console.log(`Catch an event with execution code ${_execCode}!`);
      if (_execCode == execCode) {
        // Handle here...: Change state or something
        const result = await getFinalResult(execCode);
        console.log("Final result: ", result);

        setLoading(false);
        // Unsubcribe event
        licenseContract.off("ExecutionFinised", () => {
          console.log("Execution finised!");
        });
      }
    });
  };

  // ADD
  const addPhoto = async (photoId, filePath, metaPath) => {
    const licenseContract = getLicensesContract();
    const options = {
      maxPriorityFeePerGas: MAX_PRIORITY_FEE,
      maxFeePerGas: MAX_FEE,
    };
    const hash = await licenseContract.addPhoto(
      photoId,
      filePath,
      metaPath,
      options
    );
    return hash;
  };

  const addLicense = async (photoId, licenseId) => {
    const licenseContract = getLicensesContract();

    // Get license fee
    const licenseFee = await getLicenseFee();
    const options = {
      value: ethers.utils.parseEther("" + licenseFee),
      maxPriorityFeePerGas: MAX_PRIORITY_FEE,
      maxFeePerGas: MAX_FEE,
    };

    // Buy license
    const hash = await licenseContract.addLicense(photoId, licenseId, options);
    return hash;
  };

  // REMOVE
  const removePhoto = async (photoId) => {
    const licenseContract = getLicensesContract();
    const options = {
      maxPriorityFeePerGas: MAX_PRIORITY_FEE,
      maxFeePerGas: MAX_FEE,
    };
    const hash = await licenseContract.removePhoto(photoId, options);
    return hash;
  };

  // Check wallet after load
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <LicenseContext.Provider
      value={{
        connectWallet,
        checkIfWalletIsConnected,
        currentAccount,
        getAllHostIds,
        getAllHostUrls,
        getNumberOfHosts,
        getBalance,
        getLicenseFee,
        getAllLicensedIds,
        getLicenseId,
        getLicenseInfo,
        getTotalLicense,
        licenseIdExist,
        getAllPhotoIds,
        getAllLicensedPhotoIds,
        getPhotoInfo,
        getPhotoLicenseInfo,
        getPhotoHash,
        getMetaHash,
        getMyPhotoIds,
        getMyBalance,
        getTotalPhotos,
        photoIdExist,
        getFinalResult,
        waitExecFinished,
        addPhoto,
        addLicense,
        removePhoto,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};
