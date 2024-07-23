import { useEffect, useRef, useState } from "react";
import arrow from "../../assets/arrow-light.svg";
import arrowDark from "../../assets/arrow.svg";
import editDark from "../../assets/edit-black.svg";
import edit from "../../assets/edit-light.svg";
import info from "../../assets/info-light.svg";
import resetIcon from "../../assets/reset-dark.svg";
import search from "../../assets/search.svg";
import ChartGraph from "./chartGraph/ChartGraph";

import Calendar from "react-calendar";
import useChartDataStore from "../../store/useChartDataStore";
import formatDate from "../../utils/formateDate";
import formatNumber from "../../utils/formateNumber";
import SearchModal from "../searchModal/SearchModal";
import style from "./index.module.scss";
import formatToLongDateTime from "../../utils/formatDateToLongDateTime";
import ModalWrapper from "../modalWrapper/ModalWrapper";
import approximateToTwoDigits from "../../utils/approximateToTwoDecimal";
import { formatNumberWithCommas } from "../../utils/formatNumberWithCommas";
const dateModes = [
  {
    name: "1D",
    highlighted: false,
    value: "1day",
  },
  {
    name: "5D",
    highlighted: false,
    value: "5day",
  },

  {
    name: "1M",
    highlighted: false,
    value: "1month",
  },
  {
    name: "6M",
    highlighted: false,
    value: "6month",
  },
  {
    name: "YTD",
    highlighted: false,
    value: "ytd",
  },
  {
    name: "1Y",
    highlighted: false,
    value: "1year",
  },
  {
    name: "5y",
    highlighted: false,
    value: "5year",
  },
  {
    name: "MAX",
    highlighted: true,
    value: "max",
  },
];
function resetHighlightedProperty(arr) {
  return arr.map((item) => ({
    ...item,
    highlighted: false,
  }));
}

