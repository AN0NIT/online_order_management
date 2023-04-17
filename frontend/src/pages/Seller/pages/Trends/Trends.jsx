import React from "react";
import ReactDOM from "react-dom";
import Script from "react-load-script";

export default function Trends({ type, keyword, time, geo}) {
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
    return <Script url="https://ssl.gstatic.com/trends_nrtr/3316_RC01/embed_loader.js" onLoad={handleScriptLoad} />;
}
