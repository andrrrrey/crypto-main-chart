import classNames from "classnames";
import React from "react";
import { useNavigate } from "react-router-dom";
import useChartDataStore from "../../store/useChartDataStore";
import style from "./index.module.scss";

interface ChartSwitch {
  defaultMode?: "/" | "crypto";
}

const ChartSwitch: React.FC<ChartSwitch> = React.memo(() => {
  const navigate = useNavigate();
  const currentMode = useChartDataStore((store) => store.currentMode);
  const modeIsCrypto = currentMode === "crypto";

  const handleSwitch = (clickedMode: "/" | "/crypto", e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${clickedMode}`);
  };

  return (
    <div className={style.modeContainer}>
      <div
        className={classNames(style.greenOverlayWrapper, {
          [style.activeCryptoOverlay]: modeIsCrypto,
        })}
      >
        <div className={style.green} />
      </div>
      <div
        className={classNames(style.mode, {
          [style.modeIsActive]: !modeIsCrypto,
        })}
        onClick={(e) => {
          handleSwitch("/", e);
        }}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.625 3.125V21.875C15.625 23.6042 14.2292 25 12.5 25C10.7708 25 9.375 23.6042 9.375 21.875V3.125C9.375 1.39583 10.7708 0 12.5 0C14.2292 0 15.625 1.39583 15.625 3.125ZM21.875 6.25C20.1458 6.25 18.75 7.64583 18.75 9.375V21.875C18.75 23.6042 20.1458 25 21.875 25C23.6042 25 25 23.6042 25 21.875V9.375C25 7.64583 23.6042 6.25 21.875 6.25ZM3.125 12.5C1.39583 12.5 0 13.8958 0 15.625V21.875C0 23.6042 1.39583 25 3.125 25C4.85417 25 6.25 23.6042 6.25 21.875V15.625C6.25 13.8958 4.85417 12.5 3.125 12.5Z"
            fill="white"
          />
        </svg>
        <span>Stocks</span>
      </div>
      <div
        className={classNames(style.mode, {
          [style.modeIsActive]: modeIsCrypto,
        })}
        onClick={(e) => {
          handleSwitch("/crypto", e);
        }}
      >
        <svg
          width="22"
          height="30"
          viewBox="0 0 22 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.2356 13.1511C19.0667 12.0389 19.5556 10.6578 19.5556 9.16667C19.5556 5.67111 16.8667 2.78667 13.4444 2.46889V1.83333C13.4444 0.818889 12.6256 0 11.6111 0C10.5967 0 9.77778 0.818889 9.77778 1.83333V2.44444H7.33333V1.83333C7.33333 0.818889 6.51444 0 5.5 0C4.48556 0 3.66667 0.818889 3.66667 1.83333V2.76222C1.52778 3.52 0 5.56111 0 7.94444V21.3889C0 23.7844 1.52778 25.8133 3.66667 26.5711V27.5C3.66667 28.5144 4.48556 29.3333 5.5 29.3333C6.51444 29.3333 7.33333 28.5144 7.33333 27.5V26.8889H9.77778V27.5C9.77778 28.5144 10.5967 29.3333 11.6111 29.3333C12.6256 29.3333 13.4444 28.5144 13.4444 27.5V26.8889H14.6667C18.7122 26.8889 22 23.6011 22 19.5556C22 16.8056 20.4844 14.41 18.2356 13.1511ZM3.66667 7.94444C3.66667 6.93 4.48556 6.11111 5.5 6.11111H12.8333C14.52 6.11111 15.8889 7.48 15.8889 9.16667C15.8889 10.8533 14.52 12.2222 12.8333 12.2222H3.66667V7.94444ZM14.6667 23.2222H5.5C4.48556 23.2222 3.66667 22.4033 3.66667 21.3889V15.8889H14.6667C16.6833 15.8889 18.3333 17.5389 18.3333 19.5556C18.3333 21.5722 16.6833 23.2222 14.6667 23.2222Z"
            fill="white"
          />
        </svg>

        <span>Crypto</span>
      </div>
    </div>
  );
});

export default ChartSwitch;
