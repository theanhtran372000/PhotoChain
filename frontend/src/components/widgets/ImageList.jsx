import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import ImageTag from "./ImageTag";

const ITEM_PER_PAGE = 4;

const ImageList = ({ images = [], filter: { licenseFilter, sort } }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
  const filteredImages = useMemo(
    () =>
      images
        .filter(
          ({ license }) =>
            licenseFilter === "default" || license === licenseFilter
        )
        .sort((a, b) => {
          const compare =
            a.uploadedTime > b.uploadedTime
              ? 1
              : a.uploadedTime < b.uploadedTime
              ? -1
              : 0;
          return sort === "latest" ? compare : -compare;
        }),
    [images, licenseFilter, sort]
  );

  const pageNumbers = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(filteredImages?.length / ITEM_PER_PAGE) },
        (_, index) => index + 1
      ),
    [filteredImages]
  );

  // for (let i = 1; i <= Math.ceil(images?.length / ITEM_PER_PAGE); i++) {
  //   pageNumbers.push(i);
  // }

  const currentItems = useMemo(
    () => [...filteredImages].splice(indexOfFirst, ITEM_PER_PAGE),
    [indexOfFirst, filteredImages]
  );

  const handleClick = (e) => {
    setCurrentPage(e.currentTarget.id);
  };
  const preClick = (e) => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextClick = (e) => {
    if (currentPage < Math.ceil(images?.length / ITEM_PER_PAGE)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li
        className="page-item mr-1"
        key={number}
        id={number}
        onClick={handleClick}
      >
        <a
          className="page-link font-semibold text-lg relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-white hover:text-[#333] hover:bg-white focus:shadow-none"
          href="#"
        >
          {number}
        </a>
      </li>
    );
  });
  return (
    <>
      <div className="w-full flex flex-row flex-wrap items-center justify-between">
        {currentItems?.map((image) => (
          <ImageTag key={image.id} image={image} />
        ))}
      </div>
      <div className="flex justify-center w-full rounded px-3 py-1 bg-[#ffffff40]">
        <nav aria-label="Page navigation example">
          <ul className="flex list-style-none">
            <li
              className="page-item mr-1"
              disabled={currentPage == 1}
              onClick={preClick}
            >
              <a
                className="page-link font-semibold text-lg relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-white hover:text-[#333] hover:bg-white focus:shadow-none"
                href="#"
              >
                Previous
              </a>
            </li>
            {renderPageNumbers}
            <li
              className="page-item mr-1"
              disabled={
                currentPage == Math.ceil(images?.length / ITEM_PER_PAGE)
              }
              onClick={nextClick}
            >
              <a
                className="page-link font-semibold text-lg relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-white hover:text-[#333] hover:bg-white focus:shadow-none"
                href="#"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
export default ImageList;
