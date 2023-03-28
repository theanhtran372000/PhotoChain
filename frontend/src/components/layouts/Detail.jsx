import { useState, useContext, useEffect } from "react";
import { LicenseContext } from "../../context/LicenseContext";
import { useParams, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/ipfs";
import { shortenAddress } from "../../utils/common";
import loadingImage from "../../assets/images/loading.png";
import { fromHexToTime } from "../../utils/common";
import { deleteFile } from "../../utils/ipfs";

const Detail = () => {
  const {
    currentAccount,
    getPhotoInfo,
    getLicenseId,
    getLicenseInfo,
    getMyBalance,
    getLicenseFee,
    addLicense,
    removePhoto,
  } = useContext(LicenseContext);
  const [image, setImage] = useState();
  const { imageId } = useParams();
  const [license, setLicense] = useState("not_owned");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getImage = async () => {
      // Get image info
      const info = await getPhotoInfo(imageId);
      const url = getImageUrl(imageId);
      const metaurl = getImageUrl(info.metaPath);
      const data = await fetch(metaurl);
      const meta = JSON.parse(await data.text());

      // Get license inf
      const licenseId = await getLicenseId(imageId);
      const licenseInfo = await getLicenseInfo(licenseId);
      if (licenseInfo.originImageId) {
        if (imageId !== licenseInfo.originImageId) {
          setLicense("other_owned");
        } else {
          setLicense("owned");
        }
      } else {
        setLicense("not_owned");
      }

      const licen = license;

      const uploadTime = fromHexToTime(info.uploadedTime);
      const licenseCreatedTime = fromHexToTime(licenseInfo.createdTime);

      // Get balance
      const _b = await getMyBalance();
      setBalance(_b);

      // Get fee
      const _f = await getLicenseFee();
      setFee(_f);

      setImage({
        id: imageId,
        url: url,
        title: meta.title,
        description: meta.description,
        license: licen,
        licenseCreatedTime: licenseCreatedTime,
        owner: info.owner,
        uploadTime: uploadTime,
      });
    };

    // Load image
    getImage();
  }, []);

  console.log(image);
  console.log("License:", license);

  const showLicense = (licen) => {
    if (licen === "not_owned") {
      return "No one owned";
    } else {
      return image !== undefined
        ? shortenAddress(image.owner)
        : console.log("loading");
    }
  };

  const getLicenseNow = async () => {
    setLoading(true);
    await addLicense(imageId, imageId);
    setLoading(false);
    // navigate(`/detail/${imageId}`)
    // window.location.reload()
  };

  const deleteImage = async (img_id) => {
    const hash = await removePhoto(img_id);
    console.log(`Removed on blockchain`);
    console.log(hash);
    await deleteFile(img_id);
    console.log("Deleted file on ipfs");
    // alert("You had just deleted a image!");
    navigate("/info");
  };

  return (
    <div className="flex flex-row items-center w-full h-[70vh]">
      {/* Image */}
      <div
        className={`flex-2 mr-4 h-full w-full flex justify-center items-center border-8 rounded-lg ${
          license === "owned"
            ? "border-[#06FF00]"
            : license === "not_owned"
            ? "border-[#FFE400]"
            : "border-[#FF1700]"
        }`}
      >
        <a
          className="w-full h-full flex justify-center items-center"
          href={image === undefined ? "#" : image.url}
        >
          <img
            className={`${
              image === undefined ? "w-9/12 h-9/12" : "w-full h-full"
            } object-cover`}
            src={image === undefined ? loadingImage : image.url}
            alt="Image"
          />
        </a>
      </div>

      {/* Info and License */}
      <div className="flex-1 h-full w-full bg-white rounded-lg flex flex-col items-start">
        {/* Info */}
        <div className="flex-2 flex flex-col items-start w-full px-4 py-2">
          <h1 className="w-full text-center font-bold text-3xl text-[#333] mb-4 mt-2">
            Info
          </h1>

          {/* Rows */}
          <div className="w-full flex flex-row items-center">
            <p className="flex-1 w-full text-left text-[#333] font-semibold text-lg mr-2">
              Title
            </p>
            <p className="flex-3 w-full text-[#333] font-normal text-lg px-2 py-1.5 bg-[#f3f3f3] rounded-md outline-none">
              {image === undefined ? console.log("Loading") : image.title}
            </p>
          </div>

          <div className="w-full flex flex-row items-center mt-2">
            <p className="flex-1 w-full text-left text-[#333] font-semibold text-lg mr-2">
              Time
            </p>
            <p className="flex-3 w-full text-[#333] font-normal text-lg px-2 py-1.5 bg-[#f3f3f3] rounded-md outline-none">
              {image === undefined ? "" : image.uploadTime}
            </p>
          </div>

          <div className="w-full flex flex-row items-start mt-2">
            <p className="flex-1 w-full text-left text-[#333] font-semibold text-lg mr-2">
              Desc
            </p>
            <textarea
              disabled
              rows="3"
              className="flex-3 w-full text-[#333] font-normal text-lg px-2 py-1.5 bg-[#f3f3f3] rounded-md outline-none"
              type="text"
              value={
                image === undefined ? console.log("Loading") : image.description
              }
            ></textarea>
          </div>

          <div className="w-full flex flex-row items-center mt-4">
            {/* <button className="flex-1 bg-[#3367EE] hover:bg-[#2256dd] font-semibold text-xl text-white px-4 py-2 rounded-lg mx-2">
            Update
          </button> */}
            <button
              disabled={license !== "not_owned"}
              className={`flex-1 bg-[#FF1700] ${
                license !== "not_owned" ? "" : "hover:bg-[#ee0600]"
              } disabled:bg-gray-300 font-semibold text-xl text-white px-4 py-2 rounded-lg`}
              onClick={() => deleteImage(imageId)}
            >
              {license !== "not_owned"
                ? "Can't delete licensed image"
                : "Delete"}
            </button>
          </div>
        </div>

        {/* License */}
        <div className="flex-1 flex flex-col items-start w-full px-4 py-2">
          <h1 className="w-full text-center font-bold text-3xl text-[#333] mb-4 mt-2">
            License
          </h1>

          {/* Rows */}
          <div className="w-full flex flex-row items-center">
            <p className="flex-1 w-full text-left text-[#333] font-semibold text-lg mr-2">
              Owner
            </p>
            <p className="flex-3 w-full text-[#333] font-normal text-lg px-2 py-1.5 bg-[#f3f3f3] rounded-md outline-none">
              <a href={`https://goerli.etherscan.io/address/${currentAccount}`}>
                {showLicense(license)}
              </a>
            </p>
          </div>

          {/* <button className="w-full mt-4 py-2 light-shadow rounded-lg bg-white glow-on-hover-square">
            <p className="text-transparent text-xl font-semibold">
                Get license now
            </p>
          </button> */}

          {license === "not_owned" ? (
            <button
              className="w-full mt-4 bg-[#EE079E] hover:bg-[#dd057c] font-semibold text-xl text-white px-4 py-2 rounded-lg"
              data-bs-toggle="modal"
              data-bs-target="#licensebox"
            >
              Get license now
            </button>
          ) : (
            <div className="w-full flex flex-row items-center mt-2">
              <p className="flex-1 w-full text-left text-[#333] font-semibold text-lg mr-2">
                Time
              </p>
              <p className="flex-3 w-full text-[#333] font-normal text-lg px-2 py-1.5 bg-[#f3f3f3] rounded-md outline-none">
                {image === undefined ? "" : image.licenseCreatedTime}
              </p>
            </div>
          )}

          {/* get license dialog */}
          <div
            class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
            id="licensebox"
            tabindex="-1"
            aria-labelledby="exampleModalCenterTitle"
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-md modal-dialog-centered relative w-auto pointer-events-none">
              <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                  <h5
                    className="w-full text-center font-bold text-xl text-[#333] -mb-2"
                    id="exampleModalScrollableLabel"
                  >
                    License info
                  </h5>
                  <button
                    type="button"
                    className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body relative p-4">
                  <div className="w-full flex flex-row items-center">
                    {/* Image */}
                    <div className="flex-1 mr-4">
                      <img
                        className="w-full h-[20vh] object-cover rounded-lg"
                        src={getImageUrl(imageId)}
                        alt="Image"
                      />
                    </div>

                    {/* License info */}
                    <div className="flex-1 w-full h-[20vh] flex flex-col justify-center items-center">
                      {/* Rows */}
                      <div className="w-full flex flex-row items-center">
                        <p className="flex-1 w-full text-left text-[#333] font-semibold text-sm mr-2">
                          ID
                        </p>
                        <p className="cursor-pointer flex-3 w-full text-right text-[#333] font-normal text-sm pl-2 py-1.5 rounded-md outline-none">
                          {shortenAddress(imageId)}
                        </p>
                      </div>

                      <div className="w-full flex flex-row items-center">
                        <p className="flex-1 w-full text-left text-[#333] font-semibold text-sm mr-2">
                          Owner
                        </p>
                        <p className="cursor-pointer flex-3 w-full text-right text-[#06FF00] font-normal text-sm pl-2 py-1.5 rounded-md outline-none">
                          {showLicense(license)}
                        </p>
                      </div>

                      <div className="w-full flex flex-row items-center border-t border-gray-200 rounded-b-md">
                        <p className="flex-1 w-full text-left text-[#333] font-semibold text-sm mr-2">
                          Balance
                        </p>
                        <p className="flex-3 w-full text-right text-[#333] font-normal text-sm pl-2 py-1.5 rounded-md outline-none">
                          {balance.toFixed(10)} ETH
                        </p>
                      </div>

                      <div className="w-full flex flex-row items-center">
                        <p className="flex-1 w-full text-left text-[#333] font-semibold text-sm mr-2">
                          Fee
                        </p>
                        <p className="flex-3 w-full text-right text-[#333] font-normal text-sm pl-2 py-1.5 rounded-md outline-none">
                          {fee.toFixed(10)} ETH
                        </p>
                      </div>

                      <div className="w-full flex flex-row items-center border-t border-gray-200 rounded-b-md">
                        <p className="flex-1 w-full text-left text-[#333] font-semibold text-sm mr-2">
                          Balance
                        </p>
                        <p className="flex-3 w-full text-right text-[#333] font-normal text-sm pl-2 py-1.5 rounded-md outline-none">
                          {(balance - fee).toFixed(10)} ETH
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                  <button
                    type="button"
                    disabled={loading}
                    class={`w-[150px] bg-[#999] ${
                      loading ? "" : "hover:bg-[#888]"
                    } font-semibold text-base text-white px-2 py-1.5 rounded-md disabled:bg-gray-200 disabled:cursor-default`}
                    data-bs-dismiss="modal"
                  >
                    {loading ? "Loading" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    className={`w-[150px] ml-2 bg-[#EE079E] ${
                      loading ? "" : "hover:bg-[#dd057c]"
                    } font-semibold text-base text-white px-2 py-1.5 rounded-md disabled:bg-gray-200 disabled:cursor-default`}
                    onClick={() => {
                      getLicenseNow();
                    }}
                  >
                    {loading ? "Loading" : "Transfer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
