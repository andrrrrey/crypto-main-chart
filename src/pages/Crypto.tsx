import Chart from "../components/Chart/Chart";
import Navbar from "../components/Navbar/Navbar";
import ChartSwitch from "../components/chartSwitch/ChartSwitch";
import Info from "../components/info/Info";
import Language from "../components/language/Language";
import WhatIfComponent from "../components/whatIf/WhatIfComponent";
import eth from "../assets/ethereum 1.svg";
import binance from "../assets/binance 1.svg";
import btc from "../assets/bitcoin 1.svg";
import solana from "../assets/solana 1.svg";
import btc2 from "../assets/bitcoin 2.svg";
import { useEffect } from "react";
import useChartDataStore from "../store/useChartDataStore";
import { useParams } from "react-router-dom";
const cryptoPageData = {
  metaInfo: {
    name: "crypto",
    searchPlaceholder: "Search crypto currencies",
  },
  searchExamples: [
    {
      img: btc,
      name: "Bitcoin",
    },
    {
      img: eth,
      name: "Ethereum",
    },
    {
      img: binance,
      name: "Binance",
    },
    {
      img: solana,
      name: "Solana",
    },
  ],
  selectedChart: {
    name: "Bitcoin",
    shortName: "BTC",
    img: btc2,
  },
  information: {
    name: "Bitcoin",
    about: {
      p1: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles, stationary battery energy storage devices from home to grid-scale, solar panels and solar shingles, and related products and services. Its subsidiary Tesla Energy develops and is a major installer of photovoltaic systems in the United States and is one of the largest global suppliers of battery energy storage systems with 6.5 gigawatt-hours installed in 2022. Tesla is one of the world's most valuable companies and, as of 2023, is the world's most valuable automaker. In 2022, the company led the battery electric vehicle market, with 18% share.",
      p2: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles, stationary battery energy storage devices from home to grid-scale, solar panels and solar shingles, and related products and services. ",
      p3: "Tesla, Inc. is an American multinational automotive and clean energy company headquartered in Austin, Texas, which designs and manufactures electric vehicles, stationary battery energy storage devices from home to grid-scale, solar panels and solar shingles, and related products and services. ",
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
const Crypto = () => {
  const {
    timeSeries,
    buyDate,
    sellDate,
    stockSymbol,
    getData,
    setCurrentMode,
    setStockSymbol,
    currentMode,
    dataReloadTrigger,
  } = useChartDataStore();
  const params = useParams();
  const symbol = params?.symbol;
  useEffect(() => {
    const InitializePageWithInitialData = () => {
      if (currentMode !== "crypto") {
        setCurrentMode("crypto");
      }
      if (!symbol) {
        setStockSymbol("Btc/usd");
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
  return (
    <>
      <Navbar />
      <div className="page">
        <WhatIfComponent
          examples={[...cryptoPageData.searchExamples]}
          metaInfo={cryptoPageData.metaInfo}
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
    </>
  );
};
export default Crypto;
