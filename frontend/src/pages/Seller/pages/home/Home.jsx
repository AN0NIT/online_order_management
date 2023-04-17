import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "pages/Seller/components/sidebar/Sidebar";
import SeasonalChart from "pages/Seller/components/SeasonalChart/Chart"
import { useContext, useEffect } from "react";
import BackendContext from "context/BackendContext";
import { useNavigate } from "react-router-dom";
import Trends from "../Trends/Trends";
import TestTrends from "../Trends/TestTrends";

const About = () => {
  const type="GEO_MAP";
  const keyword = "electronics";
  const time = "now 1-d";
  const geo = "IN";
  return (
    <div className='md:flex md:justify-center md:align-center md:mx-4'>
      <div className='container'>
        <Sidebar />
        <div className="home">
          <FeaturedInfo />
          {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
          <SeasonalChart grid />
          {/* <Trends 
          type={type}
          keyword={keyword}
          time={time}
          /> */}
          {/* <div className="homeWidgets">
          <WidgetSm/>
          <WidgetLg/>
        </div> */}
          <TestTrends/>
          <div id="widget">
            <Trends 
            type={type}
            keyword={keyword}
            time={time}
            geo={geo}
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}


export default function SellerDashboard() {

  const context = useContext(BackendContext)
  const {isSeller} = context
  alert("Dashboard:"+isSeller)
  const navigate = useNavigate()
  useEffect(() => {
    if(!isSeller){
      alert("Unauthorized access")
      navigate("/product")
    }    
  }, [])
  
  return (
    <>
      {/* <Topbar /> */}
      <About />
    </>
  )

}