import React, {useEffect} from "react";
import Script from "react-load-script";

export default function Trends({ type, keyword, time, geo, handleScriptLoad}) {
    return <Script url="https://ssl.gstatic.com/trends_nrtr/3316_RC01/embed_loader.js" onLoad={handleScriptLoad} />;
}
