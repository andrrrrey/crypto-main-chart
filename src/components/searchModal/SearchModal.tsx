import { Dispatch, FC, SetStateAction, memo, useEffect, useState } from "react";
import TailSpin from "react-loading-icons/dist/esm/components/tail-spin";
import useGetData from "../../hooks/useGetData";
import style from "./index.module.scss";
import useChartDataStore from "../../store/useChartDataStore";
import { useLocation, useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
interface SearchModal {
  modalIsOpen: boolean;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SearchModal: FC<SearchModal> = memo(({ modalIsOpen, setModalIsOpen }) => {
  const [currentActiveFilter, setCurrentActiveFilter] = useState<
    "stocks" | "cryptocurrencies"
  >("stocks");
  const [queryInput, setQueryInput] = useState("");
  const [searchURL, setSearchURL] = useState(
    `https://api.twelvedata.com/symbol_search?symbol=sssssssssssss`
  );
  const [searchIsActive, setSearchIsActive] = useState(false);
  const { currentMode, setCurrentMode } = useChartDataStore();
  const setStockSymbol = useChartDataStore((store) => store.setStockSymbol);

  const { data, loading, error } = useGetData(searchURL);
  const navigate = useNavigate();
  const location = useLocation();
  const debouncedSearchTerm = useDebounce(queryInput, 500);
  // const pathname = location.pathname;
  const closeModal = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e) {
      e.stopPropagation();
    }
    setModalIsOpen(false);
    document.body.style.overflow = "visible";
  };
  const openModal = (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e) {
      e.stopPropagation();
    }
    setModalIsOpen(true);
    document.body.style.overflow = "hidden";
  };
  const handleFilterChange = (e) => {
    setCurrentActiveFilter(e.target.value);
    setCurrentMode(e.target.value);
    setQueryInput("");
    if (e.target.value === "cryptocurrencies") {
      setSearchURL(
        `https://api.twelvedata.com/${e.target.value}?exchange=Binance&currency_quote=USD`
      );
    } else {
      setSearchURL(
        `https://api.twelvedata.com/${e.target.value}?exchange=NASDAQ`
      );
    }
    setSearchIsActive(false);
  };
  const handleStockClick = (e) => {
    setStockSymbol(e.target.value);
    closeModal();
    if (currentActiveFilter === "stocks") {
      navigate(`/${encodeURIComponent(e.target.value)}`);
      setCurrentMode("stocks");
    }
    if (currentActiveFilter === "cryptocurrencies") {
      navigate(`/crypto/${encodeURIComponent(e.target.value)}`);
      setCurrentMode("crypto");
    }
  };
  const trimmedData = [...data]?.splice(0, 30);
  useEffect(() => {
    if (modalIsOpen) openModal();
    if (!modalIsOpen) closeModal();
  }, []);
  const handleQueryInputChange = (e) => {
    setQueryInput(e.target.value);
  };
  const handleSearchClick = (e) => {
    e.preventDefault();
    setSearchURL(
      `https://api.twelvedata.com/symbol_search?symbol=${queryInput}`
    );
    setSearchIsActive(true);
  };
  useEffect(() => {
    setSearchURL(
      `https://api.twelvedata.com/symbol_search?symbol=${queryInput}`
    );
    setSearchIsActive(true);
  }, [debouncedSearchTerm]);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className={style.modalContainer}
      onClick={(e) => closeModal(e)}
      style={modalIsOpen ? { display: "flex" } : { display: "none" }}
    >
      <div
        className={style.childContianerUsedForScrolling}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={style.modal}>
          {/* <div className={style.filtersContainer}>
            <button
              onClick={handleFilterChange}
              value={"stocks"}
              type="button"
              className={
                currentActiveFilter === "stocks" ? style.activeFilter : ""
              }
            >
              Stocks
            </button>
            <button
              onClick={handleFilterChange}
              value={"cryptocurrencies"}
              type="button"
              className={
                currentActiveFilter === "cryptocurrencies"
                  ? style.activeFilter
                  : ""
              }
            >
              Crypto
            </button>
          </div> */}
          <form className={style.searchComponent}>
            <input
              type="text"
              value={queryInput}
              onChange={handleQueryInputChange}
              placeholder="Type to search for Markets and Stocks"
            />
            {/* <button onClick={handleSearchClick} type="submit">
              search
            </button> */}
          </form>
          {trimmedData &&
            !loading &&
            trimmedData.length > 0 &&
            !searchIsActive && (
              <div className={style.results}>
                {trimmedData?.map((item: any, i: number) => (
                  <button
                    key={i}
                    onClick={handleStockClick}
                    type="button"
                    value={item.symbol}
                  >
                    {currentActiveFilter === "cryptocurrencies"
                      ? item.currency_base
                      : item.name}
                  </button>
                ))}
              </div>
            )}

          {trimmedData &&
            !loading &&
            trimmedData.length > 0 &&
            searchIsActive && (
              <div className={style.results}>
                {trimmedData?.map((item: any, i: number) => (
                  <button
                    key={i}
                    onClick={handleStockClick}
                    type="button"
                    value={item.symbol}
                  >
                    {item.instrument_name} - <span>{item.exchange}</span>
                  </button>
                ))}
              </div>
            )}
          {loading && (
            <div className={style.loadingContainer}>
              <TailSpin
                stroke="#8f8a8e"
                fontSize={50}
                className={style.loadingIcon}
                strokeWidth={2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default SearchModal;
