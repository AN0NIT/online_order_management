import { autocompleteClasses } from "@mui/material"
import { useEffect, useContext, useState } from "react"
import { Disclosure } from "@headlessui/react"
import { ChevronRightIcon, LoginIcon, MinusIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid"
import axios from "axios"
import phoneimg from "../assets/phone.jpg"
// const SERVER_URL = 'http://127.0.0.1:8000'
// const SERVER_URL = 'http://ec2-34-209-215-94.us-west-2.compute.amazonaws.com:8000'
// const API_SERVER_URL = `${SERVER_URL}/api`
import BackendContext from "context/BackendContext";


export default function ProductPage() {
    const { API_SERVER_URL, MEDIA_SERVER_URL, COOKIE_USER_INFO, add_to_cart, categories, allProducts } = useContext(BackendContext)
    const [category, setcategory] = useState([])
    const [catLength, setCatLength] = useState([])
    // const loadData = async () => {
    //     let tmp = []
    //     await axios.get(`${API_SERVER_URL}/product/allproducts/`)
    //         .then((res) => {
    //             if (res.status == 200) {
    //                 setProducts(res.data)
    //                 // convert product to data format accecpted by this template
    //                 const stuff = res.data.data;
    //                 for (let i = 0; i < stuff.length; i++) {
    //                     const product = stuff[i]
    //                     if (product.status == 1) {
    //                         tmp.push({
    //                             id: i,
    //                             pid: product.id,
    //                             name: product.name,
    //                             img: product.image,
    //                             stock: product.quantity,
    //                             category: product.category === 1 ? 'Electronic' : product.category === 2 ? 'Furniture' : 'Clothing',
    //                             status: product.status == 1 ? "active" : "inactive",
    //                             price: product.price,
    //                         })
    //                     }
    //                 }
    //                 setData(tmp)
    //             }
    //         })
    // }

    const handleCheckBox = (e) => {
        e.preventDefault();
        // console.log('inside hanldeCheckbox:', e.target.value, e.target.checked);
        // let tmp_val = category;
        // if(e.target.checked && !tmp_val.includes(e.target.value))
        //     tmp_val.push(e.target.value)
        // else
        //     tmp_val.splice(e.target.value, 0)
        // console.log('after change:',tmp_val)
        // setcategory(tmp_val)
        let checkboxes= document.querySelectorAll('input[name="productCheckBox"]:checked');
        console.log(checkboxes.value);
        let temp_check= []
        for (let i = 0; i < checkboxes.length; i++) {
            const element = checkboxes[i];
            temp_check.push(element.value)
        }
        console.log('temp_check:',temp_check);
        setcategory(temp_check)
    }


    const addProduct = async (item) => {
        await add_to_cart(item.pid, 1);
    }
    useEffect(() => {
        // loadData()
        console.log('categories:', categories)
        console.log(':::', catLength)
        console.log("allproducts:",allProducts)
        let temp_cat = categories;
        temp_cat.forEach((element, index) => {
            let len = 0;
            for (let i = 0; i < allProducts.length; i++) {
                const ele = allProducts[i];
                if (ele.category.toUpperCase() === element[1])
                    len += 1
            }
            // setCatLength(catLength[index].push(len))
            element.push(len)
            console.log('element:', element, len);
        });
        setCatLength(temp_cat)

    }, [categories,allProducts])

    const data = [
        { id: 1, href: "#link", value: "value1", label: "Category 1", quantity: "136", checked: false },
        { id: 2, href: "#link", value: "value2", label: "Category 2", quantity: "89", checked: false },
        { id: 3, href: "#link", value: "value3", label: "Category 3", quantity: "55", checked: false },
        { id: 4, href: "#link", value: "value4", label: "Category 4", quantity: "214", checked: false },
        { id: 5, href: "#link", value: "value5", label: "Category 5", quantity: "13", checked: false },
        { id: 6, href: "#link", value: "value6", label: "Category 6", quantity: "177", checked: false },
    ]
    console.log('catLength:', catLength)
    return (
        <div>
            <div style={{ marginLeft: "5%", marginBottom: "2%", paddingLeft: "50px" }}>
                {/* <select value={category} onChange={(e) => { setcategory(e.target.value) }}>
                    <option value=''>All</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                </select> */}

                {/* ::Filter 2 */}
                <div className="m-4 p-4 pt-0 w-full max-w-xs shadow rounded-md border border-gray-200 bg-white">
                    <Disclosure as="div" className="border-b border-gray-200">
                        {({ open }) => (
                            <div className="pt-3 pl-5 pb-2 pr-3 flex flex-col">
                                {/* :::Category name */}
                                <Disclosure.Button className="group flex items-center justify-between">
                                    <span className={`${open ? "text-indigo-400" : "text-gray-700"} text-lg font-bold font-oswald tracking-wider uppercase`}>Categories</span>
                                    {open ?
                                        <MinusIcon className="w-5 h-5 text-indigo-400 group-hover:text-gray-400" />
                                        : <PlusIcon className={`w-5 h-5 text-gray-400 group-hover:text-indigo-400`} />
                                    }
                                </Disclosure.Button>
                                {/* :::Filters */}
                                <Disclosure.Panel className="mt-2 mb-3 flex flex-col items-start ">
                                    {catLength.length > 0 && catLength.map(option => (
                                        <div className="flex">
                                            <input onChange={handleCheckBox} name="productCheckBox" type="checkbox" id={option[1]} defaultValue={option[1]} defaultChecked={option[3]} className="form-checkbox h-5 w-5 border-gray-300 rounded text-indigo-400 focus:ring-indigo-400" />
                                            <label htmlFor={option[1]} className={`ml-3 text-base ${option[3] ? "text-indigo-400" : "text-gray-700"} font-medium`} >{option[1]}</label>
                                            <span className="ml-1 text-sm text-gray-400 font-light">{`(${option[2]})`}</span>
                                        </div>
                                    ))
                                    }
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                </div>

                {/*--- */}
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
                                {category.length === 0 ? allProducts.map((item,) => {
                                    return (
                                        <li key={item.id} className="col-span-full sm:col-span-2 lg:col-span-1 group shadow rounded border border-gray-200 hover:shadow-md">
                                            <a href="" className="flex flex-col justify-between" style={{height:"100%"}}>
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
                                                        <button className="py-1.5 px-3 shadow-sm rounded bg-blue-500 text-xs text-white font-semibold uppercase tracking-wide hover:bg-blue-600" onClick={() => addProduct(item)}>Order</button>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>

                                    )
                                })
                                    :
                                    allProducts.map((item) => {
                                        if (category.includes(item.category.toUpperCase()))
                                            return (
                                                <>
                                                    <li key={item.id} className="col-span-full sm:col-span-2 lg:col-span-1 group shadow rounded border border-gray-200 hover:shadow-md">
                                                        <a href="" className="flex flex-col justify-between" style={{height:"100%"}}>
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
                                                                    <button className="py-1.5 px-3 shadow-sm rounded bg-blue-500 text-xs text-white font-semibold uppercase tracking-wide hover:bg-blue-600" onClick={() => addProduct(item)}>Order</button>
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