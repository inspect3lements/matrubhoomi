import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { Tabs, Tab, Button } from "@nextui-org/react";

const tabs = [
  {
    id: "urban-plan",
    label: "Urban Plan",
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
  },
  {
    id: "environment",
    label: "Environment",
  },
  {
    id: "sustainability",
    label: "Sustainability",
  },
];

const menuItems = {
  "urban-plan": [
    {
      id: "road",
      label: "Roads",
    },
    {
      id: "airport",
      label: "Airports",
    },
    {
      id: "railways",
      label: "Railways",
    },
  ],
  infrastructure: [],
  environment: [],
  sustainability: [],
};

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXNoYW50cml2ZWRpMjEiLCJhIjoiY2xtdzJxaTR0MHVmaTJqcXB6OG52MzYxbiJ9.u5AhJ0TqCLwiBmoix9MRnQ";

const Map = ({ lng, lat, zoom }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [lng, lat],
        zoom: zoom,
      });
    }
  }, [lng, lat, zoom]);

  return <div ref={mapContainer} className="map-container w-screen h-screen" />;
};

const TabsComponent = ({ tabs, activeTab, setActiveTab }) => {
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  return (
    <div className="flex flex-col absolute top-8 left-1/2 -translate-x-2/4">
      <Tabs
        items={tabs}
        size="lg"
        color="default"
        className="scale-125"
        radius="md"
        selectedKey={activeTab}
        defaultSelectedKey={"urban-plan"}
        onSelectionChange={handleTabChange}
      >
        {(item) => <Tab key={item.id} title={item.label}></Tab>}
      </Tabs>
    </div>
  );
};

const Layers = ({ activeTab, activeLayer, setActiveLayer }) => {
  return (
    <div className="h-[96%] w-[18%] absolute left-0 top-0 bg-[#27272a] m-4 rounded-2xl flex flex-col justify-start items-center gap-5">
      <img src="/nav_header.svg" className="w-[80%]" />
      <div className="w-[80%] h-[80%]">
        {menuItems[activeTab]?.map((item) => (
          <div
            className={`py-3 text-center rounded-lg  mt-4 text-xl font-medium cursor-pointer ${
              activeLayer === item.id
                ? "bg-[#3f3f46] text-[#fff]"
                : "bg-[#3f3f4600] text-[#707078]"
            }`}
            onClick={() => setActiveLayer(item.id)}
            key={item.id}
          >
            {item.label}
          </div>
        ))}
      </div>
      <Button
        color="error"
        className="w-[80%] mb-10 border-1 border-[#404040] py-1"
      >
        <h1 className="text-white text-xl font-semibold tracking-wide">
          Logout
        </h1>
      </Button>
    </div>
  );
};

const Score = ({ scrollToReport }) => {
  return (
    <div className="h-[96%] w-[18%] absolute right-0 top-0 bg-[#27272a] m-4 rounded-2xl flex flex-col justify-end items-center gap-5">
      <Button
        color="error"
        className="w-[80%] mb-10 border-2 border-[#f5a524] py-1"
        onClick={scrollToReport}
      >
        <h1 className="text-white text-xl font-semibold tracking-wide">
          Detailed Report
        </h1>
      </Button>
    </div>
  );
};

const Report = ({ reportRef }) => {
  return (
    <div
      ref={reportRef}
      className="h-screen w-screen bg-[#27272a] flex flex-col justify-start items-center gap-5"
    >
      {/* Content of the report */}
    </div>
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState("urban-plan");
  const [activeLayer, setActiveLayer] = useState(null);
  const [mapOptions, setMapOptions] = useState({
    lng: 76.78,
    lat: 30.73,
    zoom: 12,
  });

  const reportRef = useRef(null);

  const scrollToReport = () => {
    if (reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="dark">
      <TabsComponent
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Layers
        activeTab={activeTab}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
      <Score scrollToReport={scrollToReport} />
      <Map {...mapOptions} />
      <Report reportRef={reportRef} />
    </main>
  );
};

export default Home;
