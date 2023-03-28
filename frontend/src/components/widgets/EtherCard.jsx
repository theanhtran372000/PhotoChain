import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { shortenAddress } from "../../utils/common";

const EtherCard = ({ account }) => {
  return (
    <div className="ether-card flex flex-col justify-between">
      {/* Top*/}
      <div className="w-full flex flex-row justify-between items-start">
        <SiEthereum className="text-white w-16 h-16 border-white border-4 p-2 rounded-full" />
        <BsInfoCircle className="text-white w-8 h-8" />
      </div>

      {/* Bottom */}
      <div className="w-full flex flex-col justify-center items-start">
        <p className="text-xl font-normal text-white">
          {account ? shortenAddress(account) : "No address found"}
        </p>
        <h1 className="text-4xl font-semibold text-white">Ethereum</h1>
      </div>
    </div>
  );
};

export default EtherCard;
