const Input = ({ placeholder, type, value, onChange }) => {
  return (
    <>
      {type === "text" ? (
        <input
          className="
                        text-xl 
                        text-gray-700 
                        bg-white 
                        font-normal 
                        w-full 
                        light-shadow 
                        mb-4 
                        px-6 
                        py-4 
                        outline-none 
                        rounded-lg"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : type === "textarea" ? (
        <textarea
          className="
                        form-control
                        block
                        w-full
                        px-6
                        py-4
                        text-xl
                        font-normal
                        light-shadow
                        text-gray-700
                        bg-white
                        rounded-lg
                        transition
                        ease-in-out
                        mb-4
                        outline-none
                    "
          rows="4"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        ></textarea>
      ) : type === "file" ? (
        <input
          className="
                    form-control
                    block
                    w-full
                    px-6
                    py-4
                    text-xl
                    font-normal
                    light-shadow
                    text-gray-700
                    bg-white
                    rounded-lg
                    transition
                    ease-in-out
                    mb-4
                    outline-none"
          type="file"
          onChange={onChange}
        />
      ) : (
        ""
      )}
    </>
  );
};

Input.defaultProps = {
  placeholder: "Type something here",
  type: "text",
};

export default Input;
