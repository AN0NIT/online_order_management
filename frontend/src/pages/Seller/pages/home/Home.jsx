import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "pages/Seller/components/sidebar/Sidebar";
import SeasonalChart from "pages/Seller/components/SeasonalChart/Chart"
import { useContext, useEffect, useState } from "react";
import BackendContext from "context/BackendContext";
import { useNavigate } from "react-router-dom";
import Trends from "../Trends/Trends";

const About = () => {
  const type = "GEO_MAP";
  //const keyword = "electronics";
  const [keyword, setKeyword] = useState('electronics')
  const time = "now 1-d";
  const geo = "IN";
  const handleScriptLoad = () => {
    const property = "froogle";
    window.trends.embed.renderExploreWidgetTo(
      document.getElementById("widget"),
      type,
      {
        comparisonItem: [{ keyword:keyword, geo: geo, time: time}],
        category: 0,
        property: property
      },
      {
        //"date=now%201-d&geo=IN&gprop=froogle&q=electronics&hl=en-US"
        exploreQuery: `date=${time}&geo=${geo}&gprop=${property}&q=${encodeURI(keyword)}&hl=en-US`,
        guestPath: "https://trends.google.com:443/trends/embed/"
      }
    );
  };
  useEffect(() => {
    alert("trends "+keyword)
    document.getElementById("widget").innerHTML = "";
    handleScriptLoad();
  }, [keyword])
  

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
        <select value={keyword} onChange={(e) => { setKeyword(e.target.value) }}>
          <option value=''>Select A Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
        </select>
        <div id="widget">
          <Trends
            type={type}
            keyword={keyword}
            time={time}
            geo={geo}
            handleScriptLoad={handleScriptLoad}
          />
        </div>
      </div>
    </div>
      
    </div >
  );
}


export default function SellerDashboard() {

  const context = useContext(BackendContext)
  const { isSeller } = context
  // alert("Dashboard:" + isSeller)
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!isSeller) {
  //     alert("Unauthorized access")
  //     navigate("/product")
  //   }
  // }, [])

  return (
    <>
      {/* <Topbar /> */}
      <About />
    </>
  )

}