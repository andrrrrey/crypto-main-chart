import arrow from "../../assets/arrow.svg";
import calendar from "../../assets/calendar.svg";
import search from "../../assets/search.svg";
import "./index.module.scss";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import facebook from "../../assets/facebook 1.svg";
import info from "../../assets/info-dark.svg";
import linkedIn from "../../assets/linkedin 1.svg";
import mail from "../../assets/mail 1.svg";
import reddit from "../../assets/reddit 1.svg";
import telegram from "../../assets/telegram (1) 1.svg";
import twitter from "../../assets/twitter (1) 1.svg";
import whatsapp from "../../assets/whatsapp 1.svg";
import Calendar from "react-calendar";
import "../../calendarStyles.scss";
import style from "./index.module.scss";
import ChartSwitch from "../chartSwitch/ChartSwitch";
import Language from "../language/Language";
import SearchModal from "../searchModal/SearchModal";
import useChartDataStore from "../../store/useChartDataStore";
import formatDate from "../../utils/formateDate";
import ModalWrapper from "../modalWrapper/ModalWrapper";
import approximateToTwoDigits from "../../utils/approximateToTwoDecimal";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";
import useGetData from "../../hooks/useGetData";
import useDebounce from "../../hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
interface Examples {
  name: string;
  img: string;
}
function subtractDaysFromDate(dateParam: Date, number: number) {
  const date = dateParam;
  const subtractedDay = date.getDate() - number;
  const day = subtractedDay.toString().padStart(0, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear().toString();

  return `${year}-${month}-${day}`;
}

const WhatIfComponent: FC<any> = ({
  examples,
  metaInfo,
  setStockSearchValue,
  stockSearchValue
}) => {
  const [buycalendarIsOpen, setBuyCalendarIsOpen] = useState(false);
  const [sellcalendarIsOpen, setSellCalendarIsOpen] = useState(false);
  const [currencySelectorIsOpen, setCurrencySelectorIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm) {
      // const results = stocks.filter(stock =>
      //   stock.toLowerCase().includes(searchTerm.toLowerCase())
      // );
      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  }, [searchTerm]);
  const socialMediaLinks = [
    { img: twitter, href: "" },
    { img: facebook, href: "" },
    { img: linkedIn, href: "" },
    { img: whatsapp, href: "" },
    { img: telegram, href: "" },
    { img: reddit, href: "" },
    { img: mail, href: "" },
  ];
  const socialMediaLinksFirstSection = socialMediaLinks.slice(0, 4);
  const socialMediaLinksSecondSection = socialMediaLinks.slice(4, 10);

  const openModal = () => {
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const {
    setBudget,
    budget,
    setSellDate,
    sellDate,
    setBuyDate,
    buyDate,
    setCurrency,
    currency,
    buyData,
    sellData,
    buyDateDisplay,
    sellDateDisplay,
    setManualTime,
    setBuyDateDisplay,
    setSellDateDisplay,
  } = useChartDataStore();

  const formttedSellDate = formatDate(sellDate);
  const formttedBuyDate = formatDate(buyDate);
  const formattedBuyDateDisplay = formatDate(buyDateDisplay);
  const formattedSellDateDisplay = formatDate(sellDateDisplay);
  const navigate = useNavigate();
  const location = useLocation();
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleCurrencySelectorDisplay = (e) => {
    setCurrencySelectorIsOpen(true);
    // e.stopPropagation();
  };
  // console.log(currencySelectorIsOpen, "current");

  const increasedPercentage = approximateToTwoDigits(
    (parseInt(sellData?.value) / parseInt(buyData?.value)) * 100
  );
  const increasedValue = approximateToTwoDigits(
    (increasedPercentage / 100) * budget
  );
  const handleManualEntryBuyDateChange = (value) => {
    setBuyDate(value);
    setBuyDateDisplay(value);
    setManualTime(true);
  };
  const handleManualEntrySellDateChange = (value) => {
    setSellDate(value);
    setSellDateDisplay(value);
    setManualTime(true);
  };

  const [currentActiveFilter, setCurrentActiveFilter] = useState("stocks");
  const [searchURL, setSearchURL] = useState(
    "https://api.twelvedata.com/symbol_search?symbol=sssssssssssss"
  );
  const [queryInput, setQueryInput] = useState("");
  const [searchIsActive, setSearchIsActive] = useState(false);
  const { currentMode, setCurrentMode } = useChartDataStore();
  const setStockSymbol = useChartDataStore((store) => store.setStockSymbol);
  const { data, loading } = useGetData(searchURL);
  const debouncedSearchTerm = useDebounce(queryInput, 500);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(
    formatNumberWithCommas(budget)
  );
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas for a valid number

    // Only allow numbers
    if (/^\d*$/.test(value)) {
      const numberValue = Number(value);
      setBudget(numberValue);
      setDisplayValue(formatNumberWithCommas(numberValue));
    } else {
      setDisplayValue(displayValue); // Keep the current display value if invalid input
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d*$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleInputBlur = () => {
    // Optionally, you can close the dropdown when clicking outside of it
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Delay to allow click event on dropdown items
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchURL(
        `https://api.twelvedata.com/symbol_search?symbol=${debouncedSearchTerm}`
      );
      setSearchIsActive(true);
    } else {
      setSearchIsActive(false);
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    if (stockSearchValue==='') {
     setQueryInput('')
    }
  }, [stockSearchValue === '']);

  const handleFilterChange = (e) => {
    setCurrentActiveFilter(e.target.value);
    setCurrentMode(e.target.value);
    setQueryInput("");
    if (e.target.value === "cryptocurrencies") {
      setSearchURL(
        "https://api.twelvedata.com/cryptocurrencies?exchange=Binance&currency_quote=USD"
      );
    } else {
      setSearchURL("https://api.twelvedata.com/stocks?exchange=NASDAQ");
    }
    setSearchIsActive(false);
  };

  const handleQueryInputChange = (e) => {
    setQueryInput(e.target.value);
  };

  const handleStockClick = (item) => {
    console.log(item, "eeeeeeeee");

    const value = `${item.instrument_name} - ${item.exchange}`;
    console.log(value, "rrrrrrrrrr");

    setQueryInput(value);
    setStockSymbol(item.symbol);
    if (currentActiveFilter === "stocks") {
      navigate(`/${encodeURIComponent(item.symbol)}`);
      setCurrentMode("stocks");
    } else if (currentActiveFilter === "cryptocurrencies") {
      navigate(`/crypto/${encodeURIComponent(item.symbol)}`);
      setCurrentMode("crypto");
    }
  };

  const trimmedData = data ? [...data].splice(0, 30) : [];

  return (
    <>
      {/* {modalIsOpen && (
        <SearchModal
          modalIsOpen={modalIsOpen}
          setModalIsOpen={setModalIsOpen}
        />
      )} */}

      <div className={style.container}>
        <div className={style.settingRow}>
          <Language />
        </div>
        <ChartSwitch />

        <div className={`${style.row} flexDirectionColumnOnMobileView`}>
          <h1 className="flexDirectionColumnOnMobileView">
            <span>What if I had </span>
            <span> Invested...</span>
          </h1>
          <span className={style.inputAndInfoContainer}>
            <div className="pale-button">
              <span
                className={`${style.dropDown} ${style.paleBackground}`}
                onClick={(e) => {
                  handleCurrencySelectorDisplay(e);
                }}
              >
                {currency}{" "}
                <img
                  src={arrow}
                  alt="arrow"
                  style={{
                    transform: currencySelectorIsOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                  id={style.arrowImg}
                />
                <div className={style.optionsContainer}>
                  <ModalWrapper
                    isOpen={currencySelectorIsOpen}
                    onClose={(e) => {
                      setCurrencySelectorIsOpen(false);
                    }}
                  >
                    <div className={style.optionsWrapper}>
                      <button
                        value={"$"}
                        type="button"
                        onClick={handleCurrencyChange}
                      >
                        $
                      </button>
                      <button
                        value={"€"}
                        type="button"
                        onClick={handleCurrencyChange}
                      >
                        €
                      </button>
                      <button
                        value={"£"}
                        type="button"
                        onClick={handleCurrencyChange}
                      >
                        £
                      </button>
                    </div>
                  </ModalWrapper>
                </div>
              </span>{" "}
              <input
                type="text" // Use text type to allow formatting
                className={style.input}
                value={displayValue}
                onChange={handleBudgetChange}
                onKeyPress={handleKeyPress}
                onFocus={(e) => e.target.select()} // Select all text on focus
              />
            </div>

            <img src={info} alt="info img" />
          </span>
        </div>

        <div
          className={`${style.row} flexDirectionColumnOnMobileView ${style.extraMarginBottom}`}
        >
          <h1>in</h1>
          <div className="relative">
            <div className="flex gap-3 shadow-3xl sm:w-[200px] md:w-[30vw] p-5 rounded-lg">
              <img src={search} id={style.searchImg} alt="search img" />
              <input
                type="text"
                value={queryInput}
                onChange={handleQueryInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={metaInfo.searchPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>

            {isDropdownOpen && queryInput && (
              <ul className="absolute z-10 w-[60vw] mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-96 overflow-y-auto">
                {trimmedData &&
                  !loading &&
                  trimmedData.length > 0 &&
                  !searchIsActive && (
                    <div className="results">
                      {trimmedData?.map((item: any, i: number) => (
                        <div className="listItem" key={i}>
                          <button
                            onClick={() => handleStockClick(item)}
                            type="button"
                            value={item.symbol}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {currentActiveFilter === "cryptocurrencies"
                              ? item.currency_base
                              : item.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                {trimmedData &&
                  !loading &&
                  trimmedData.length > 0 &&
                  searchIsActive && (
                    <div className="results">
                      {trimmedData?.map((item: any, i: number) => (
                        <div className="listItem" key={i}>
                          <button
                            onClick={() => handleStockClick(item)}
                            type="button"
                            value={item.symbol}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            {item.instrument_name} -{" "}
                            <span>{item.exchange}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                {loading && (
                  <div className="loadingContainer flex justify-center items-center py-4">
                    <TailSpin
                      stroke="#8f8a8e"
                      fontSize={50}
                      className="loadingIcon"
                      strokeWidth={2}
                    />
                  </div>
                )}
              </ul>
            )}
          </div>
          <h1 className="removeOnMobileView">on this day</h1>
          <div
            className={` pale-button removeOnMobileView`}
            onClick={() => setBuyCalendarIsOpen(true)}
          >
            <div className={style.calendarContainer}>
              <ModalWrapper
                isOpen={buycalendarIsOpen}
                onClose={() => setBuyCalendarIsOpen(false)}
              >
                <Calendar
                  value={buyDateDisplay}
                  onChange={handleManualEntryBuyDateChange}
                  maxDate={new Date(subtractDaysFromDate(sellDateDisplay, 5))}
                />
              </ModalWrapper>
            </div>
            <span className={style.dropDown}>
              <img src={calendar} alt="icon" />
            </span>{" "}
            <span className={style.value}>{formattedBuyDateDisplay}</span>
          </div>
        </div>

        <div className={`${style.row} flexDirectionColumnOnMobileView`}>
          <div className={style.onAndSoldOnWrapper}>
            <h1 className="displayOnMobileView">on </h1>
            <div
              className={` pale-button displayOnMobileView`}
              onClick={() => setBuyCalendarIsOpen(true)}
            >
              <div className={style.calendarContainer}>
                {buycalendarIsOpen && (
                  <Calendar
                    value={formattedBuyDateDisplay}
                    onChange={handleManualEntryBuyDateChange}
                    maxDate={new Date(subtractDaysFromDate(sellDateDisplay, 5))}
                  />
                )}
              </div>
              <span className={style.dropDown}>
                <img src={calendar} alt="icon" />
              </span>{" "}
              <span className={style.value}>{formttedBuyDate}</span>
            </div>
          </div>
          <span className={style.onAndSoldOnWrapper}>
            <h1>and sold on </h1>
            <div
              className="pale-button"
              onClick={() => setSellCalendarIsOpen(true)}
            >
              <div className={style.calendarContainer}>
                <ModalWrapper
                  isOpen={sellcalendarIsOpen}
                  onClose={() => setSellCalendarIsOpen(false)}
                >
                  <Calendar
                    value={formattedSellDateDisplay}
                    onChange={handleManualEntrySellDateChange}
                    maxDate={new Date()}
                    minDate={new Date(buyDateDisplay)}
                  />
                </ModalWrapper>
              </div>
              <span className={style.dropDown}>
                <img src={calendar} alt="icon" />
              </span>{" "}
              <span className={style.value}>{formattedSellDateDisplay}</span>
            </div>
          </span>
        </div>

        <div className={`${style.row} flexDirectionColumnOnMobileView`}>
          <div className="divider" />
        </div>

        <div className={`${style.row} flexDirectionColumnOnMobileView`}>
          <h1 className={style.degradedh1}>
            <div className={style.section1}>
              Your{" "}
              <strong className={style.highlightedBlack}>
                {currency}
                {formatNumberWithCommas(budget)}
              </strong>{" "}
            </div>
            <div>would have</div>
            <div className={style.section2}>
              turned into{"        "}
              <strong
                className={style.highlightedGreen}
                style={
                  increasedPercentage >= 100
                    ? { color: "var(--green)" }
                    : { color: "var(--red)" }
                }
              >
                {currency}
                {formatNumberWithCommas(increasedValue)}
              </strong>
            </div>
            <span
              style={
                increasedPercentage >= 100
                  ? { color: "var(--green)" }
                  : { color: "var(--red)" }
              }
              id={style.increasePercentageButton}
            >
              {increasedPercentage >= 100 ? "+" : "-"}
              {formatNumberWithCommas(increasedPercentage)}%
            </span>
          </h1>
        </div>

        <div className={`${style.row} flexDirectionColumnOnMobileView`}>
          <span className={style.shareYourResults}>Share your results</span>
          <span className={style.socialMediaIcons}>
            <div>
              {socialMediaLinksFirstSection.map((icon, i) => (
                <Link to={icon.href} key={i}>
                  <img src={icon.img} alt="icon" />
                </Link>
              ))}
            </div>
            <div>
              {socialMediaLinksSecondSection.map((icon, i) => (
                <Link to={icon.href} key={i}>
                  <img src={icon.img} alt="icon" />
                </Link>
              ))}
            </div>
          </span>
        </div>

        <div
          className={`${style.row} disableOnMobileScreen`}
          style={{ display: "none" }}
        >
          <span className={`${style.detailedBreakdown} `}>
            Detailed Breakdown
          </span>{" "}
          <img src={arrow} alt="icon" />
        </div>
      </div>
    </>
  );
};

export default WhatIfComponent;
