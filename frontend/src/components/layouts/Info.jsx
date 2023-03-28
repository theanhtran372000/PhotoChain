import { useState, useContext } from "react";
import { useEffect } from "react";

import { LicenseContext } from "../../context/LicenseContext";
import { getImageUrl } from "../../utils/ipfs";
import ImageList from "../widgets/ImageList";

import loadingImage from "../../assets/images/loading.png";

const Info = () => {
  const { getMyPhotoIds, getPhotoInfo, getLicenseId, getLicenseInfo } =
    useContext(LicenseContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [licenseFilter, setLicenseFilter] = useState("default");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    async function test() {
      const myPhotoIds = await getMyPhotoIds();

      console.log("My photo ids: ", myPhotoIds);

      let imageList = [];
      for (let i = 0; i < myPhotoIds.length; i++) {
        const photoId = myPhotoIds[i];
        const photoInfo = await getPhotoInfo(photoId);

        const licenseId = await getLicenseId(photoId);
        const licenseInfo = await getLicenseInfo(licenseId);

        let license;
        if (licenseInfo.originImageId) {
          if (photoId !== licenseInfo.originImageId) {
            license = "other_owned";
          } else {
            license = "owned";
          }
        } else {
          license = "not_owned";
        }
        const url = getImageUrl(photoId);
        const metaurl = getImageUrl(photoInfo.metaPath);
        const data = await fetch(metaurl);
        const meta = JSON.parse(await data.text());
        imageList.push({
          id: photoId,
          url,
          title: meta.title,
          description: meta.description,
          license,
          uploadedTime: new Date(photoInfo.uploadedTime.toNumber() * 1000),
        });
      }
      setImages(imageList);
      setLoading(false);
    }
    test();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-start h-[75vh]">
      {/* Filter */}
      <div className="w-full mb-4 flex flex-row justify-between items-center">
        {/* Title */}
        <h1 className="text-white underline font-bold text-[1.75rem]">
          Storage
        </h1>

        {/* Filter list */}
        <div className="flex flex-row justify-between items-center">
          {/* License */}
          <span className="flex flex-row justify-between items-center mr-8">
            <label className="text-semibold text-lg text-white mr-2">
              License
            </label>
            <select
              defaultValue="default"
              value={licenseFilter}
              onChange={(event) => {
                setLicenseFilter(event.target.value);
              }}
              className="
                            form-select appearance-none
                            block
                            w-36
                            px-3
                            py-1
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding bg-no-repeat
                            border border-solid border-gray-300
                            rounded-md
                            transition
                            ease-in-out
                            m-0
                            outline-none
                        "
            >
              <option value="default">Not selected</option>
              <option value="owned">Owned</option>
              <option value="not_owned">Not owned</option>
              <option value="other_owned">Other owned</option>
            </select>
          </span>

          {/* Sort */}
          <span className="flex flex-row justify-between items-center">
            <label className="text-semibold text-lg text-white mr-2">
              Sort by
            </label>
            <select
              defaultValue="latest"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
              }}
              className="
                            form-select appearance-none
                            block
                            w-36
                            px-3
                            py-1
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding bg-no-repeat
                            border border-solid border-gray-300
                            rounded-md
                            transition
                            ease-in-out
                            m-0
                            outline-none
                        "
            >
              <option value="latest">Latest</option>
              <option value="earliest">Earliest</option>
            </select>
          </span>
        </div>
      </div>

      {/* Page number */}
      {loading ? (
        <img className="w-5/12" src={loadingImage} alt="Loading image" />
      ) : (
        <ImageList images={images} filter={{ licenseFilter, sort }} />
      )}
    </div>
  );
};

export default Info;
