import './OrderPage.css'
import { Fragment, useState, useContext, useEffect, React } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import BackendContext from "../../context/BackendContext";
import axios from 'axios'

function OrderPage() {
    const { user, get_cart_from_buyer, orderDetails, API_SERVER_URL, MEDIA_SERVER_URL } = useContext(BackendContext)
    console.log('user:', user)
    console.log('oderDeets:', orderDetails)
    // useEffect(() => {
    //     if (user.id !== '') {
    //         get_cart_from_buyer(user.id, true)
    //     }
    // }, [user])
    let totalPrice = 0.0
    let progress = 45
    return (
        orderDetails.length>0?
            <section className="h-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-lg-10 col-xl-8">
                            <div className="card" style={{ borderRadius: 10 }}>
                                <div className="card-header px-4 py-5">
                                    <h5 className="text-muted mb-0">
                                        Thanks for your Order,{" "}
                                        <span style={{ color: "#a8729a" }}>{user.username}</span>!
                                    </h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <p className="lead fw-normal mb-0" style={{ color: "#a8729a" }}>
                                            Receipt
                                        </p>
                                    </div>
                                    {orderDetails.length > 0 && orderDetails.map((order, index) => {
                                        totalPrice += order.quantity * order.price
                                        return (
                                            <div className="card shadow-0 border mb-4">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-md-2">
                                                            <img
                                                                // src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/13.webp"
                                                                src={`${MEDIA_SERVER_URL}${order.image}`}
                                                                className="img-fluid"
                                                                alt="Phone"
                                                            />
                                                        </div>
                                                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                            <p className="text-muted mb-0">{order.name}</p>
                                                        </div>
                                                        {/* <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                        <p className="text-muted mb-0 small">White</p>
                                                    </div> */}
                                                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                            {/* <p className="text-muted mb-0 small">Capacity: 64GB</p> */}
                                                        </div>
                                                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                            <p className="text-muted mb-0 small">Qty: {order.quantity}</p>
                                                        </div>
                                                        <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
                                                            <p className="text-muted mb-0 small">₹{order.quantity * order.price}</p>
                                                        </div>
                                                    </div>
                                                    <hr
                                                        className="mb-4"
                                                        style={{ backgroundColor: "#e0e0e0", opacity: 1 }}
                                                    />
                                                    <div className="row d-flex align-items-center">
                                                        <div className="col-md-2">
                                                            <p className="text-muted mb-0 small">Track Order</p>
                                                        </div>
                                                        <div className="col-md-10">
                                                            <div
                                                                className="progress"
                                                                style={{ height: 6, borderRadius: 16, width: { progress } }}
                                                            >
                                                                <div
                                                                    className="progress-bar"
                                                                    role="progressbar"
                                                                    style={{
                                                                        width: "65%",
                                                                        borderRadius: 16,
                                                                        backgroundColor: "#a8729a"
                                                                    }}
                                                                    aria-valuenow={65}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                />
                                                            </div>
                                                            <div className="d-flex justify-content-around mb-1">
                                                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                                                    Out for delivery
                                                                </p>
                                                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                                                    Delivered
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="d-flex justify-content-between pt-2">
                                        <p className="fw-bold mb-0">Order Details</p>
                                        <p className="text-muted mb-0">
                                            <span className="fw-bold me-4">Total</span> ₹{totalPrice}
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2">
                                        {/* <p className="text-muted mb-0">Invoice Number : 788152</p>
                                    <p className="text-muted mb-0">
                                        <span className="fw-bold me-4">Discount</span> ₹19.00
                                    </p> */}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        {/* <p className="text-muted mb-0">Invoice Date : 22 Dec,2019</p> */}
                                        {/* <p className="text-muted mb-0">
                                        <span className="fw-bold me-4">GST 18%</span> 123
                                    </p> */}
                                    </div>
                                    <div className="d-flex justify-content-between mb-5">
                                        {/* <p className="text-muted mb-0">Recepits Voucher : 18KU-62IIK</p> */}
                                        <p className="text-muted mb-0">
                                            <span className="fw-bold me-4">Delivery Charges</span> Free
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="card-footer border-0 px-4 py-5"
                                    style={{
                                        backgroundColor: "#6045ba",
                                        borderBottomLeftRadius: 10,
                                        borderBottomRightRadius: 10
                                    }}
                                >
                                    <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                                        Total paid: <span className="h2 mb-0 ms-2">₹{totalPrice}</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> :
            <div className="relative py-16 px-4 w-full min-h-screen bg-gray-50">
            <div className="flex flex-col items-center">
      
              {/* :TITLE */}
              <div className="text-center space-y-5">
                <p className="text-6xl sm:text-7xl text-purple-500 font-bold tracking-wide">Oops</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-gray-700 font-semibold capitalize">This page does not exist</h1>
                {/* <p className="text-sm text-gray-500 font-medium">Sorry! We could not find the page you are looking for. Please check URL in address bar and try again.</p> */}
                <p className="text-sm text-gray-500 font-medium">Sorry! You Haven't bought anything from us yet.</p>
              </div>
      
              {/* :OPTION LINKS */}
              <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <a href="/product" className="px-5 py-2.5 rounded border border-transparent bg-purple-600 text-center text-base text-white font-medium hover:bg-purple-700">Get back to Homepage</a>
                {/* <a href="#link" className="px-5 py-2.5 rounded border-2 border-purple-400 bg-transparent text-center text-base text-purple-400 font-medium hover:border-purple-500 hover:text-purple-500">Contact Support</a> */}
              </div>
      
      
              {/* :ILLUSTRATION */}
              <img src="https://fancytailwind.com/static/under_construction-503cab99df4458de6d2801e7ee4fa400.svg" alt="" className="mt-10 max-h-72" />
      
            </div>
          </div>
    )
}

export default OrderPage
