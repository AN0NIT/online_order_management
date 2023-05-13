import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import Sidebar from "pages/Seller/components/sidebar/Sidebar";
import axios from 'axios'
import BackendContext from "context/BackendContext";
import { useState, useContext, useEffect } from 'react'

export default function SellerUserList() {
  // const [data, setData] = useState(userRows);
  const [data, setData] = useState([]);
  const { user,API_SERVER_URL, MEDIA_SERVER_URL,COOKIE_USER_INFO } = useContext(BackendContext)
  const [products, setProducts] = useState([])
  const userdata = JSON.parse(localStorage.getItem(COOKIE_USER_INFO))
  
  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  
  console.log('userdata:',userdata)
  console.log('userid:',user.id)
  const loadData = async () => {
    let tmp = []
    await axios.post(`${API_SERVER_URL}/addtocart/orders/`, { 
      'seller_id': user.id,
    })
      .then((res) => {
        if (res.status == 200) {
          setProducts(res.data)
          // convert product to data format accecpted by this template
          const stuff = res.data.data;
          for (let i = 0; i < stuff.length; i++) {
            const order = stuff[i]
            tmp.push({
              id: i,
              orderid: order.id,
              pid: order.product_id,
              seller_id: order.seller_id,
              buyer_id: order.buyer_id,
              quantity: order.quantity,
              ispurchased: order.ispurchased
            })
          }
          setData(tmp)
        }
      })
  }

  useEffect(() => {
    loadData()
  }, [])



  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "orderid",
      headerName: "Order",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.avatar} alt="" />
            {params.row.orderid}
          </div>
        );
      },
    },
    { field: "product", headerName: "Product", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "Transaction Volume",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/seller/order/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className='md:flex md:justify-center md:align-center md:m-4'>
      <div className='container' >
        <Sidebar />
        <div className="userList">
          <DataGrid
            rows={data}
            disableSelectionOnClick
            columns={columns}
            pageSize={8}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  );
}
