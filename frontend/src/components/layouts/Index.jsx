import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import image from "../../assets/images/animated3.png";
import { LicenseContext } from "../../context/LicenseContext";

const Index = () => {
  // Constant
  const commonStyles =
    "light-transition m-0.5 min-h-[70px] px-2 flex justify-center items-center text-[20px] font-semibold text-white bg-[#ffffff33] hover:bg-[#ffffff55] hover:text-[22px] hover:text-[#eee]";

  // States
  const { connectWallet } = useContext(LicenseContext);
  const navigate = useNavigate();

  // Functions
  const onClick = async () => {
    await connectWallet();
    navigate("/home");
  };

  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      {/* Left side */}
      <div className="flex-2 flex flex-col items-start justify-center mr-8">
        <h1 className="w-full tracking-wide font-bold leading-[5rem] text-[5rem] text-white">
          Your secrete <br />
          are safe with us.
        </h1>

        <div className="w-11/12 grid sm:grid-cols-3 grid-cols-2 mt-8">
          <div className={`rounded-tl-xl ${commonStyles}`}>Realiability</div>
          <div className={commonStyles}>Availability</div>
          <div className={`rounded-tr-xl ${commonStyles}`}>Security</div>

          <div className={`rounded-bl-xl ${commonStyles}`}>Web 3.0</div>
          <div className={commonStyles}>Artificial Intelligence</div>
          <div className={`rounded-br-xl ${commonStyles}`}>Blockchain</div>
        </div>

        <div className="w-full">
          <button
            onClick={onClick}
            className="bg-white w-11/12 mt-10 py-2 mr-[10rem] rounded-[100px] glow-on-hover"
          >
            {/* Remove link tags in future */}
            <Link to="/home">
              <p className="text-transparent tracking-wider text-[2.5rem] font-semibold">
                Connect now
              </p>
            </Link>
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 pt-8">
        <img className="w-full" src={image} alt="Animated image" />
      </div>
    </div>
  );
};

export default Index;
