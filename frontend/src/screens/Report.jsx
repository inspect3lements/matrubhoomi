import React from "react";

const ReportPage = ({ data }) => {
  return <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6">
    <h1 className="text-[#efefef] text-3xl font-semibold tracking-wide mt-4 ml-4">
      MatruBhoomi Analysis Report of <span className="text-[#F5A524]">Chandigarh</span> City  ✨
    </h1>

    <div className="mt-4 ml-4">
      <h2 className="text-[#efefef] text-2xl font-semibold tracking-wide mt-6 ml-6">
        Executive Summary
      </h2>
      <p className="text-[#efefef] text-lg font-semibold tracking-wide mt-4 ml-4">
      This report provides an overview of the urban landscape of Chandigarh based on the uploaded GeoJSON data. It includes key information about land use, infrastructure, demographics, and environmental factors. The purpose of this report is to offer a foundation for informed decision-making in urban planning and development.
      </p>
    </div>

    <div className="mt-6 ml-6">
      <h2 className="text-[#efefef] text-2xl font-semibold tracking-wide mt-6 ml-6">
        Executive Summary
      </h2>
      <p className="text-[#efefef] text-lg font-semibold tracking-wide mt-4 ml-4">
        Chandigarh is a city and a union territory in India that serves as the capital of the two neighbouring states of Punjab and Haryana. The city is unique as it is not a part of either of the two states but is governed directly by the Union Government, which administers all such territories in the country.
      </p>
    </div>

    <div className="mt-4 ml-4">
      <h2 className="text-[#efefef] text-2xl font-semibold tracking-wide mt-6 ml-6">
        Executive Summary
      </h2>
      <p className="text-[#efefef] text-lg font-semibold tracking-wide mt-4 ml-4">
        Chandigarh is a city and a union territory in India that serves as the capital of the two neighbouring states of Punjab and Haryana. The city is unique as it is not a part of either of the two states but is governed directly by the Union Government, which administers all such territories in the country.
      </p>
    </div>

  </div>;
};

export default ReportPage;
