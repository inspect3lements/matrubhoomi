import React from "react";
import "../index.css";
import { Input, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-main">
      <div className="flex flex-col justify-between items-center h-[90vh]">
        <div className="flex flex-col justify-between items-center gap-5">
          <img src="/header.svg" className="w-[25vw]" />
          <div className="flex flex-col justify-between items-center gap-10">
            <Input
              type="text"
              label="Nodal Officer ID"
              variant="bordered"
              className="w-[28vw]"
              size="lg"
              isRequired
            />
            <Input
              type="text"
              label="Sector ID"
              variant="bordered"
              className="w-[28vw]"
              size="lg"
              isRequired
            />
            <Input
              type="text"
              label="Sector Passcode"
              variant="bordered"
              className="w-[28vw]"
              size="lg"
              isRequired
            />
          </div>
          <Button
            color="warning"
            className="w-[28vw] mt-20"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            <h1 className="text-xl font-semibold">Login</h1>
          </Button>
        </div>
        <img src="/footer.png" className="w-[28vw]" />
      </div>
    </div>
  );
};

export default Login;
