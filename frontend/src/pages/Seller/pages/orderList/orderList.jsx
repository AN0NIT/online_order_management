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
  const { user, API_SERVER_URL, MEDIA_SERVER_URL, COOKIE_USER_INFO } = useContext(BackendContext)
  const [products, setProducts] = useState([])
  const userdata = JSON.parse(localStorage.getItem(COOKIE_USER_INFO))

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  console.log('userdata:', userdata)
  console.log('userid:', user.id)
  // const loadData = async () => {
  //   let tmp = []
  //   await axios.post(`${API_SERVER_URL}/addtocart/orders/`, { 
  //     'seller_id': user.id,
  //   })
  //     .then((res) => {
  //       if (res.status == 200) {
  //         setProducts(res.data)
  //         // convert product to data format accecpted by this template
  //         const stuff = res.data.data;
  //         for (let i = 0; i < stuff.length; i++) {
  //           const order = stuff[i]
  //           tmp.push({
  //             id: i,
  //             orderid: order.id,
  //             pid: order.product_id,
  //             seller_id: order.seller_id,
  //             buyer_id: order.buyer_id,
  //             quantity: order.quantity,
  //             ispurchased: order.ispurchased == true ? "new order" : "delivered"
  //           })
  //         }
  //         setData(tmp)
  //       }
  //     })
  // }

  const loadData = async () => {
    let smpar = []
    await axios.post(`${API_SERVER_URL}/addtocart/orders/`, {
      'seller_id': user.id,
    })
      .then(res => {
        if (res.status == 200) {
          console.log('resdata:', res.data)
          console.log('res:',res)
          if(res.data === "NO_PRODUCTS_FROM_USER")
            return
          res.data.data.forEach(async (element, index) => {
            // console.log("pid:", element.product_id)
            let tmp = await axios.get(`${API_SERVER_URL}/product/${element.product_id}`)
            // console.log('tmp:',tmp)
            // console.log('p details:', tmp.data.data[0].fields.name)
            // console.log('p details:', res.data.data[index])
            tmp = tmp.data.data[0].fields
            smpar.push({
              ...res.data.data[index],
              name: tmp.name,
              price: tmp.price,
              availablestock: tmp.quantity,
              image: '/media/' + tmp.image,
              transactionvol: tmp.price * element.quantity,
              // status: res.data.data[index].issold == true ? "sold" : "sell"
              status: res.data.data[index].ispurchased == true ? "sell" : "sold" 
            })
            // console.table('smpar:', smpar)
          });

          setTimeout(() => {
            console.log('final smpar:', smpar)
            setData(smpar)
          }, 500);

        }
        else {
          console.log("nothing")
          return
        }
      })
      .catch((error) => {
        console.log('error:', error)
      })
  }

  useEffect(() => {
    loadData()
  }, [user])

  console.log('data:', data)

  const columns = [
    // { field: "id", headerName: "ID", width: 100 },
    {
      field: "id",
      headerName: "Order",
      width: 300
    },
    {
      field: "product", headerName: "Product", width: 200 ,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={`${MEDIA_SERVER_URL}${params.row.image}`} alt="" />
            {params.row.name}
          </div>
        );
      },

    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transactionvol",
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
            <Link to={"/seller/order/" + params.row.id} state={params.row}>
              <button className="userListEdit">Sell</button>
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
