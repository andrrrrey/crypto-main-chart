import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Plugin,
} from "chart.js";
import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
} from "react";
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import style from "./index.module.scss";
import LinesOverlay from "../../LinesOverlay/LinesOverlay";
import useChartDataStore from "../../../store/useChartDataStore";
import formatDate from "../../../utils/formateDate";
import replaceLargestDifferentUnit from "../../../utils/formateDateForLabels";
import type { ChartOptions } from "chart.js";
import encodeDates from "../../../utils/formateDateTest";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.module.scss"
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  annotationPlugin
);

const options: ChartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  legend: {
    display: false,
  },
  hover: {
    mode: "nearest",
    intersect: true,
  },
  elements: {
    line: {
      tension: 0,
    },
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "white",
        align: "inner",
        // maxRotation: 0, // No rotation
        // minRotation: 80, // No rotation
        maxTicksLimit: 10,
        autoSkip: true,
      },
      grid: {
        display: false,
      },

      alignToPixels: true,
    },
    y: {
      ticks: {
        color: "white",
        align: "inner",
      },
      grid: {
        display: false,
      },
      position: "right",
    },
  },
  layout: {
    padding: {
      top: 0,
    },
  },
  backgroundColor: "red",
  plugins: {
    legend: {
      display: false,
    },
  },
};

export default function ChartGraph() {
  const [coordinates, setCoordinates] = useState(null);
  const [linesLoading, setLinesLoading] = useState(true);
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const chartRef = useRef(null);
  const {
    loading,
    setChartGridValuesAndData,
    timeSeries,
    data,
    chartGridValuesAndData,
    chartError,
    errorPopup,
  } = useChartDataStore();
  
  // Show toast if errorPopup is present


  // Handle toast close
  const handleToastClose = () => {
    setShowToast(false); // Close the toast
  };

  const ToDrawlabels = useMemo(() => {
    return (
      data?.values
        ?.map((item) => {
          if (timeSeries === "1day")
            return `${new Date(item.datetime).getHours()}:${new Date(
              item.datetime
            ).getMinutes()}`;
          return formatDate(new Date(item.datetime));
        })
        .reverse()
    );
  }, [data?.values, timeSeries]);

  const toDrawValues = useMemo(() => {
    return data?.values?.map((item) => item.open).reverse();
  }, [data?.values]);

  const chartData = useMemo(() => {
    return {
      labels: ToDrawlabels,
      datasets: [
        {
          fill: true,
          label: null,
          data: toDrawValues,
          borderColor: "#07ec90",
          borderWidth: 2,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(
              0,
              0,
              0,
              context.chart.height
            );

            gradient.addColorStop(0, "#07ec90");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
            return gradient;
          },
        },
      ],
    };
  }, [ToDrawlabels, toDrawValues]);

  const afterDrawPlugin: Plugin = {
    afterRender: (chart) => {
      if (chart instanceof Chart) {
        const datasets = chart.data.datasets;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        const coordinatesToBeSet = [];
        datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach((element, index) => {
              const xLabel = xScale.getLabelForValue(index);
              const yLabel = yScale.getLabelForValue(dataset.data[index]);
              const xPosition =
                xScale.getPixelForValue(index) - xScale.left; // Adjusting to start from the start of the chart area
              coordinatesToBeSet.push({
                label: xLabel,
                value: yLabel,
                xPosition,
              });
            });
          }
        });
        setCoordinates(chart.chartArea);
        setLinesLoading(false);
        setChartGridValuesAndData(coordinatesToBeSet);
      }
    },
  };

  const beforeDrawPlugin: Plugin = {
    beforeRender: () => {
      setLinesLoading(true);
    },
  };

  return (
    <div className={style.chartRow} id="chartContainer">
      {data && !loading && !chartError && (
        <Line
          options={options}
          data={chartData}
          width={"100%"}
          ref={chartRef}
          plugins={[afterDrawPlugin, beforeDrawPlugin]}
        />
      )}

      {coordinates && !linesLoading && !loading && !chartError && (
        <LinesOverlay orientations={coordinates} />
      )}

      {!!chartError && (
        <div className={style.errorMessageContainer}>
          Error in loading Data, Try changing the time frame!
        </div>
      )}

      {/* Show toast only when showToast state is true */}
      
    </div>
  );
}
