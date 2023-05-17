import { Link } from "react-router-dom";
import "./order.css";
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
  // console.log('params:', params)
  const { user,edit_product, MEDIA_SERVER_URL, API_SERVER_URL } = useContext(BackendContext)
  const [buyerDetails, setBuyerDetails] = useState([])
  // const initialCondition = true
  const initialCondition = params.quantity > params.availablestock
  const [condition, setCondition] = useState(initialCondition);

  if (condition) {
    alert('PRODUCT_IS_OUT_OF_STOCK')
  }

  const handleClick = () => {
    console.log("inside handleClick")
    if (condition) {
      console.log('PRODUCT_IS_OUT_OF_STOCK');
    } else {
      // Handle the button click logic here
      console.log("Selling")
      axios.post(`${API_SERVER_URL}/addtocart/sell/`,{
        'seller_id': user.id,
        'order_id':params.id
      })
      .then((res) => {
        if (res.status = 200){
          console.log(res)
          setTimeout(() => {
            console.log('calling timeout')
            // setCartDetails(smpar)
        }, 500);
        }
        else
          alert("handle delete error")
      })
      .catch(error => console.log(error));
    }
  };


  useEffect(() => {
    fetch(`${API_SERVER_URL}/user/get_user/${params.buyer_id}`)
      .then(response => response.json())
      .then(data => setBuyerDetails(data))
      .catch(error => console.log(error));
  }, []);

  // const handleImageChange = (e) => {
  //   e.preventDefault();
  //   const file = e.target.files[0];
  //   setImageContent(file)
  // };


  // const handleChange = (e) => {
  //   e.preventDefault();
  //   setUpdateData({
  //     ...updateData,
  //     [e.target.name]: e.target.value
  //   })
  // };

  // const editProduct = async (e) => {
  //   e.preventDefault();
  //   console.log('edited data:', updateData)
  //   const formData = new FormData();
  //   formData.append('name', updateData.name)
  //   formData.append('price', updateData.price)
  //   formData.append('quantity', updateData.quantity)
  //   formData.append('status', updateData.status)
  //   formData.append('image', imageContent)
  //   await edit_product(formData, params.pid);
  // }


  console.log('buyerdetails:', buyerDetails)
  return (
    <div className="product md:m-auto md:w-2/3">
      <div className="productTitleContainer">
        <h1 className="productTitle">Order</h1>
        <div>
          {condition ? (
            <button className="productAddButton">
              Sell
            </button>
          ) : (
            <Link to="/seller/orders/">
              <button className="productAddButton" onClick={() => handleClick()}>
                Sell
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={productData} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            {/* <img src="https://images.pexels.com/photos/7156886/pexels-photo-7156886.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="productInfoImg" /> */}
            <img src={`${MEDIA_SERVER_URL}${params.image}`} alt="" className="productInfoImg" />
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
              <span className="productInfoKey">Quantity:</span>
              <span className="productInfoValue">{params.quantity}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">In stock:</span>
              <span className="productInfoValue">{params.availablestock}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Final Amount:</span>
              <span className="productInfoValue">{params.transactionvol}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
      <h1 className="productTitle">Customer Details</h1>
        <div className="productInfoBottom">
          <div className="buyerInfoItem">
            <span className="productInfoKey">Buyer:</span>
            <span className="productInfoValue">{buyerDetails.username}</span>
          </div>
          <div className="buyerInfoItem">
            <span className="productInfoKey">Email:</span>
            <span className="productInfoValue">{buyerDetails.email}</span>
          </div>
        </div>
      </div>

      {/* <div className="productBottom">
        <form onSubmit={editProduct} className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input type="text" name="name" onChange={handleChange} id="name" placeholder={params.name} />
            <label>Price</label>
            <input type="text" name="price" onChange={handleChange} id="price" placeholder={params.price} />
            <label>Stock</label>
            <input type="text" name="quantity" onChange={handleChange} id="quantity" placeholder={params.quantity} />
            <label>Active</label>
            <select name="status" id="status" onChange={handleChange} placeholder={params.status}>
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>


          <div className="productFormRight">
            <div className="productUpload">
              <img src={`${MEDIA_SERVER_URL}${params.image}`} alt="" className="productUploadImg" />
              <label for="file">
                <Publish />
              </label>
              <input type="file" name="image" id="file" onChange={handleImageChange} style={{ display: "none" }} />
            </div>
            <button className="productButton" type="submit">Update</button>
          </div>
        </form>
      </div> */}
    </div>
  );
}
