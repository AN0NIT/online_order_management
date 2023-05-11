import { createContext, useEffect, useState } from 'react';
import { TODO } from 'utils/basic'
import { useNavigate } from 'react-router-dom';
import { AlternateEmail } from '@material-ui/icons';
import axios from 'axios'
import { ContentPasteSearchOutlined } from '@mui/icons-material';
import { gridColumnsTotalWidthSelector } from '@material-ui/data-grid';
import PopUp from 'components/Popup';


// protection routing
import { useRoutes } from 'react-router-dom';

//environment vars
// require('dotenv').config()


const BackendContext = createContext({});
const SERVER_URL = 'http://127.0.0.1:8000'
// const SERVER_URL = 'http://ec2-34-209-215-94.us-west-2.compute.amazonaws.com:8000'
const API_SERVER_URL = `${SERVER_URL}/api`
const MEDIA_SERVER_URL = `${SERVER_URL}/media/`
const DEFAULT_USER_INFO = {
    id: '',
    fullname: '',
    username: '',
    dob: '',
    email: '',
    role: 0
}

/* RESPONSE FORMAT
{
    "message": "CORRECT_EMAIL_AND_PASSWORD",
    "data": [
        {
            "model": "api.user",
            "pk": "a51d7bef-2e01-4258-a8f1-fa6adeb1c3ca",
            "fields": {
                "fullname": "JohnDoe",
                "dob": "2000-09-20",
                "email": "johndoe@email.com",
                "password": "password",
                "role": 3,
                "added_date": "2022-09-20"
            }
        }
    ]
}
*/

const grab_user_id = (res) => {
    return res.data.data[0].pk
}
const grab_user_data = (res) => {
    return res.data.data[0].fields
}

const COOKIE_USER_ID = 'suyati-user-id';
const COOKIE_USER_INFO = 'suyati-user-info';

// Was trying to implement protected routing here
// const buyerRoutes = [
//     { path: '/buyer/user', element: <BuyerHome /> },
//     { path: '/buyer/cart', element: <BuyerCart /> },
//     { path: '/orders', element: <BuyerOrders /> },
//     // add more buyer routes here
//   ];

//   const sellerRoutes = [
//     { path: '/seller/about', element: <SellerDashboard /> },
//     { path: '/seller/products', element: <SellerProductList /> },
//     { path: '/orders', element: <SellerOrders /> },

//     { path: '/seller/users', element: <SellerUserList /> },
//     { path: '/products', element: <SellerProducts /> },
//     { path: '/seller/user/:userId', element: <SellerUser /> },

//     { path: '/seller/newUser', element: <SellerNewUser /> },
//     { path: '/seller/product/:productId', element: <SellerProduct /> },
//     { path: '/seller/newproduct', element: <SellerNewProduct /> },
//     { path: '/seller/product/add', element: <NewProduct /> },
//     // add more seller routes here
//   ];

//   const allRoutes = [
//     ...buyerRoutes,
//     ...sellerRoutes,
//   ];



