import { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import AMZN from "../assets/amazon.svg";
import AAPL from "../assets/apple.svg";
import DIS from "../assets/disney.svg";
import MSFT from "../assets/microsoft.svg";
import tesla2 from "../assets/tesla 2.svg";
import TSLA from "../assets/tesla.svg";
import Chart from "../components/Chart/Chart";
import Navbar from "../components/Navbar/Navbar";
import Info from "../components/info/Info";
import WhatIfComponent from "../components/whatIf/WhatIfComponent";
import useChartDataStore from "../store/useChartDataStore";

const cryptoPageData = {
  metaInfo: {
    name: "stocks",
    searchPlaceholder: "Search markets and stocks",
  },
  searchExamples: [
    { name: "TSLA", img: TSLA },
    { name: "MSFT", img: MSFT },
    { name: "AAPL", img: AAPL },
    { name: "DIS", img: DIS },
    { name: "AMZN", img: AMZN },
  ],
  selectedChart: { name: "Tesla", shortName: "TSLA", img: tesla2 },
  information: {
    name: "Tesla",
    about: {
      p1: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles, stationary battery energy storage devices from home to grid-scale, solar panels and solar shingles, and related products and services. Its subsidiary Tesla Energy develops and is a major installer of photovoltaic systems in the United States and is one of the largest global suppliers of battery energy storage systems with 6.5 gigawatt-hours installed in 2022. Tesla is one of the world's most valuable companies and, as of 2023, is the world's most valuable automaker. In 2022, the company led the battery electric vehicle market, with 18% share.",
      p2: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles, stationary battery energy storage devices from home to grid-scale, solar panels and solar shingles, and related products and services.",
      p3: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles, stationary battery energy storage devices from home to grid-scale, solar panels and solar shingles, and related products and services.",
    },
    news: [
      {
        title: "Tesla skips employees' yearly merit-based stock compensations",
        shortdescription:
          "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles.",
        author: "By Wall Street Journal",
      },
      {
        title: "Tesla skips employees' yearly merit-based stock compensations",
        shortdescription:
          "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles.",
        author: "By Wall Street Journal",
      },
      {
        title: "Tesla skips employees' yearly merit-based stock compensations",
        shortdescription:
          "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles.",
        author: "By Wall Street Journal",
      },
    ],
  },
};

const Stocks = () => {
  const [stockSearchValue, setStockSearchValue] = useState(null);
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const navigate = useNavigate();
  const getData = useChartDataStore((store) => store.getData);
  const params = useParams();
  const symbol = params?.symbol;
  const {
    timeSeries,
    buyDate,
    sellDate,
    stockSymbol,
    setCurrentMode,
    setStockSymbol,
    currentMode,
    chartError,
    errorPopup,
    data,
    dataReloadTrigger,
  } = useChartDataStore((store) => store);

  useEffect(() => {
    const InitializePageWithInitialData = () => {
      if (currentMode !== "stocks") {
        setCurrentMode("stocks");
      }
      if (!symbol) {
        setStockSymbol("tsla");
      } else {
        setStockSymbol(symbol);
      }
    };
    InitializePageWithInitialData();
  }, []);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        await getData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCall();
  }, [buyDate, sellDate, timeSeries, stockSymbol, symbol, dataReloadTrigger]);

  useEffect(() => {
    if (errorPopup !== null || data?.status === "error") {
      setShowToast(true);
      toast.error(
        <div style={{display:"flex",flexDirection:"column"}}>
          No data from Twelvedata for the selected {stockSymbol}
          <button
            onClick={() => {
              navigate("/");
              setStockSymbol("tsla");
              toast.dismiss();
              setShowToast(false);
              setStockSearchValue('')
            }}
            style={{ marginLeft: "10px", padding: "5px 10px",borderRadius:"10px", fontSize: "20px",backgroundColor:"#0d99ff",color:"white" }}
          >
            OK
          </button>
        </div>,
        {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        }
      );
     
    } else {
      setShowToast(false);
    }
  }, [errorPopup, data?.status, stockSymbol, navigate]);

  return (
    <>
      <Navbar />
      <div className="page">
        <WhatIfComponent
          setStockSearchValue={setStockSearchValue}
          examples={[...cryptoPageData.searchExamples]}
          metaInfo={cryptoPageData.metaInfo}
          stockSearchValue={stockSearchValue}
        />
        <Chart
          selectedChart={cryptoPageData.selectedChart}
          metaInfo={cryptoPageData.metaInfo}
        />
        <Info
          info={cryptoPageData.information}
          metaInfo={cryptoPageData.metaInfo}
        />
      </div>
      {showToast && (<ToastContainer
        style={{
          width: "470px",
          height: "250px",
          fontSize: "28px",
          fontWeight: "bold",
        }}
        closeButton={false}
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      )}
    </>
  );
};

export default Stocks;
