import { useNavigate } from "react-router";

const ImageTag = ({ image }) => {
  const { id, url, title, description, license } = image;
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white cursor-pointer p-4 rounded-lg mb-6 w-[49%] h-52 flex flex-row justify-between items-center light-shadow ${
        license === "owned"
          ? "license-green"
          : license === "not_owned"
          ? "license-yellow"
          : "license-red"
      }`}
      onClick={() => navigate(`/detail/${id}`)}
    >
      {/* Left side */}
      <div className="h-full flex-2 flex flex-col items-center justify-center mr-4 image-display">
        <img className="w-full h-full object-cover" src={url} alt={title} />
      </div>

      {/* Right side */}
      <div className="flex-1 h-full flex flex-col justify-start items-start image-detail">
        <h1 className="font-bold w-full text-left text-xl text-[#333]">
          {title}
        </h1>
        <p className="font-normal w-full text-left text-md text-[#333]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ImageTag;
