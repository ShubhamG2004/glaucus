import { useEffect, useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import PropTypes from "prop-types";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function FishAnalytics({ detections = [] }) {
  useEffect(() => {
    console.log("📊 Received detections:", detections);
  }, [detections]);

  // Process detection data
  const { typeCount, userStats, timeStats } = useMemo(() => {
    const typeCount = {};
    const userStats = {};
    const timeStats = {
      morning: 0, // 6am-12pm
      afternoon: 0, // 12pm-6pm
      evening: 0, // 6pm-12am
      night: 0, // 12am-6am
    };

    detections.forEach((d) => {
      // Extract fish type
      const resultText = d.result || "";
      const match = resultText.match(
        /(?:is|This is|It's|It is)?(?: a[n]?)?\s*([\w\s-]+)(?=\.|\n|,| and| which| that|$)/i
      );
      const type = match ? match[1].trim() : "Unknown";
      typeCount[type] = (typeCount[type] || 0) + 1;

      // Count by user
      const user = d.userEmail || "anonymous";
      userStats[user] = (userStats[user] || 0) + 1;

      // Count by time of day
      if (d.timestamp?.seconds) {
        const date = new Date(d.timestamp.seconds * 1000);
        const hours = date.getHours();
        
        if (hours >= 6 && hours < 12) timeStats.morning++;
        else if (hours >= 12 && hours < 18) timeStats.afternoon++;
        else if (hours >= 18 && hours < 24) timeStats.evening++;
        else timeStats.night++;
      }
    });

    return { typeCount, userStats, timeStats };
  }, [detections]);

  // Early exit if no data
  if (!Array.isArray(detections) || detections.length === 0) {
    return (
      <div className="mt-12 text-gray-500 text-center">
        No detection data available for analysis 🐟
      </div>
    );
  }

  // Prepare chart data
  const typeLabels = Object.keys(typeCount);
  const typeValues = Object.values(typeCount);

  const userLabels = Object.keys(userStats);
  const userValues = Object.values(userStats);

  const timeLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const timeValues = Object.values(timeStats);

  if (typeLabels.length === 0) {
    return (
      <div className="mt-12 text-gray-500 text-center">
        Could not extract fish types from detection results 🐠
      </div>
    );
  }

  // Color palette
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#14b8a6', '#f43f5e', '#a855f7', '#84cc16'
  ];

  // Charts configuration
  const typeChartData = {
    labels: typeLabels,
    datasets: [{
      data: typeValues,
      backgroundColor: colors.slice(0, typeLabels.length),
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const userChartData = {
    labels: userLabels,
    datasets: [{
      label: 'Detections by User',
      data: userValues,
      backgroundColor: '#3b82f6',
      borderColor: '#ffffff',
      borderWidth: 1,
    }],
  };

  const timeChartData = {
    labels: timeLabels,
    datasets: [{
      label: 'Detections by Time',
      data: timeValues,
      backgroundColor: '#10b981',
      borderColor: '#ffffff',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: { size: 14 },
          padding: 20,
        },
      },
    },
  };

  // Statistics
  const totalDetections = detections.length;
  const uniqueFishTypes = typeLabels.length;
  const mostCommonFish = typeLabels.reduce((a, b) => typeCount[a] > typeCount[b] ? a : b);
  const mostActiveUser = userLabels.reduce((a, b) => userStats[a] > userStats[b] ? a : b);
  const mostActiveTime = timeLabels[timeValues.indexOf(Math.max(...timeValues))];

  return (
    <div className="mt-8 space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🐠 Fish Detection Analytics</h2>
        <p className="text-gray-600">Comprehensive analysis of your fish identification data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Detections" 
          value={totalDetections} 
          icon="📊" 
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          title="Unique Fish Types" 
          value={uniqueFishTypes} 
          icon="🐟" 
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          title="Most Common Fish" 
          value={mostCommonFish} 
          icon="🏆" 
          color="bg-amber-100 text-amber-600"
        />
        <StatCard 
          title="Most Active Time" 
          value={mostActiveTime} 
          icon="⏰" 
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Fish Type Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Fish Type Distribution</h3>
        <div className="h-96">
          <Pie data={typeChartData} options={chartOptions} />
        </div>
      </div>

      {/* User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Detections by User</h3>
          <div className="h-64">
            <Bar 
              data={userChartData} 
              options={{
                ...chartOptions,
                indexAxis: 'y',
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Detections by Time of Day</h3>
          <div className="h-64">
            <Bar 
              data={timeChartData} 
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Raw Data Table (collapsible) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <details>
          <summary className="text-lg font-semibold cursor-pointer text-gray-800">
            View Raw Detection Data ({detections.length} records)
          </summary>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fish Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detections.map((detection, index) => {
                  const typeMatch = (detection.result || "").match(
                    /(?:is|This is|It's|It is)?(?: a[n]?)?\s*([\w\s-]+)(?=\.|\n|,| and| which| that|$)/i
                  );
                  const type = typeMatch ? typeMatch[1].trim() : "Unknown";
                  const date = detection.timestamp?.seconds 
                    ? new Date(detection.timestamp.seconds * 1000).toLocaleString()
                    : "Unknown";

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {detection.userEmail || "anonymous"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}

// StatCard component for displaying summary statistics
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${color.split(' ')[0]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

FishAnalytics.propTypes = {
  detections: PropTypes.array.isRequired,
};