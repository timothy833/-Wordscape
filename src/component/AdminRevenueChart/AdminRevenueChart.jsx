import  { useEffect } from "react";
import c3 from "c3";
import "c3/c3.css";
import PropTypes from "prop-types";

const AdminRevenueChart = ({ revenueData }) => {
  useEffect(() => {
    c3.generate({
      bindto: "#revenue-chart",
      data: {
        columns: [
          ["營收", ...revenueData],
        ],
        type: "bar",
        names: {
          營收: "", // 不顯示圖例名稱
        },
        colors: {
          營收: (d) => (d.index % 2 === 0 ? "#E77605" : "#FB9A39"),
          // 單數月 & 雙數月不同顏色
        },
      },
      axis: {
        x: {
          type: "category",
          categories: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
          tick: {
            outer: false, // 移除 X 軸外框
          },
        },
        y: {
          // tick: {
          //   format: (d) => d === 0 ? "0" : d / 1000 + "K", // 
          //   // 0 顯示 `0`，其他數字顯示 10K, 20K
          //   values: [0, 10000, 20000, 30000, 40000, 50000], // 10K 間隔
          //   outer: false, // 移除Y 軸外框
          // },
          min: 0, // 確保 Y 軸從 0 開始
          max: Math.max(...revenueData) * 1.2 || 50000, // 自動設定最大值，確保不會太大
          padding: { top: 0, bottom: 0 }, // 取消多餘的 padding
        },
      },
      grid: {
        x: { show: false }, // 隱藏 X 軸格線
        y: { show: false }, // 隱藏 Y 軸格線
      },
      bar: {
        width: { ratio: 0.5 }, // 整柱狀圖寬度
      },
      size: {
        height: 280, // 設定圖表高度
      },
      legend: {
        show: false, // 隱藏圖例
      },
    });
  }, [revenueData]);

  return (
    <div className="chart-container">
      <div id="revenue-chart"></div>
    </div>
  );
};

AdminRevenueChart.propTypes = {
  revenueData: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default AdminRevenueChart;
