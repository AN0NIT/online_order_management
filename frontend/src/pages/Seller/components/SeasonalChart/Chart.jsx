import "./chart.css";
import React, { useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useContext } from "react";
import BackendContext from "context/BackendContext";

export default function SeasonalChart({ grid }) {

  const [data, setData] = React.useState({})
  const { API_SERVER_URL } = useContext(BackendContext)

  useEffect(() => {
    axios.post(`${API_SERVER_URL}/product/category/stock/recommendation/allyear`)
      .then((res) => {
        if (res.status == 200)
          setData(JSON.parse(res.data))
      })
  }, [])

  return (
    <div className="chart">
      <h3 className="chartTitle">Seasonal Demand</h3>
      <ResponsiveContainer width="100%" aspect={4 / 1}>
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#5550bd" />
          <Line type="monotone" dataKey="Clothing" stroke="#a12b3d" />
          <Line type="monotone" dataKey="Furniture" stroke="#2662b5" />
          <Line type="monotone" dataKey="Electronic" stroke="#1c661b" />
          <Tooltip />
          {grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
