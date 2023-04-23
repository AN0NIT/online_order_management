import { gridColumnsTotalWidthSelector } from "@material-ui/data-grid";
import axios from "axios";
import PopUp from "components/Popup";
import BackendContext from "context/BackendContext";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import "./newProduct.css";

function titleCase(str) {
  str = str.toLowerCase();
  str = str.split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

const todaysDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  const formattedToday = dd + '-' + mm + '-' + yyyy;

  return formattedToday
}

export default function NewProduct() {

  const { API_SERVER_URL, add_product, categories } = useContext(BackendContext)
  const [imageContent, setImageContent] = useState(null)
  const [sdStock, setSdStock] = useState(null)
  const [dpPrice, setDpPrice] = useState('')
  const [userSelectedStock, setUserSelectedStock] = useState('')
  const tdate = todaysDate()

  //
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageContent(reader.result);
    };
  };

  //

  const ml_SeasonalDemand = async (category) => {
    await axios.post(`${API_SERVER_URL}/product/category/stock/recommendation`, { category: category },
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    )
      .then((res) => {
        if (res.status == 200) {
          const data = JSON.parse(res.data)
          setSdStock(data)
          setUserSelectedStock(data.avg)
        }
      })
  }

  const ml_DynamicPrice = async (demand) => {
    await axios.post(`${API_SERVER_URL}/product/price/recommendation`,
      {
        category: demand.category,
        demand: demand.avg,
        date: tdate
      })
      .then((res) => {
        if (res.status == 200) {
          setDpPrice(res.data)
        }
      })
  }

  const stockOnChange = async (e) => {
    e.preventDefault()
    const category = categories[e.target.value - 1][1]
    await ml_SeasonalDemand(category)
  }

  const sliderOnChange = async (e) => {
    e.preventDefault()
    setUserSelectedStock(e.target.value)
  }

  const createProduct = (e) => {

    let form_data = new FormData()
    e.preventDefault();
    const name = e.target.name.value;
    const price = e.target.price.value;
    alert("price is " + price)
    // const price = dpPrice;
    const category = e.target.category.value;
    const quantity = e.target.quantity.value;
    alert("quantity is " + quantity)
    // console.log("====" + imageContent.toString())
    alert("image:"+imageContent);
    const status = e.target.status.value;
    const image = e.target.files[0];
    //add_product(name, price, category, quantity, status, imageContent.selectedFile);
    add_product(name, price, category, quantity, status, imageContent);
  }

  useEffect(() => {
    ml_SeasonalDemand("electronic")
  }, [categories])

  useEffect(() => {
    ml_DynamicPrice(sdStock)
  }, [sdStock])

  return (
    <div class=' p-8 rounded-md bg-gray-100'>
      <div className="newProduct border-2 p-8 m-auto w-1/2 bg-white">
        <h1 className="addProductTitle text-2xl mb-4">New Product</h1>

        <form onSubmit={createProduct} className="addProductForm" >
          <div className="addProductItem">
            <label>Image</label>
            {/* <input name='image' type="file" onChange={(e) => {
                setImageContent({ selectedFile: e.target.files[0] })
                console.log("Image name:", imageContent)
                alert("Image name:", imageContent)
            }} /> */}
            <input name="image" type="file" onChange={handleImageChange} />
          </div>
          <div className="addProductItem">
            <label>Name</label>
            <input name='name' type="text" placeholder="Product name" />
          </div>
          <div className="addProductItem">
            <label>Category</label>
            <select onChange={stockOnChange} name='category'>
              {
                categories.map((category, index) => (
                  <option value={`${index + 1}`}> {titleCase(category[1])}</option>
                ))
              }
            </select>
          </div>
          <div class='flex'>
            <div className="addProductItem">
              <label>Stock</label>
              <input name='quantity' id='quantity' type="text" placeholder={`Stock: ${userSelectedStock}`} defaultValue={`${userSelectedStock}`} />
              {/* <input name='quantity' id='quantity' type="text" placeholder={`Stock: ${sdStock?.min}-${sdStock?.max}`} /> */}
              {/* <h1 class='m-2 text-lg font-semibold text-gray-600 p-2 text-center'>{userSelectedStock}</h1> */}
            </div>
            <div className="addProductItem bg-yellow-300 p-2 rounded-md">
              <label class='text-center'>Recommended (seasonal demand)</label>
              {/* <div class='flex space-x-4'> */}
              {/* <input name='test' class='font-semibold' onChange={sliderOnChange} type="range" min={sdStock?.min} max={sdStock?.max} value={userSelectedStock} /> */}
              {/* </div> */}
              <div class='text-center'>
                <label >{sdStock?.min} - {sdStock?.max}</label>
              </div>
            </div>

          </div>
          <div class='flex'>
            <div className="addProductItem">
              <label>Price</label>
              {/* <h1 class='m-2 text-lg font-semibold text-gray-600 p-2 text-center'>{dpPrice}</h1> */}
              <input name='price' id='price' type="text" placeholder={`Price: ${dpPrice}`} defaultValue={`${dpPrice}`} />
            </div>
            <div className="addProductItem bg-yellow-300 p-2 rounded-md h-1/2 my-auto">
              <label class='text-center'>Recommended (dynamic price)</label>
              <div class='text-center'>
                <label >{dpPrice}</label>
              </div>
            </div>

          </div>

          <div className="addProductItem">
            <label>Active</label>
            <select name='status' id="active">
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <input value="Submit" type="submit" className="addProductButton" />
        </form>
      </div>

    </div>
  );
}
