import { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import PropTypes from "prop-types";

Chart.register(ArcElement, Tooltip, Legend);

export default function FishAnalytics({ detections = [] }) {
  useEffect(() => {
    console.log("📊 Received detections:", detections);
  }, [detections]);

  // Early exit if detections not loaded or empty
  if (!Array.isArray(detections) || detections.length === 0) {
    return (
      <div className="mt-12 text-gray-500 text-center">
        No detection data available for analysis 🐟
      </div>
    );
  }

  // Count types
  const typeCount = {};
  detections.forEach((d) => {
    const resultText = d.result || "";
    const match = resultText.match(
      /(?:is|This is|It's|It is)?(?: a[n]?)?\s*([\w\s-]+)(?=\.|\n|,| and| which| that|$)/i
    );
    const type = match ? match[1].trim() : "Unknown";
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  const labels = Object.keys(typeCount);
  const values = Object.values(typeCount);

  if (labels.length === 0) {
    return (
      <div className="mt-12 text-gray-500 text-center">
        Could not extract fish types from detection results 🐠
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#ec4899",
          "#14b8a6",
          "#f43f5e",
          "#a855f7",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        📊 Fish Type Analytics
      </h2>
      <div className="max-w-lg mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

FishAnalytics.propTypes = {
  detections: PropTypes.array.isRequired,
};
