import { useEffect, useMemo, useRef, useState } from "react";
import moveIcon from "../../assets/move-white.svg";
import style from "./index.module.scss";
import useChartDataStore from "../../store/useChartDataStore";
import formatToLongDateTime from "../../utils/formatDateToLongDateTime";
import { useLocation } from "react-router-dom";
import formatDate from "../../utils/formateDate";
const findNearestPointIndex = (
  mouseX: number,
  sortedArray: number[]
): number => {
  let nearestIndex = 0; // Initialize index of nearest point with the first index in the array
  let minDistance = Math.abs(mouseX - sortedArray[0]); // Initialize minimum distance with the distance to the first point

  // Iterate through the array to find the nearest point in both directions
  for (let i = 1; i < sortedArray.length; i++) {
    const distanceLeft = Math.abs(mouseX - sortedArray[i - 1]); // Calculate the distance to the left point
    const distanceRight = Math.abs(mouseX - sortedArray[i]); // Calculate the distance to the right point

    // Check if the distance to the left point is smaller than the minimum distance
    if (distanceLeft < minDistance) {
      minDistance = distanceLeft; // Update minimum distance
      nearestIndex = i - 1; // Update index of nearest point
    }

    // Check if the distance to the right point is smaller than the minimum distance
    if (distanceRight < minDistance) {
      minDistance = distanceRight; // Update minimum distance
      nearestIndex = i; // Update index of nearest point
    }
  }

  return nearestIndex; // Return the index of the nearest point
};
const getMidPointPosition = (e, maxLeftDistance) => {
  const id = e.target.id;
  const containerLeft = e.currentTarget.getBoundingClientRect().left;
  const halfWidth = document.getElementById(id).offsetWidth / 2;
  const distance = containerLeft - maxLeftDistance;
  return halfWidth + distance;
};
const LinesOverlay = ({ orientations }: any) => {
  //hover line states
  const [lineHeight, setLineHeight] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [maxLeftDistance, setMaxLeftDistance] = useState(0);
  //button movmentStates
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialDivX, setInitialDivX] = useState(0);
  const [boughtButtonLeft, setBoughtButtonLeft] = useState(50);
  const [soldButtonLeft, setSoldButtonLeft] = useState();
  const [hoverLineIndex, setHoverLineIndex] = useState();
  const soldButtonRef = useRef();
  const boughtButtonRef = useRef();
  const hoverContainerRef = useRef();
  const location = useLocation();
  const {
    buyIndex,
    sellIndex,
    setBuyIndex,
    setSellIndex,
    data,
    currentMode,
    chartGridValuesAndData,
    setBuyData,
    setSellData,
    setBuyDate,
    setSellDate,
    buyDate,
    buyDateDisplay,
    setBuyDateDisplay,
    setSellDateDisplay,
  } = useChartDataStore();
  const gridLeftPositions = chartGridValuesAndData?.map(
    (grid) => grid.xPosition
  );
  const isHoverLineDisplayedAndNotEqualBoughtOrSoldValue =
    isHovered && hoverLineIndex !== buyIndex && hoverLineIndex !== sellIndex;
  const dataArray = [...chartGridValuesAndData];
  const initialSellIndex = gridLeftPositions.length - 1;
  const fullDateLabels = useMemo(() => {
    if (!data?.values) return [];
    return data.values
      .map((item) => formatToLongDateTime(item.datetime))
      .reverse();
  }, [data?.values]);
  const purchaseTime = fullDateLabels[buyIndex];
  const purchaseValue = dataArray[buyIndex].value;
  const sellTime = fullDateLabels[sellIndex];
  const sellValue = dataArray[sellIndex]?.value;
  const hoverLineTime = fullDateLabels[hoverLineIndex];
  const hoverLinevalue = dataArray[hoverLineIndex]?.value;
  const hoverLinePosition = gridLeftPositions[hoverLineIndex];
  const leftPositionForHoverLabel =
    0 - document.getElementById("hoverLabel")?.offsetWidth / 2;
  useEffect(() => {
    setBuyData(buyIndex);
    setSellData(sellIndex);
  }, [sellIndex, buyIndex, currentMode, location]);
  useEffect(() => {
    const linesOverlay = document.getElementById("linesOverlay");
    const dataValues = [...data?.values].reverse();
    if (linesOverlay) {
      const buyDateDisplayToBeSet = new Date(dataValues[buyIndex]?.datetime);
      const sellDateDisplayToBeSet = new Date(
        dataValues[initialSellIndex]?.datetime
      );
      setBuyDateDisplay(buyDateDisplayToBeSet);
      setSellDateDisplay(sellDateDisplayToBeSet);
    }
  }, []);
  useEffect(() => {
    // Call the adjustSellIndex function when the component mounts or when gridLeftPositions or sellIndex changes
    const chart = document.getElementById("chartContainer");
    const boughtButton = document.getElementById("bought");
    const linesOverLay = document.getElementById("linesOverlay");

    if (boughtButton) {
      const chartTop = chart.getBoundingClientRect().top;
      const boughtTop = boughtButton.getBoundingClientRect().top;
      const lineHeightValue = boughtTop - chartTop;

      setLineHeight(lineHeightValue);
    }
    if (linesOverLay) {
      const maximumLeftDistance = linesOverLay.getBoundingClientRect().left;
      setMaxLeftDistance(maximumLeftDistance);
      const soldButtonHalfWidth =
        document.getElementById("sold")?.offsetWidth / 2;
      const purchaseButtonHalfWidth =
        document.getElementById("bought")?.offsetWidth / 2;
      setBoughtButtonLeft(
        gridLeftPositions[buyIndex] - purchaseButtonHalfWidth
      );
      setSoldButtonLeft(
        gridLeftPositions[initialSellIndex] - soldButtonHalfWidth
      );
    }
    setSellIndex(initialSellIndex);
    setIsHovered(false);
  }, [chartGridValuesAndData]);
  const handleHoverLineMouseMove = (e: any) => {
    if (e.target === hoverContainerRef.current) {
      setIsHovered(true);
    }
    const containerLeft = e.currentTarget.getBoundingClientRect().left;
    const distance = e.clientX - containerLeft;
    const nearestIndex = findNearestPointIndex(distance, gridLeftPositions);
    setHoverLineIndex(nearestIndex);
    setCursorPosition({ x: distance, y: e.clientY });
  };

  const handleHoverLineMouseLeave = () => {
    setIsHovered(false);
  };
  const handleMouseDown = (e: any) => {
    e.stopPropagation();
    setIsMouseDown(true);
    setIsHovered(false);
    setInitialMouseX(e.clientX);
    setInitialDivX(e.currentTarget.offsetLeft);
    e.currentTarget.style.cursor = "grabbing";
  };

  const [prevX, setPrevX] = useState(0);

  const handleMouseLeave = (e: any) => {
    setIsMouseDown(false);
    setInitialMouseX(e.clientX);
    setInitialDivX(e.currentTarget.offsetLeft);
    e.currentTarget.style.cursor = "grab";
    const id = e.target.id;
    const targetMidPoint = getMidPointPosition(e, maxLeftDistance);
    const nearestIndex = findNearestPointIndex(
      targetMidPoint,
      gridLeftPositions
    );
    const halfWidth = document.getElementById(id).offsetWidth / 2;
    if (isMouseDown) {
      if (id === "sold") {
        setSoldButtonLeft(gridLeftPositions[nearestIndex] - halfWidth);
        setSellIndex(nearestIndex);
      }
      if (id === "bought") {
        setBuyIndex(nearestIndex);

        setBoughtButtonLeft(gridLeftPositions[nearestIndex] - halfWidth);
      }
    }

    setIsMouseDown(false);
  };
  const handleMouseEnter = (e: any) => {
    e.stopPropagation();

    e.currentTarget.style.cursor = "grab";
  };

  const handleMouseUp = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
    const id = e.target.id;
    const targetMidPoint = getMidPointPosition(e, maxLeftDistance);
    const nearestIndex = findNearestPointIndex(
      targetMidPoint,
      gridLeftPositions
    );
    const halfWidth = document.getElementById(id).offsetWidth / 2;
    const redirectedData = [...data?.values].reverse();
    
    // Calculate distance between sold and bought buttons
    const distanceBetweenButtons = Math.abs(
      boughtButtonLeft - soldButtonLeft
    );
  
    // Prevent dragging to the same position
    if (distanceBetweenButtons < 5) {
      setIsMouseDown(false);
      e.currentTarget.style.cursor = "grab";
      return;
    }
  
    if (id === "sold") {
      setSellIndex(nearestIndex);
      setSoldButtonLeft(gridLeftPositions[nearestIndex] - halfWidth);
  
      const formattedSellDate = new Date(
        redirectedData[nearestIndex]?.datetime
      );
      setSellDateDisplay(formattedSellDate);
    }
    if (id === "bought") {
      setBuyIndex(nearestIndex);
      setBoughtButtonLeft(gridLeftPositions[nearestIndex] - halfWidth);
      const formattedBuyDate = new Date(redirectedData[nearestIndex]?.datetime);
      setBuyDateDisplay(formattedBuyDate);
    }
  
    setIsMouseDown(false);
    e.currentTarget.style.cursor = "grab";
  };
  const handleMouseMove = (e: any) => {
    if (!isMouseDown) return;
    e.stopPropagation();
    const id = e.target.id;
    const currentX = e.clientX;
  
    let direction = "";
    const boughtButtonDistance = document
      ?.getElementById("bought")
      ?.getBoundingClientRect().left;
    const soldButtonDistance = document
      ?.getElementById("sold")
      ?.getBoundingClientRect().left;
  
    const button = document.getElementById(id);
    const buttonLeftdistance = button?.getBoundingClientRect().left;
    const distanceBetweenButtons = Math.abs(
      soldButtonDistance - boughtButtonDistance
    );
  
    // Prevent dragging to the same position
    if (distanceBetweenButtons < 5) {
      return;
    }
  
    if (currentX > prevX) {
      direction = "right";
    } else if (currentX <= prevX) {
      direction = "left";
    }
    if (maxLeftDistance > buttonLeftdistance && direction === "left") {
      setPrevX(currentX);
      return;
    }
  
    if (isMouseDown) {
      const deltaX = e.clientX - initialMouseX;
      const leftPositionOfCurrentElement = initialDivX + deltaX;
      if (id === "sold") {
        setSoldButtonLeft(leftPositionOfCurrentElement);
      }
      if (id === "bought") {
        setBoughtButtonLeft(leftPositionOfCurrentElement);
      }
    }
    setPrevX(currentX);
  };
  
  const handleHoverLineMouseEnter = () => {
    // setIsHovered(true);
  };
  return (
    <div
      className={`${style.container} `}
      style={orientations}
      onMouseEnter={handleHoverLineMouseEnter}
      onMouseMove={handleHoverLineMouseMove}
      onMouseLeave={handleHoverLineMouseLeave}
      id="linesOverlay"
      ref={hoverContainerRef}
    >
      <div
        ref={boughtButtonRef}
        className={`${style.boughtButton} removeOnMobileView `}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        id="bought"
        style={{ left: `${boughtButtonLeft}px` }}
      > 
        <div
          className={style.boughtButtonGrabber}
          style={{ pointerEvents: "none" }}
        >
          <img src={moveIcon} alt="move icon" />
          Bought
          {lineHeight && (
            <div
              className={style.boughtLine}
              style={{
                height: lineHeight - 25,
                transform: `translateY(${-lineHeight}px)`,
              }}
            >
              <div className={style.label}>
                <p> Purchased on: {purchaseTime}</p>{" "}
                <p> Purchase price: ${purchaseValue}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        ref={soldButtonRef}
        className={`${style.soldButton} removeOnMobileView`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        id="sold"
        style={{ left: `${soldButtonLeft}px` }}
      >
        <div
          className={style.soldButtonGrabber}
          style={{ pointerEvents: "none" }}
        >
          <img src={moveIcon} alt="move icon" />
          Sold
          {lineHeight && (
            <div
              className={`${style.soldLine} removeOnMobileView`}
              style={{
                height: lineHeight - 25,
                transform: `translateY(${-lineHeight}px)`,
              }}
            >
              <div className={style.label}>
                <p> Sold on: {sellTime}</p> <p> Sold price: ${sellValue}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {isHoverLineDisplayedAndNotEqualBoughtOrSoldValue && (
        <div
          className={`${style.hoverLine} removeOnMobileView`}
          style={{ left: hoverLinePosition }}
        >
          <div
            className={`${style.hoverLabel} removeOnMobileView`}
            id="hoverLabel"
            style={{ left: leftPositionForHoverLabel }}
          >
            <p> Date: {hoverLineTime}</p> <p> Price: ${hoverLinevalue}</p>
          </div>
        </div>
      )}

      <div
        className={`${style.touchLine} removeOnMobileView`}
        style={{ left: hoverLinePosition }}
      >
        {" "}
        <div
          className={`${style.touchLabel} displayOnMobileView`}
          id="hoverLabel"
          style={{ left: leftPositionForHoverLabel }}
          // onTouchStart={handleTouchDown}
          // onTouchMove={handleTouchMove}
        >
          <p> Date: {hoverLineTime}</p> <p> Price: ${hoverLinevalue}</p>
        </div>
      </div>
    </div>
  );
};

export default LinesOverlay;
