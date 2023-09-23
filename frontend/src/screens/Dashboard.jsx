import React from "react";
import "../index.css";
import { Input, Button, Select } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-main">
      <div className="flex flex-col justify-between items-center h-[90vh]">
        <div className="flex flex-col justify-between items-center gap-5">
          <img src="/header.png" className="w-[30vw]" />
          <div className="flex flex-col justify-between items-center gap-10">
            <Select
              items={animals}
              label="State"
              variant="bordered"
              placeholder="Select a state"
              className="w-[28vw]"
              size="lg"
              isRequired
            >
              {(states) => (
                <SelectItem key={states.value}>{states.label}</SelectItem>
              )}
            </Select>
            <Input
              type="email"
              label="Sector ID"
              variant="bordered"
              className="w-[28vw]"
              size="lg"
              isRequired
            />
            <Input
              type="email"
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
            onClick={() => navigate("/")}
          >
            <h1 className="text-white text-xl font-semibold">
              Generate Analysis
            </h1>
          </Button>
        </div>
        <img src="/footer.png" className="w-[28vw]" />
      </div>
    </div>
  );
};

export default Dashboard;
