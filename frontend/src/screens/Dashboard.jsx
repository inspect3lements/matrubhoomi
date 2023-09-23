import React from "react";
import "../index.css";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const Dashboard = () => {
  const navigate = useNavigate();
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];
  return (
    <div className="bg-main">
      <div className="flex flex-col justify-between items-center h-[90vh]">
        <div className="flex flex-col justify-between items-center gap-5 mt-10">
        <img src="/header.svg" className="w-[25vw]" />
          <div className="flex flex-row justify-center items-center gap-16">
            <div>
              <div className="flex flex-col justify-between items-center gap-10">
                <Select
                  items={states}
                  label="State / UT"
                  variant="bordered"
                  className="w-[20vw]"
                  size="lg"
                  isRequired
                >
                  {states.map((state) => (
                    <SelectItem key={state}>{state}</SelectItem>
                  ))}
                </Select>
                <Select
                  items={states}
                  label="City / District"
                  variant="bordered"
                  className="w-[20vw]"
                  size="lg"
                  isRequired
                >
                  <SelectItem key="Chandigarh">Chandigarh</SelectItem>
                </Select>
                <Input
                  type="email"
                  label="Land Parcel ID"
                  variant="bordered"
                  className="w-[20vw]"
                  size="lg"
                  isRequired
                />
              </div>
              <Button
                color="warning"
                className="w-[20vw] mt-20"
                size="lg"
                onClick={() => navigate("/")}
              >
                <h1 className="text-xl font-semibold">
                  Generate Analysis
                </h1>
              </Button>
            </div>
            <div className="h-full relative">
              <span className="h-full w-[2px] bg-[#505050] absolute"></span>
              <div className="h-full font-semibold absolute translate-y-[45%] -translate-x-1/2">
                <h1 className="text-2xl text-[#505050] bg-[#27272a] p-2">OR</h1>
              </div>
            </div>
            <div className="h-full w-[20vw] border-1 border-[#cbcbcb] rounded-2xl border-dashed flex justify-center items-center">
              <Button
                color="default"
                size="lg"
                type="file"
                onClick={(e) => {
                  if (uploaded) {
                    navigate("/");
                  }
                }}
              >
                <input
                  type="file"
                  className="opacity-0 absolute w-full h-full z-50"
                  accept="json"
                />
                <h1 className="text-[#efefef] text-lg font-semibold" startContent={<UploadFileIcon/>}>Import GeoJson</h1>
              </Button>
            </div>
          </div>
        </div>
        <img src="/footer.png" className="w-[28vw]" />
      </div>
    </div>
  );
};

export default Dashboard;
