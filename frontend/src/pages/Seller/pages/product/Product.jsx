import { Link } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart"
import { productData } from "../../dummyData"
import { Publish, RssFeed } from "@material-ui/icons";
import Sidebar from "pages/Seller/components/sidebar/Sidebar";
import { useContext, useEffect } from "react";
import BackendContext from "context/BackendContext";
import axios from "axios";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function Product(props) {
    const location = useLocation();
    const params = location.state;
    console.log("state:"+params.id)
    // const { productId } = useParams();
    // const params = location.state;
    // const { API_SERVER_URL, COOKIE_USER_INFO } = useContext(BackendContext)
    // alert("product name:"+data[productId].name)
    // const location = useLocation();
    // pid ,pname, pquantity, pstatus, pprice
    // const { pid, pname, pquantity, pstatus, pprice } = location.state;
    // alert("productId "+pid)
    return (
        <div className="product md:m-auto md:w-2/3">
            <div className="productTitleContainer">
                <h1 className="productTitle">Product</h1>
                <Link to="/seller/newproduct">
                    <button className="productAddButton">Create</button>
                </Link>
            </div>
            <div className="productTop">
                <div className="productTopLeft">
                    <Chart data={productData} dataKey="Sales" title="Sales Performance" />
                </div>
                <div className="productTopRight">
                    <div className="productInfoTop">
                        {/* <img src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="productInfoImg" /> */}
                        <img src={`http://localhost:8000/${params.img}`} alt="" className="productInfoImg" />
                        <span className="productName">{params.name}</span>
                    </div>
                    <div className="productInfoBottom">
                        <div className="productInfoItem">
                            <span className="productInfoKey">ID:</span>
                            <span className="productInfoValue">{params.id}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Price:</span>
                            <span className="productInfoValue">{params.price}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">Stock:</span>
                            <span className="productInfoValue">{params.stock}</span>
                        </div>
                        <div className="productInfoItem">
                            <span className="productInfoKey">In stock:</span>
                            <span className="productInfoValue">{params.status}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="productBottom">
                <form className="productForm">
                    <div className="productFormLeft">
                        <label>Product Name</label>
                        <input type="text" placeholder={params.name} />
                        <label>Price</label>
                        <input type="text" placeholder={params.price} />
                        <label>Stock</label>
                        <input type="text" placeholder={params.stockw} />
                        <label>Active</label>
                        <select name="active" id="active" placeholder={params.status}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src={`http://localhost:8000/${params.img}`} alt="" className="productUploadImg" />
                            <label for="file">
                                <Publish />
                            </label>
                            <input type="file" id="file" style={{ display: "none" }} />
                        </div>
                        <button className="productButton">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
