import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Tabs, Tab, Button, Select, SelectItem } from "@nextui-org/react";
import boundaries from "../assets/boundaries.json";
import sectors from "../assets/sectors.json";
import wards from "../assets/wards.json";

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

const maps = [
  {
    id: "boundaries",
    label: "Boundary Wise",
    data: boundaries,
  },
  {
    id: "sectors",
    label: "Sector Wise",
    data: sectors,
  },
  {
    id: "wards",
    label: "Ward Wise",
    data: wards,
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

const Map = ({ lng, lat, zoom, activeMap }) => {
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

    if (map.current) {
      map.current.on("load", () => {
        maps.forEach(({ id, data }) => {
          map.current.addSource(id, {
            type: "geojson",
            data,
          });
        });

        maps.forEach(({ id }) => {
          map.current.addLayer({
            id: id + "-layer",
            type: "fill",
            source: id,
            paint: {
              "fill-color": "#fcac2c",
              "fill-outline-color": "#000",
              "fill-opacity": 0.5,
            },
            layout: {
              visibility: activeMap === id ? "visible" : "none",
            },
          });
        });
      });
    }
  }, [lng, lat, zoom, activeMap]);

  useEffect(() => {
    maps.forEach(({ id }) => {
      if (map.current.getLayer(id + "-layer")) {
        map.current.setLayoutProperty(
          id + "-layer",
          "visibility",
          activeMap === id ? "visible" : "none"
        );
      }
    });
  }, [activeMap]);

  return <div ref={mapContainer} className="map-container w-screen h-screen" />;
};

const TabsComponent = ({
  tabs,
  activeTab,
  setActiveTab,
  maps,
  activeMap,
  setActiveMap,
}) => {
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  const handleMapChange = (key) => {
    setActiveMap(key);
  };
  return (
    <div className="flex justify-center items-center fixed top-4 left-1/2 -translate-x-2/4">
      <div className="h-[52px] rounded-xl bg-[#27272a] -translate-x-20 flex justify-center items-center px-6">
        <h1 className="text-[#afafaf] text-xl z-2">English</h1>
      </div>
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
      <Tabs
        items={maps}
        size="lg"
        color="default"
        className="scale-125 translate-x-32"
        radius="md"
        selectedKey={activeMap}
        defaultSelectedKey={"boundaries"}
        onSelectionChange={handleMapChange}
      >
        {(item) => <Tab key={item.id} title={item.label} value={item.id}></Tab>}
      </Tabs>

      <div className="h-[52px] w-32 rounded-xl bg-[#27272a] translate-x-48 flex justify-center items-center px-6">
        <h1 className="text-[#afafaf] text-xl z-2">10 Years</h1>
      </div>
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
      <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6">
        <h1 className="text-[#efefef] text-2xl font-semibold tracking-wide mt-4 ml-4">
          Report Yeah
        </h1>
      </div>
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
          Bhoomi Chat
        </h1>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeMap, setActiveMap] = useState("sectors"); // Default to boundaries
  const [activeTab, setActiveTab] = useState("urban-plan");
  const [activeNav, setActiveNav] = useState("home");
  const [mapOptions, setMapOptions] = useState({
    lng: 76.76,
    lat: 30.735,
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
        maps={maps}
        activeMap={activeMap}
        setActiveMap={setActiveMap}
      />
      <SideNav
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        reportRef={reportRef}
        chatRef={chatRef}
      />
      <Map {...mapOptions} activeMap={activeMap} />
      <Report reportRef={reportRef} />
      <BhoomiChat chatRef={chatRef} />
    </>
  );
};

export default Home;
