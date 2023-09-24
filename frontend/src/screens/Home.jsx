import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Tabs, Tab, Button } from "@nextui-org/react";
import ReportPage from "./Report";

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

const navItems = [
  {
    id: "home",
    label: "Home",
  },
  {
    id: "analysis",
    label: "Analysis",
  },
  {
    id: "update",
    label: "Update",
  },
  {
    id: "bhoomi_chat",
    label: "Bhoomi Chat",
  },
  {
    id: "export_data",
    label: "Export Data",
  },
  {
    id: "contact_us",
    label: "Contact Us",
  },
];

mapboxgl.accessToken =
  "pk.eyJ1IjoiZXNoYW50cml2ZWRpMjEiLCJhIjoiY2xtdzJxaTR0MHVmaTJqcXB6OG52MzYxbiJ9.u5AhJ0TqCLwiBmoix9MRnQ";

const Map = ({ lng, lat, zoom }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
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
    <div className="flex flex-col fixed top-4 left-1/2 -translate-x-2/4">
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

const SideNav = ({ activeNav, setActiveNav, reportRef, chatRef }) => {
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-[96%] w-[15%] fixed left-0 top-0 bg-[#27272a] shadow-lg m-4 rounded-2xl flex flex-col justify-start items-center gap-5">
      <img src="/header.svg" className="w-[80%]" />
      <div className="w-[80%] h-[80%]">
        {navItems?.map((item) => (
          <div
            className={`py-3 text-center rounded-lg  mt-4 text-xl font-medium cursor-pointer ${
              activeNav === item.id
                ? "bg-[#3f3f46] text-[#fff]"
                : "bg-[#3f3f4600] text-[#707078]"
            }`}
            onClick={() => {
              setActiveNav(item.id);
              if (item.id === "analysis") {
                scrollToSection(reportRef);
              } else if (item.id === "bhoomi_chat") {
                scrollToSection(chatRef);
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            key={item.id}
          >
            {item.label}
          </div>
        ))}
      </div>
      <Button
        color="error"
        className="w-[75%] mb-10 border-1 border-[#f31260]"
        size="lg"
      >
        <h1 className="text-[#f31260] text-xl font-semibold tracking-wide">
          Logout
        </h1>
      </Button>
    </div>
  );
};

const Report = ({ reportRef }) => {
  return (
    <div
      ref={reportRef}
      className="h-screen w-screen bg-[#3f3f46] flex flex-col justify-start items-center gap-10"
    >
      <ReportPage/>
    </div>
  );
};

const BhoomiChat = ({ chatRef }) => {
  return (
    <div
      ref={chatRef}
      className="h-screen w-screen bg-[#3f3f46] flex flex-col justify-start items-center gap-10"
    >
      <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6">
        <h1 className="text-[#efefef] text-2xl font-semibold tracking-wide mt-4 ml-4">
          Chatboot Yeah
        </h1>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState("urban-plan");
  const [activeNav, setActiveNav] = useState("home");
  const [mapOptions, setMapOptions] = useState({
    lng: 76.78,
    lat: 30.73,
    zoom: 12,
  });

  const reportRef = useRef(null);
  const chatRef = useRef(null);

  return (
    <>
      <TabsComponent
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <SideNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        reportRef={reportRef}
        chatRef={chatRef}
      />
      <Map {...mapOptions} />
      <Report reportRef={reportRef} />
      <BhoomiChat chatRef={chatRef} />
    </>
  );
};

export default Home;
