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

    useEffect(() => {

        get_available_categories()

        const id = localStorage.getItem(COOKIE_USER_ID)
        if (id) {
            const userInfo = localStorage.getItem(COOKIE_USER_INFO)
            if (userInfo) {
                const userArray = JSON.parse(userInfo)
                setUser({ id: JSON.parse(id), ...userArray })
                if (userArray.role == 1) {
                    setBuyer(true)
                } else if (userArray.role == 2) {
                    setSeller(true)
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
                                break;
                            case 2:
                                setSeller(true)
                                break;
                        }
                        setAuth(true);
                        setUser({ id: userid, ...userdata })
                        localStorage.setItem(COOKIE_USER_ID, JSON.stringify(userid))
                        localStorage.setItem(COOKIE_USER_INFO, JSON.stringify(userdata))
                        // alert('isBuyer:'+isBuyer )
                        if (isSeller) {
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

    const add_product = async (name, price, category, quantity, status, image) => {
        if (!user) {
            alert("User id is null")
            return
        }
        await axios.post(`${API_SERVER_URL}/product/add/`,
            {
                name: name, price: price, category: category, quantity: quantity, status: status,
                image: image, username: user.username
            })
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
            COOKIE_USER_ID,
            COOKIE_USER_INFO,
            showPopup, titlePopUp, descPopUp, setOpenPopUp,

            // Backend
            user, isSeller, isBuyer, isAuth,
            login, signup, logout,

            //Product
            categories,
            add_product,
        }}>
            {children}
        </BackendContext.Provider>
    )
}

export default BackendContext;
