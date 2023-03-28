import image from "../../assets/images/animated4.png";

const NotFound = () => {
  return (
    <div className="w-full flex flex-row justify-center items-center">
      <img className="w-5/12" src={image} alt="Not found image" />
    </div>
  );
};

export default NotFound;
