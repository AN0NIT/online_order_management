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
    console.log('params:',params)
    const [updateData, setUpdateData] = useState({name:params.name, price:params.price, quantity:params.stock, status:params.status == "active" ? 1 : 0});
    const [imageContent, setImageContent] = useState(null);
    const { edit_product, MEDIA_SERVER_URL } = useContext(BackendContext)
    

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setImageContent(file)
      };


    const handleChange = (e) => {
        e.preventDefault();
        setUpdateData({
            ...updateData,
            [e.target.name]:e.target.value
        })
    };

    const editProduct = async (e) => {
        e.preventDefault();
        console.log('edited data:',updateData)
        const formData = new FormData();
        formData.append('name', updateData.name)
        formData.append('price', updateData.price)
        formData.append('quantity', updateData.quantity)
        formData.append('status', updateData.status)
        formData.append('image', imageContent)
        await edit_product(formData, params.pid);
      }



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
                        <img src={`${MEDIA_SERVER_URL}${params.img}`} alt="" className="productInfoImg" />
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
                <form onSubmit={editProduct} className="productForm">
                    <div className="productFormLeft">
                        <label>Product Name</label>
                        <input type="text" name="name" onChange={handleChange} id="name" placeholder={params.name} />
                        <label>Price</label>
                        <input type="text" name="price" onChange={handleChange} id="price" placeholder={params.price} />
                        <label>Stock</label>
                        <input type="text" name="quantity" onChange={handleChange} id="quantity" placeholder={params.stock} />
                        <label>Active</label>
                        <select name="status" id="status" onChange={handleChange} placeholder={params.status}>
                            <option value={1}>Yes</option>
                            <option value={0}>No</option>
                        </select>
                    </div>
                    <div className="productFormRight">
                        <div className="productUpload">
                            <img src={`${MEDIA_SERVER_URL}${params.img}`} alt="" className="productUploadImg" />
                            <label for="file">
                                <Publish />
                            </label>
                            <input type="file" name="image" id="file" onChange={handleImageChange} style={{ display: "none" }} />
                        </div>
                        <button className="productButton" type="submit">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