interface Mode {
  name: string;
  highlighted: boolean;
  value: string;
}
const Chart = ({ selectedChart, metaInfo }: any) => {
  const {
    budget,
    setBudget,
    sellDate,
    setSellDate,
    buyDate,
    setBuyDate,
    setCurrency,
    currency,
    stockDetails,
    logoUrl,
    sellData,
    buyData,
    buyDateDisplay,
    sellDateDisplay,
    setManualTime,
    setBuyDateDisplay,
    setSellDateDisplay,
    manualTime,
    timeSeries,
    setReloadData,
  } = useChartDataStore();
  const [modes, setModes] = useState<Mode[]>([...dateModes]);
  const [buycalendarIsOpen, setBuyCalendarIsOpen] = useState(false);
  const [sellcalendarIsOpen, setSellCalendarIsOpen] = useState(false);
  const [editPurshaseNumber, setEditPurshaseNumber] = useState(false);
  const [editCurrenciesIsOpen, setEditCurrenciesIsOpen] = useState(false);
  const [budgetValueBeforeSave, setBudgetValueBeforeSave] = useState(budget);
  const [searchModalIsOpen, setSearchModalIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(
    formatNumberWithCommas(budget)
  );
  const setTimeSeries = useChartDataStore((store) => store.setTimeSeries);
  const editInputRef = useRef(null);
  const changeMode = (selectedMode) => {
    // Update modes list to highlight only the selected mode
    const updatedModes = modes.map((mode) => ({
      ...mode,
      highlighted: mode.value === selectedMode.value,
    }));

    // Set the updated modes list
    setModes(updatedModes);
    setTimeSeries(selectedMode.value);
    setManualTime(false);
  };
  const formattedBuyDate = formatDate(buyDate);
  const formattedSellDate = formatDate(sellDate);
  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    setEditCurrenciesIsOpen(false);
  };
  const handleEditBudget = () => {
    setEditPurshaseNumber(false);

    setBudget(budgetValueBeforeSave);
  };
  const averageVolume =
    stockDetails?.volume &&
    parseInt(stockDetails?.volume) !== 0 &&
    formatNumber(stockDetails?.volume);
  const dayHigh = formatNumber(stockDetails?.high);
  const dayLow = formatNumber(stockDetails?.low);
  const yearHigh = formatNumber(stockDetails?.fifty_two_week?.high);
  const yearLow = formatNumber(stockDetails?.fifty_two_week?.low);
  const previousClose = formatNumber(stockDetails?.previous_close);
  const marketCap = formatNumber(stockDetails?.volume);
  const currentTimeForPrice = formatToLongDateTime(stockDetails?.datetime);
  const currentValue = formatNumber(stockDetails?.open);
  const percentageChange = formatNumber(stockDetails?.percent_change);
  const actualChange = formatNumber(stockDetails?.change);
  const handleClick = () => {
    // Focus on the input field when the button is clicked
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
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
  const increasedPercentage = approximateToTwoDigits(
    (parseInt(sellData?.value) / parseInt(buyData?.value)) * 100
  );
  const increasedValue = approximateToTwoDigits(
    (increasedPercentage / 100) * budget
  );
  const totalGain = (increasedPercentage * budget) / 100;
  const gain = approximateToTwoDigits(totalGain - budget);
  const actualChangeIsNegative = parseFloat(actualChange) < 0;
  const formattedBuyDateDisplay = formatDate(buyDateDisplay);
  const formattedSellDateDisplay = formatDate(sellDateDisplay);
  const handleBuyDateChange = (date) => {
    setBuyDate(date);
    setBuyDateDisplay(date);
    setManualTime(true);
  };
  const handleSellDateChange = (date) => {
    setSellDate(date);
    setSellDateDisplay(date);
    setManualTime(true);
  };
  const setNoHighlightedModes = () => {
    const modesToBeReset = resetHighlightedProperty(modes);
    setModes(modesToBeReset);
  };

  useEffect(() => {
    if (manualTime) setNoHighlightedModes();
  }, [manualTime]);
  const handleReset = () => {
    const updatedModes = modes.map((mode) => ({
      ...mode,
      highlighted: mode.value === "max",
    }));

    // Set the updated modes list
    setReloadData();
    setModes(updatedModes);
    setTimeSeries("max");
    setManualTime(false);
    setBudget(130000);
  };
  return (
    <div className={`${style.container} flexDirectionColumnOnMobileView `}>
      {searchModalIsOpen && (
        <SearchModal
          modalIsOpen={searchModalIsOpen}
          setModalIsOpen={setSearchModalIsOpen}
        />
      )}
      <div className={style.chartContainer}>
        <div className={style.row}>
          <div className={style.mainItemCard}>
            {logoUrl && <img src={logoUrl} alt="icon" />}
            <div className={style.nameContainer}>
              {stockDetails?.name && <h2>{stockDetails.name}</h2>}
              {stockDetails?.symbol && <h3>{stockDetails.symbol}</h3>}
            </div>
          </div>
        </div>
        <div className={`${style.row} flexDirectionColumnOnMobileView`}>
          <h2 className={style.priceTitle}>
            ${formatNumberWithCommas(currentValue)}{" "}
            <span
              className={style.highlightedGreen}
              style={{ color: actualChangeIsNegative && "var(--red)" }}
            >
              {actualChange} ({percentageChange}%)
            </span>
            <span className={style.dimmedDate}>
              Current price as of {currentTimeForPrice}
            </span>
          </h2>
          <div className={style.dateButtons}>
            {modes.map((mode, i) => (
              <button
                className={`${
                  mode.highlighted
                    ? "highlighted-timeframe-button"
                    : "normal-timeframe-button"
                }`}
                onClick={() => changeMode(mode)}
                key={i}
                value={mode.value}
                type="button"
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        <ChartGraph />
      </div>
      <div className={style.detailsContainer}>
        {" "}
        <div className={style.row}>
          <div
            className={`${style.searchContainer} removeOnMobileView`}
            onClick={() => setSearchModalIsOpen(true)}
          >
            <img src={search} alt="search icon" />
            <div>{metaInfo.searchPlaceholder}</div>
          </div>
        </div>
        <div className={style.rowColumn}>
          <div className={style.subRow}>
            <h4>Your Summary</h4>
            <img src={info} alt="info icon" />
          </div>
          <div className={style.subRow}>
            <p>
              You can refine your choices here, above or directly on the graph
            </p>
          </div>{" "}
          <div className={style.subRow}>
            <p>Investment currency</p>
            <span onClick={() => setEditCurrenciesIsOpen(true)}>
              <span>{currency}</span>
              <img
                src={arrow}
                style={
                  editCurrenciesIsOpen
                    ? { transform: "rotate(180deg)" }
                    : { transform: "rotate(0deg)" }
                }
              />
              {/* <div className={`${style.imgContainer} displayOnMobileView`}>
                {currency}
                <img
                  src={arrowDark}
                  id={style.blackArrow}
                  style={
                    editCurrenciesIsOpen
                      ? { transform: "rotate(180deg)" }
                      : { transform: "rotate(0deg)" }
                  }
                />
              </div> */}
              <ModalWrapper
                isOpen={editCurrenciesIsOpen}
                onClose={() => setEditCurrenciesIsOpen(false)}
              >
                <div className={style.editContainer}>
                  {" "}
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
                </div>
              </ModalWrapper>
            </span>
          </div>{" "}
          <div className={style.subRow}>
            <p>Sum invested</p>
            <span>
            <input
                type="text" // Use text type to allow formatting
                className={style.input}
                value={displayValue}
                onChange={handleBudgetChange}
                onKeyPress={handleKeyPress}
                onFocus={(e) => e.target.select()} // Select all text on focus
              />
              <img src={edit} onClick={() => handleClick()} />
            </span>
            {/* {editPurshaseNumber && (
              <ModalWrapper onClose={() => setEditPurshaseNumber(false)}>
                <div className={style.editContainer}>
                  <div className={style.editNumberContainer}>
                    <input
                      type="number"
                      className={style.input}
                      placeholder={budget}
                      value={budgetValueBeforeSave}
                      onChange={(e) => setBudgetValueBeforeSave(e.target.value)}
                    />
                    <button
                      className={style.saveButton}
                      onClick={() => handleEditBudget()}
                    >
                      {" "}
                      Save
                    </button>
                  </div>
                </div>
              </ModalWrapper>
            )} */}
          </div>{" "}
          <div className={style.subRow}>
            <p>Purchased on </p>
            <span>
              {formattedBuyDateDisplay}{" "}
              <img
                src={edit}
                onClick={() => setBuyCalendarIsOpen((prev) => !prev)}
                className={style.editIcon}
              />
              <div className={style.editContainer}>
                <ModalWrapper
                  isOpen={buycalendarIsOpen}
                  onClose={() => setBuyCalendarIsOpen(false)}
                >
                  <Calendar
                    value={formattedBuyDateDisplay}
                    onChange={handleBuyDateChange}
                    maxDate={new Date(formattedSellDateDisplay)}
                  />
                </ModalWrapper>
              </div>
            </span>
          </div>{" "}
          <div className={style.subRow}>
            <p>Sold on</p>
            <span>
              {formattedSellDateDisplay}
              <img
                src={edit}
                onClick={() => setSellCalendarIsOpen((prev) => !prev)}
              />
              <div className={style.editContainer}>
                <ModalWrapper
                  isOpen={sellcalendarIsOpen}
                  onClose={() => setSellCalendarIsOpen(false)}
                >
                  <Calendar
                    value={formattedSellDateDisplay}
                    onChange={handleSellDateChange}
                    maxDate={new Date()}
                    minDate={new Date(formattedBuyDateDisplay)}
                  />
                </ModalWrapper>
              </div>
            </span>
          </div>
          <div className={style.subRow}>
            <div className="divider" />
          </div>
          <div className={style.subRow}>
            <p>Profit/Loss</p>
            <span
              className="green"
              style={
                increasedPercentage >= 100
                  ? { color: "var(--green)" }
                  : { color: "var(--red)" }
              }
            >
              {currency}
              {formatNumberWithCommas(gain)}
            </span>
          </div>{" "}
          <div className={style.subRow}>
            <p>% Return</p>
            <span
              className="green"
              style={
                increasedPercentage >= 100
                  ? { color: "var(--green)" }
                  : { color: "var(--red)" }
              }
            >
              {increasedPercentage >= 100 && "+"}
              {increasedPercentage < 100 && "-"}
              {formatNumberWithCommas(increasedPercentage)}%
            </span>
          </div>{" "}
          <div className={style.subRow}>
            <p>Total return </p>
            <span>
              {currency}
              {formatNumberWithCommas(increasedValue)}
            </span>
          </div>{" "}
          <div className={`${style.subRow} ${style.resetButtonContainer}`}>
            <p className="removeOnMobileView">Hide Chart Options</p>
            <button
              className={style.resetButton}
              type="button"
              onClick={handleReset}
            >
              <img src={resetIcon} alt="info" />
              Reset
            </button>
          </div>
        </div>
        <div className={style.rowColumn}>
          <div className={style.subRow}>
            <h4>Stock Details</h4>
            <img src={info} alt="info" />
          </div>
          <div className={style.subRow}>
            <p>Previous Close</p>
            <span>${formatNumberWithCommas(previousClose)}</span>
          </div>
          <div className={style.subRow}>
            <p>Day range</p>
            <span>
              ${formatNumberWithCommas(dayLow)} - ${formatNumberWithCommas(dayHigh)}
            </span>
          </div>{" "}
          <div className={style.subRow}>
            <p>Year Range </p>
            <span>
              ${formatNumberWithCommas(yearLow)} - ${formatNumberWithCommas(yearHigh)}
            </span>
          </div>{" "}
          {marketCap && (
            <div className={style.subRow}>
              <p>Market cap</p>
              <span>${marketCap}</span>
            </div>
          )}
          {/* {averageVolume && (
            <div className={style.subRow}>
              <p>Average volume</p>
              <span>{averageVolume}</span>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Chart;
