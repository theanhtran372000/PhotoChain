import { Link } from "react-router-dom";
import { useContext } from "react";
import { AiOutlineDoubleRight } from "react-icons/ai";

import logo from "../../assets/images/logo.png";
import { LicenseContext } from "../../context/LicenseContext";
import { ScannerAddress } from "../../utils/contract";

const Header = () => {
  const { currentAccount } = useContext(LicenseContext);

  return (
    <div className="w-[80vw] flex fixed top-3 flex-row items-center justify-between">
      <Link className="flex justify-start items-center" to="/">
        <img className="w-20 h-full mr-8 object-cover" src={logo} alt="" />
        <h1 className="text-4xl font-bold text-white mt-3">PhotoChain</h1>
      </Link>

      {/* Only display when connected to wallet: Replace false with connected state */}

      {currentAccount ? (
        <div className="bg-white py-1.5 px-4 rounded-lg">
          <p className="tracking-wider items-center justify-between flex flex-row text-lg font-normal">
            <a className="mr-2" href={`${ScannerAddress}/${currentAccount}`}>
              Etherscan
            </a>
            <AiOutlineDoubleRight />
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
