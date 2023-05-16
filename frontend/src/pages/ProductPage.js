import { autocompleteClasses } from "@mui/material"
import { useEffect, useContext, useState } from "react"
import axios from "axios"
import phoneimg from "../assets/phone.jpg"
// const SERVER_URL = 'http://127.0.0.1:8000'
// const SERVER_URL = 'http://ec2-34-209-215-94.us-west-2.compute.amazonaws.com:8000'
// const API_SERVER_URL = `${SERVER_URL}/api`
import BackendContext from "context/BackendContext";


export default function ProductPage() {
    const { API_SERVER_URL, MEDIA_SERVER_URL, COOKIE_USER_INFO, add_to_cart } = useContext(BackendContext)
    const [isBasePage, setBasePage] = useState(true)
    const [Products, setProducts] = useState([])
    const [Data, setData] = useState([])
    const [category, setcategory] = useState('')
    const loadData = async () => {
        let tmp = []
        await axios.get(`${API_SERVER_URL}/product/allproducts/`)
            .then((res) => {
                if (res.status == 200) {
                    setProducts(res.data)
                    // convert product to data format accecpted by this template
                    const stuff = res.data.data;
                    for (let i = 0; i < stuff.length; i++) {
                        const product = stuff[i]
                        if (product.status == 1) {
                            tmp.push({
                                id: i,
                                pid: product.id,
                                name: product.name,
                                img: product.image,
                                stock: product.quantity,
                                category: product.category === 1 ? 'Electronics' : product.category === 2 ? 'Furniture' : 'Clothing',
                                status: product.status == 1 ? "active" : "inactive",
                                price: product.price,
                            })
                        }
                    }
                    setData(tmp)
                }
            })
    }

    const addProduct = async (item) => {
        await add_to_cart(item.pid, 1);
    }
    useEffect(() => {
        loadData()
    }, [])



    return (
        <div>
            <div style={{ marginLeft: "5%", marginBottom: "2%", paddingLeft: "50px" }}>
                <select value={category} onChange={(e) => { setcategory(e.target.value) }}>
                    <option value=''>Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "25px", flexWrap: "wrap", padding: "50px" }}>
                {/* {Data.map((item) => {
                                return (
                                    <div class="flex mb-3" style={{ listStyle: 'none', alignItems: "center", padding: "1%", backgroundColor: "lightgray", border: "1px solid gray", width: "90%" }}>
                                        <img src={`${MEDIA_SERVER_URL}${item.img}`} height="100px" width="100px"></img>
                                        <div style={{ marginLeft: "2%" }}>
                                            <li><b>{item.name}</b></li>
                                            <li>Rs {item.price}</li>
                                            <li>{item.category}</li>

                                        </div>
                                    </div>
                                )
                })} */}
                {/* --- */}
                <div className="mx-auto py-8 px-4 sm:px-6 w-full max-w-7xl bg-white">
                    <div className="mx-auto max-w-xs sm:max-w-2xl lg:max-w-none">
                        {/* :CATEGORY TITLE */}
                        <h2 className="text-2xl text-gray-700 font-bold">Deals of the Day</h2>
                        < div className="mt-6" >
                            <ul className="grid grid-cols-4 gap-10">
                                {category === '' ? Data.map((item,) => {
                                    return (
                                        <li key={item.id} className="col-span-full sm:col-span-2 lg:col-span-1 group shadow rounded border border-gray-200 hover:shadow-md">
                                            <a href="" className="flex flex-col">
                                                {/* ::Picture Container */}
                                                <div className="relative">
                                                    {/* :::picture */}
                                                    <div className="aspect-w-1 aspect-h-1 w-full sm:h-full overflow-hidden filter group-hover:brightness-110">
                                                        <img src={`${MEDIA_SERVER_URL}${item.img}`} alt="ProductImage" className="w-full h-full object-cover object-center" />
                                                    </div>
                                                    {/* :::discount */}
                                                    {
                                                        <span className="absolute top-3 -left-1 py-1 pl-2 pr-4 inline bg-red-500 text-xs text-white font-bold tracking-wide" style={{ clipPath: "polygon(0 0, 100% 0%, 85% 100%, 0% 100%)" }}>{`30% OFF`}</span>
                                                    }
                                                </div>
                                                {/* ::Product Details */}
                                                <div className="pt-2 pb-4 border-t-2 border-gray-100 flex flex-col items-center space-y-2 text-center">
                                                    {/* :::title */}
                                                    <h3 className="w-2/3 text-base text-gray-700 font-bold whitespace-nowrap truncate">{item.name}</h3>
                                                    {/* :::container */}
                                                    <div className="flex justify-center items-center space-x-4">
                                                        {/* ::::price */}
                                                        <p className="text-lg text-gray-700 font-bold">{`₹${item.price}`}</p>
                                                        {/* ::::add to cart */}
                                                        <button className="text-gray-400 hover:text-blue-500">
                                                            <svg className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                <path d="M19.029 13h2.971l-.266 1h-2.992l.287-1zm.863-3h2.812l.296-1h-2.821l-.287 1zm-.576 2h4.387l.297-1h-4.396l-.288 1zm-11.816 6c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm8-16.5l-.743 2h-1.929l-3.474 12h-11.239l-4.615-11h14.812l-2.541 9h2.102l3.432-12h4.195z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                    )
                                })
                                    :
                                    Data.map((item) => {
                                        if (category === item.category)
                                            return (
                                                <>
                                                    <li key={item.id} className="col-span-full sm:col-span-2 lg:col-span-1 group shadow rounded border border-gray-200 hover:shadow-md">
                                                        <a href="" className="flex flex-col">
                                                            {/* ::Picture Container */}
                                                            <div className="relative">
                                                                {/* :::picture */}
                                                                <div className="aspect-w-1 aspect-h-1 w-full sm:h-full overflow-hidden filter group-hover:brightness-110">
                                                                    <img src={`${MEDIA_SERVER_URL}${item.img}`} alt="ProductImage" className="w-full h-full object-cover object-center" />
                                                                </div>
                                                                {/* :::discount */}
                                                                {
                                                                    <span className="absolute top-3 -left-1 py-1 pl-2 pr-4 inline bg-red-500 text-xs text-white font-bold tracking-wide" style={{ clipPath: "polygon(0 0, 100% 0%, 85% 100%, 0% 100%)" }}>{`30% OFF`}</span>
                                                                }
                                                            </div>
                                                            {/* ::Product Details */}
                                                            <div className="pt-2 pb-4 border-t-2 border-gray-100 flex flex-col items-center space-y-2 text-center">
                                                                {/* :::title */}
                                                                <h3 className="w-2/3 text-base text-gray-700 font-bold whitespace-nowrap truncate">{item.name}</h3>
                                                                {/* :::container */}
                                                                <div className="flex justify-center items-center space-x-4">
                                                                    {/* ::::price */}
                                                                    <p className="text-lg text-gray-700 font-bold">{`₹${item.price}`}</p>
                                                                    {/* ::::add to cart */}
                                                                    <button className="text-gray-400 hover:text-blue-500">
                                                                        <svg className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                            <path d="M19.029 13h2.971l-.266 1h-2.992l.287-1zm.863-3h2.812l.296-1h-2.821l-.287 1zm-.576 2h4.387l.297-1h-4.396l-.288 1zm-11.816 6c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm8-16.5l-.743 2h-1.929l-3.474 12h-11.239l-4.615-11h14.812l-2.541 9h2.102l3.432-12h4.195z" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                </>
                                            )
                                    })}
                                {/* ---- */}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}