export const BackendProvider = ({ children }) => {

    //Popup
    const [openPopUp, setOpenPopUp] = useState(false)
    const [titlePopUp, setTitlePopUp] = useState('')
    const [descPopUp, setDescPopUp] = useState('')

    //Backend
    const [user, setUser] = useState(DEFAULT_USER_INFO);
    const [isAuth, setAuth] = useState(false);
    const [isSeller, setSeller] = useState(false);
    const [isBuyer, setBuyer] = useState(false);
    const navigate = useNavigate();
    const [gstin, setGstin] = useState('')

    // Products
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState([])

    // Carts
    const [buyerCart, setBuyerCart] = useState([])
    const [cartDetails, setCartDetails] = useState([])

    useEffect(() => {

        get_available_categories()
        console.log("calling useEffect from backendcontext")
        const id = localStorage.getItem(COOKIE_USER_ID)
        if (id) {
            const userInfo = localStorage.getItem(COOKIE_USER_INFO)
            if (userInfo) {
                const userArray = JSON.parse(userInfo)
                setUser({ id: JSON.parse(id), ...userArray })
                if (userArray.role == 1) {
                    setBuyer(true)
                    setSeller(false)
                } else if (userArray.role == 2) {
                    setSeller(true)
                    setBuyer(false)
                }
                // } else if (userArray.role == 3) {
                //     setBuyer(true)
                //     setSeller(true)
                // }
                else {
                    alert("Error!")
                }
                setAuth(true)
            } else {
                localStorage.removeItem(COOKIE_USER_ID)
                localStorage.removeItem(COOKIE_USER_INFO)
            }
        }
    }, [])

    const login = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        await axios.post(`${API_SERVER_URL}/login/`, { 'email': email, 'password': password })
            .then((res) => {
                console.log(res)
                if (res.status != 200)
                    alert('something went wrong')

                const userid = grab_user_id(res);
                const message = res.data.message;
                const userdata = grab_user_data(res);
                // alert("userdata.rol:"+userdata.role)
                switch (message) {
                    case "CORRECT_EMAIL_AND_PASSWORD":
                        switch (userdata.role) {
                            case 1:
                                // alert("callinng case1 ")
                                setBuyer(true);
                                setSeller(false);
                                break;
                            case 2:
                                // console.log("callinng case2 ",userdata.role)
                                setSeller(true);
                                setBuyer(false);
                                break;
                            default:
                                alert("None of the above")
                        }
                        setAuth(true);
                        setUser({ id: userid, ...userdata })
                        localStorage.setItem(COOKIE_USER_ID, JSON.stringify(userid))
                        localStorage.setItem(COOKIE_USER_INFO, JSON.stringify(userdata))
                        // alert('isBuyer:'+isSeller )
                        if (userdata.role == 2) {
                            navigate('/seller/about')
                        } else {
                            navigate('/product')
                        }
                        break;
                    case "WRONG_EMAIL_AND_PASSWORD":
                        console.log("Invalid username and password")
                        alert(message)
                        break;
                }
            })
    }

    const signup = async (e) => {
        e.preventDefault();
        const fullname = e.target.fullname.value;
        const username = e.target.username.value;
        const dob = e.target.dob.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const repassword = e.target.repassword.value;
        const role = e.target.role.value;
        // alert(e.target.gstin.value)

        // Checking for any empty fields.
        if (
            fullname.length === 0 ||
            username.length === 0 ||
            dob.length === 0 ||
            email.length === 0 ||
            password.length === 0 ||
            repassword.length === 0 ||
            role.length === 0
        ) {
            alert("Please fill out all the fields.");
            return;
        }
        if (password !== repassword) {
            alert('Retyped password doesnt match password')
            return;
        }

        if (role !== 'BUYER') {
            const gstin = e.target.gstin.value;
            // alert(gstin);
            // const apiKey = process.env.REACT_APP_API_KEY;
            // alert(apiKey);
            // console.log(process.env.REACT_APP_API_KEY);
            const response = await fetch("https://appyflow.in/api/verifyGST", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gstNo: gstin, key_secret: process.env.REACT_APP_API_KEY }),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .then(data => {
                    console.log('data::' + data.message)
                    if (data.error) {
                        alert('Error: Invalid GSTIN');
                        throw new Error('Invalid GSTIN');
                    }
                    return data;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            console.log('response::' + response)
            if (!response) {
                return;
            }
            //   alert("signing up as not BUYER")
            //   alert('GSTIN:'+ gstin)
            axios.post(`${API_SERVER_URL}/signup/`, {
                'fullname': fullname,
                'username': username,
                'dob': dob,
                'email': email,
                'password': password,
                'role': role,
                'gstin': gstin
            })
                .then((res) => {
                    console.log(res)
                    if (res.status != 200)
                        alert('something went wrong')
                    else {
                        alert(res.data.message);
                        const userid = grab_user_id(res);
                        const message = res.data.message;
                        const userdata = grab_user_data(res);
                        switch (message) {
                            case "SIGNUP_SUCCESSFULL":
                                switch (userdata.role) {
                                    case 2:
                                        setSeller(true)
                                        break;
                                    default:
                                        alert("Invalid Option")
                                    // case 3:
                                    //     setBuyer(true)
                                    //     setSeller(true)
                                    //     break;
                                }
                                setAuth(true);
                                setUser({ id: userid, ...userdata })
                                localStorage.setItem(COOKIE_USER_ID, JSON.stringify(userid))
                                localStorage.setItem(COOKIE_USER_INFO, JSON.stringify(userdata))
                                navigate('/seller/about')
                                break;
                        }
                    }
                })
        }
        else {
            // alert("signing up as BUYER")
            // alert('GSTIN:'+ gstin)
            axios.post(`${API_SERVER_URL}/signup/`, {
                'fullname': fullname,
                'username': username,
                'dob': dob,
                'email': email,
                'password': password,
                'role': role,
                'gstin': 'NIL'
            })
                .then((res) => {
                    console.log(res)
                    if (res.status != 200)
                        alert('something went wrong')
                    else {
                        alert(res.data.message);
                        const userid = grab_user_id(res);
                        const message = res.data.message;
                        const userdata = grab_user_data(res);
                        alert(message);
                        switch (message) {
                            case "SIGNUP_SUCCESSFULL":
                                switch (userdata.role) {
                                    case 1:
                                        setBuyer(true)
                                        break;
                                    default:
                                        alert("Invalid Option")
                                    // case 3:
                                    //     setBuyer(true)
                                    //     setSeller(true)
                                    //     break;
                                }
                                setAuth(true);
                                setUser({ id: userid, ...userdata })
                                localStorage.setItem(COOKIE_USER_ID, JSON.stringify(userid))
                                localStorage.setItem(COOKIE_USER_INFO, JSON.stringify(userdata))
                                navigate('/product')
                                break;
                        }

                    }
                })
        }


    }

    const logout = async () => {
        alert("logout");
        setUser(DEFAULT_USER_INFO);
        setAuth(false);
        setBuyer(false);
        setSeller(false);
        localStorage.removeItem(COOKIE_USER_ID);
        localStorage.removeItem(COOKIE_USER_INFO);
        navigate('/')
    }

    const get_available_categories = async () => {
        axios.post(`${API_SERVER_URL}/product/category/all/`)
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    setCategories(res.data)
                }
            })
    }


    // Products
    const add_product = async (formData) => {
        if (!user) {
            alert("User id is null")
            return
        }
        formData.append('username', user.username)
        await axios.post(`${API_SERVER_URL}/product/add/`,
            formData
        )
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    const message = res.data.message
                    switch (message) {
                        case "PRODUCT_ADDED_SUCCESSFULLY":
                            // showPopup(res.data, "")
                            alert(message)
                            break;
                    }
                }
            })
    }



    const edit_product = async (formData, pid) => {
        if (!user) {
            alert("User id is null")
            return
        }
        formData.append('userid', user.id)
        await axios.post(`${API_SERVER_URL}/product/edit/${pid}`,
            formData
        )
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    const message = res.data.message
                    switch (message) {
                        case "PRODUCT_EDITED_SUCCESSFULLY":
                            // showPopup(res.data, "")
                            alert(message)
                            break;
                    }
                }
            })
    }

    const get_product = async (product_id) => {
        console.log(":", user)
        if (!user) {
            alert("User id is null")
            return
        }
        axios.get(`${API_SERVER_URL}/product/${product_id}`)
            .then((res) => {
                if (res.status == 200) {
                    console.log('productdata:', res.data)
                    // setProduct(res.data)
                    return res.data
                }
                else {
                    console.log("nothing")
                }
            })
            .catch((error) => {
                console.log('error:', error)
            })
        console.log('got product deets')
    }


    // Carts
    const add_to_cart = async (pid, quantity) => {
        if (!user) {
            alert("User id is null")
            return
        }
        console.log("sending")
        await axios.post(`${API_SERVER_URL}/addtocart/add/`,
            {
                product_id: pid,
                quantity: quantity,
                buyer_id: user.id,
            }
        )
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    const message = res.data.message
                    switch (message) {
                        case "ADDED_TO_CART":
                            // showPopup(res.data, "")
                            alert(message)
                            break;
                        case "CART_EDITED_SUCCESSFULLY":
                            // showPopup(res.data, "")
                            alert(message)
                            break;
                    }
                }
            })
    }



    const edit_cart = async (formData, order_id) => {
        if (!user) {
            alert("User id is null")
            return
        }
        formData.append('userid', user.id)
        await axios.post(`${API_SERVER_URL}/addtocart/edit/${order_id}`,
            formData
        )
            .then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    const message = res.data.message
                    switch (message) {
                        case "CART_EDITED_SUCCESSFULLY":
                            // showPopup(res.data, "")
                            alert(message)
                            break;
                    }
                }
            })
    }


    const get_cart_from_buyer = async (userid, isPurchased) => {
        console.log(":", userid)
        if (!user) {
            alert("User id is null")
            return
        }
        let smpar = []
        let order_data;
        await axios.post(`${API_SERVER_URL}/addtocart/all/`, {
            'buyer_id': userid,
            'isPurchased': isPurchased
        })
            .then(res => {
                if (res.status == 200) {
                    console.log('resdata:', res.data)
                    res.data.data.forEach(async (element, index) => {
                        console.log("pid:", element.product_id)
                        let tmp = await axios.get(`${API_SERVER_URL}/product/${element.product_id}`)
                        // console.log('tmp:',tmp)
                        // console.log('p details:', tmp.data.data[0].fields.name)
                        console.log('p details:', res.data.data[index])
                        tmp = tmp.data.data[0].fields
                        // smpar.push(JSON.parse(JSON.stringify({
                        //     ...res.data.data[index],
                        //     name:tmp.name,
                        //     price:tmp.price,
                        //     image:tmp.image
                        // })))
                        smpar.push({
                            ...res.data.data[index],
                            name: tmp.name,
                            price: tmp.price,
                            image: tmp.image
                        })
                        console.table('smpar:', smpar)
                    });

                    setTimeout(() => {
                        console.log('final smpar:', smpar)
                        setCartDetails(smpar)
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
        console.log('==========')
    }

    const showPopup = async (title, description) => {
        setTitlePopUp(title)
        setDescPopUp(description)
        setOpenPopUp(true)
    }
    // Was trying to implement protected routing here
    // const routing = useRoutes(isAuth ? (isBuyer && isSeller ? allRoutes : (isBuyer ? buyerRoutes : sellerRoutes)) : []);

    return (
        <BackendContext.Provider value={{
            // utils
            API_SERVER_URL,
            MEDIA_SERVER_URL,
            COOKIE_USER_ID,
            COOKIE_USER_INFO,
            showPopup, titlePopUp, descPopUp, setOpenPopUp,

            // Backend
            user, isSeller, isBuyer, isAuth, buyerCart, product,
            login, signup, logout,

            //Product
            categories,
            add_product, edit_product, get_product,


            //Cart
            add_to_cart, edit_cart, get_cart_from_buyer, cartDetails,
        }}>
            {children}
        </BackendContext.Provider>
    )
}

export default BackendContext;
