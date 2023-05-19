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
import { Switch } from '@headlessui/react'
import { ViewGridIcon, ViewListIcon } from "@heroicons/react/solid"

const About = () => {
  const type = "GEO_MAP";
  //const keyword = "electronics";
  const [keyword, setKeyword] = useState('Electronic')
  // const time = "now 1-d";
  const [time, setTime] = useState('now 1-d')
  // const geo = "IN";
  const [geo, setGeo] = useState('IN')
  const handleScriptLoad = () => {
    const property = "froogle";
    window.trends.embed.renderExploreWidgetTo(
      document.getElementById("widget"),
      type,
      {
        comparisonItem: [{ keyword: keyword, geo: geo, time: time }],
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
    // console.log("trends "+keyword)
    // console.log("geo "+geo)
    // console.log("time "+time)
    document.getElementById("widget").innerHTML = "";
    handleScriptLoad();
  }, [keyword, geo, time])


  return (
    <div className='md:flex md:justify-center md:align-center md:mx-4'>
      <div className='container'>
        <Sidebar />
        <div className="home">
          <FeaturedInfo />
          {/* <Chart data={userData} title="User Analytics" grid dataKey="Active User" /> */}
          <SeasonalChart grid />
          {/* <div className="homeWidgets">
          <WidgetSm/>
          <WidgetLg/>
          </div> */}

          <DropDown
            setGeo={setGeo}
            setKeyword={setKeyword}
            setTime={setTime}
          />
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



function DropDown({ setGeo, setTime, setKeyword }) {
  const { categories } = useContext(BackendContext)
  // console.log("cat:", categories)
  let tmp_cat = []

  function convertFullCapsToStartingCap(string) {
    const lowercaseString = string.toLowerCase();
    const words = lowercaseString.split(' ');
    const capitalizedWords = words.map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    const convertedString = capitalizedWords.join(' ');
    return convertedString;
  }

  categories.forEach((element, index) => {
    // console.log(index, ':', convertFullCapsToStartingCap(element[1]))
    tmp_cat.push({ value: convertFullCapsToStartingCap(element[1]), label: convertFullCapsToStartingCap(element[1]) })
  })
  // console.log('tmp_cat:', tmp_cat)
  const filters = [
    {
      id: 'keyword',
      name: 'Keyword',
      // options: [
      //   { value: 'Electronics', label: 'Electronics' },
      //   { value: 'Furniture', label: 'Furniture' },
      //   { value: 'Clothing', label: 'Clothing' },
      // ],
      options: tmp_cat,
    },
    {
      id: 'geo',
      name: 'Geo',
      options: [
        { value: '', label: 'World Wide' },
        { value: 'IN', label: 'India' },
        { value: 'US', label: 'United States' },
      ],
    },
    {
      id: 'time',
      name: 'Time',
      options: [
        { value: 'now 1-d', label: 'Past 1 day' },
        { value: 'now 7-d', label: 'Past 7 days' },
        { value: 'today 1-m', label: 'Past 1 month' },
        { value: 'today 12-m', label: 'Past 1 year' },
        { value: 'today 5-y', label: 'Past 5 years' },
      ],
    },
  ]

  const [gridView, setGridView] = useState(false)
  const [menCategory, setMenCategory] = useState(false)


  return (
    <div className="mx-auto py-3 px-4 w-full max-w-7xl bg-white">
      <div className="relative">
        {/* :FILTERS CONTAINER */}
        <div className="pb-1 sm:px-4 flex flex-col-reverse md:flex-row items-center justify-between">
          {/* ::Filter Select Input */}
          <div className="flex-shrink-0 mt-5 md:mt-0 max-w-sm sm:max-w-none w-full md:w-auto grid sm:grid-flow-col grid-cols-1 sm:auto-cols-fr gap-4">
            {filters.map(filter => (
              <div key={filter.id} className="col-span-1">
                <label htmlFor={filter.id} className="sr-only">{filter.name}</label>
                <select name={filter.id} id={filter.id} defaultValue={filter.name} onChange={(e) => {
                  if (e.target.name == 'geo')
                    setGeo(e.target.value)
                  else if (e.target.name == 'keyword')
                    setKeyword(e.target.value)
                  else if (e.target.name == 'time')
                    setTime(e.target.value)
                }}
                  className="form-select w-full rounded border border-gray-300 bg-gray-100 text-base text-gray-600 focus:border-rose-500 focus:ring-rose-500">
                  <option value="" className="font-semibold">{filter.name}</option>
                  {filter.options.map(option => (
                    <option value={option.value}>{option.label}</option>
                  ))
                  }
                </select>
              </div>
            ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SellerDashboard() {

  const context = useContext(BackendContext)
  const { isSeller, user } = context
  // alert("Dashboard:" + isSeller)
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!isSeller) {
  //     alert("Unauthorized access")
  //     navigate("/product")
  //   }
  // }, [user])
  useEffect(() => {
  }, [user])


  return (
    <>
      {/* <Topbar /> */}
      <About />
    </>
  )

}