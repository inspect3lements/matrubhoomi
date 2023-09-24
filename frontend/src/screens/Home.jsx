import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import {
  Tabs,
  Tab,
  Button,
  Select,
  SelectItem,
  Input,
  CircularProgress,
} from "@nextui-org/react";
import boundaries from "../assets/boundaries.json";
import sectors from "../assets/sectors.json";
import { useNavigate } from "react-router-dom";
import wards from "../assets/wards.json";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Chart from 'react-apexcharts'

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
    id: "bhoomi_chat",
    label: "Bhoomi Chat",
  },
  {
    id: "update",
    label: "Update Analyzer",
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
    <div className="flex justify-center items-center fixed top-4 left-1/2 -translate-x-2/4 z-30">
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

const SideNav = ({ activeNav, setActiveNav, reportRef, chatRef, updateRef, exportRef, contactRef }) => {
  const navigate = useNavigate();
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
            className={`py-3 text-center rounded-lg  mt-4 text-xl font-medium cursor-pointer ${activeNav === item.id
                ? "bg-[#3f3f46] text-[#fff]"
                : "bg-[#3f3f4600] text-[#707078]"
              }`}
            onClick={() => {
              setActiveNav(item.id);
              if (item.id === "analysis") {
                scrollToSection(reportRef);
              } else if (item.id === "bhoomi_chat") {
                scrollToSection(chatRef);
              } else if (item.id === "update") {
                scrollToSection(updateRef);
              } else if (item.id === "contact_us") {
                scrollToSection(contactRef);
              } else if (item.id === "export_data") {
                scrollToSection(exportRef);
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
        onClick={() => navigate("/login")}
      >
        <h1 className="text-[#f31260] text-xl font-semibold tracking-wide">
          Logout
        </h1>
      </Button>
    </div>
  );
};

const Metric =({})=>{
  const getGradientColors = (value) => {
    if (value < 35) {
      return ['#F3123B']; // Reddish color for values less than 35
    } else if (value >= 35 && value <= 75) {
      return ['#F5BD33']; // Yellowish color for values between 35 and 75
    } else {
      return ['#17C964']; // Green color for values above 75
    }
  };
  
  const series = [85]; 
  const gradientColors = getGradientColors(series);

  const options = {
    series: [75],
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#27272a',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#27272a',
          strokeWidth: '50%',
          margin: 0,
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#ececec',
            fontSize: '17px'
          },
          value: {
            formatter: function(val) {
              return parseInt(val);
            },
            color: '#fff',
            fontSize: '36px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'solid',
      colors: gradientColors,
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Percent'],
  };


  return(
    <div className="h-[56%] w-[20%] absolute right-0 top-[20%] bg-[#27272a] shadow-lg m-4 rounded-2xl flex flex-col justify-start items-center gap-5">
       <div className="h-[350px] w-[100%] bg-transparent rounded-lg p-4">
          <Chart options={options} series={series} type="radialBar" />
        </div>
      <div className="mt-4 flex flex-col items-start text-[#ececec] text-center text-lg ">
        <p>
          Value: 
        </p>
        <p>
          Color Explanation:
        </p>
      </div>
    </div>
  )
}


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

const Message = ({ message, bot = false }) => {
  return (
    <div
      className={`flex flex-col gap-2 w-full p-1 ${
        bot ? "items-start" : "items-end"
      }`}
    >
      <div className="flex flex-col p-5 bg-[#3f3f46] w-max rounded-lg mx-5 max-w-[60%]">
        <p className="text-[#efefef] text-lg font-semibold tracking-wide flex-wrap whitespace-pre-line">
          {message}
        </p>
      </div>
    </div>
  );
};

const BhoomiChat = ({ chatRef }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  let [messages, setMessages] = useState(["Hello there! I am Bhoomi ChatBot"]);
  let [message, setMessage] = useState("");
  let [loading, setLoading] = useState(false);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (message) {
      setMessages([...messages, message]);
      let mes = message;
      setMessage("");
      fetch("http://localhost:8000/chatbot?inp=" + mes, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Allow-Access-Control-Origin": "http://localhost:5173",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setMessages((messages) => [...messages, res["text"]]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div
      ref={chatRef}
      className="h-screen w-screen bg-[#3f3f46] flex flex-col justify-start items-center gap-10 overflow-hidden"
    >
      <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6 flex flex-col gap-3 relative z-0">
        {loading && (
          <div className="absolute h-full w-full flex justify-center items-center">
            <CircularProgress color="primary" size="large" />
          </div>
        )}
        <h1 className="text-[#efefef] text-2xl font-semibold tracking-wide mt-4 ml-4">
          Bhoomi chat
        </h1>
        <div className="flex-1 bg-[#212123] rounded-xl h-[90%] overflow-y-auto flex flex-col py-5 justify-end">
          {messages.map((message, i) => (
            <Message message={message} bot={i % 2 === 0} key={i} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-3">
          <Input
            variant="faded"
            label="Message"
            className="text-white !text-2xl"
            size="lg"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button
            size="md"
            className="h-full"
            onClick={(e) => {
              submit(e);
            }}
            disabled={loading}
          >
            <ArrowForwardIosIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Update = ({ updateRef }) => {
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
    <div
      ref={updateRef}
      className="h-screen w-screen bg-[#3f3f46] flex flex-col justify-start items-center gap-10"
    >
      <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6 flex flex-col gap-3 items-center">
        <img src="/bhoomi_analyzer.png" className="w-[10vw] mt-20" />
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
            <span className="h-full w-[2px] absolute"></span>
            <div className="h-full font-semibold absolute translate-y-[45%] -translate-x-1/2">
              <h1 className="text-2xl text-[#505050] p-2">OR</h1>
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
              <h1 className="text-[#efefef] text-lg font-semibold">Import GeoJson</h1>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExportData = ({ exportRef }) => {
  return (
    <div
      ref={exportRef}
      className="h-screen w-screen bg-[#3f3f46] flex flex-col justify-start items-center gap-10"
    >
      <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6 flex flex-col gap-3 justify-center">
        <div className="flex flex-row justify-center items-center gap-16">
          <div className="flex flex-col items-center">
            <div className="flex flex-col justify-between items-start gap-10">
              <div className="mx-auto max-w-screen-sm text-start">
                <h2 className="mb-1 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white mb-3">Export Data</h2>
                <p className="text-gray-500 ">Enter Your email address and get the link to download your report data</p>
              </div>
              <Input
                type="email"
                label="Enter Email"
                variant="bordered"
                className="w-[20vw]"
                size="lg"
                isRequired
              />
            <Button
              color="warning"
              className="w-[20vw] mt-5"
              size="lg"
              onClick={() => navigate("/")}
            >
              <h1 className="text-xl font-semibold">
                Export Data
              </h1>
            </Button>
            </div>
          </div>
          <div className="h-full w-[20vw] flex justify-center items-center">
            <img className="w-full" width="100" height="100" src="https://img.icons8.com/3d-fluency/300/secured-letter.png" alt="globe-africa" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ contactRef }) => {
  return (
    <div
      ref={contactRef}
      className="h-screen w-screen bg-[#3f3f46] flex flex-col justify-start items-center gap-10"
    >
      <div className="w-[80%] h-[89.5%] ml-[16%] mt-[4%] bg-[#27272a] rounded-xl overflow-y-scroll p-6 flex flex-col gap-3 justify-center">
        <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
          <img className="w-full" width="100" height="100" src="https://img.icons8.com/3d-fluency/300/globe-africa.png" alt="globe-africa" />
          <div className="mt-4 md:mt-0">
            <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Let's create more tools and ideas that brings us together.</h1>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">Matrubhoomi App is one small contribution to the mission and journey of Digital India. Let's join together to come up with innovative solutions that help us achieve this goal.</p>
            <Button size="lg" variant="shadow" color="warning">
              Connect with us
            </Button>
          </div>
        </div>
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
  const updateRef = useRef(null);
  const contactRef = useRef(null);
  const exportRef = useRef(null);

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
        updateRef={updateRef}
        exportRef={exportRef}
        contactRef={contactRef}
      />
      <Metric />
      <Map {...mapOptions} activeMap={activeMap} />
      {/* <Report reportRef={reportRef} />
      <BhoomiChat chatRef={chatRef} />
      <Update updateRef={updateRef} />
      <ExportData exportRef={exportRef} />
      <ContactCard contactRef={contactRef} /> */}
    </>
  );
};

export default Home;
