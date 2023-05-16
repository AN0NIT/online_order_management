import { Fragment, useState, useContext, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import BackendContext from "../../context/BackendContext";
import axios from 'axios'


const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    price: 90.00,
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    // imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
    imageAlt: 'IMAGE',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: 32.00,
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    // imageAlt: 'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
    imageAlt: 'IMAGE',
  },
  // More products...
]







function CartItem({ product, index }) {
  const { MEDIA_SERVER_URL, cartDetails, setCartDetails, API_SERVER_URL } = useContext(BackendContext)
  // But have to pass updated CartDetails, or make a new fetch to cart
  // useEffect(() => {
  //   Cart()
  // }, [])
  const handleDelete = async (index) => {
    // console.log('index:',index)
    // console.log(cartDetails[index].name)

    const response = await axios.get(`${API_SERVER_URL}/addtocart/delete/${cartDetails[index].id}`)
    console.log('respobse is:', response);
    var temp_cart = [...cartDetails]
    console.log('deleted:', cartDetails[index])
    console.log('cartDetails:', cartDetails);
    temp_cart.splice(index, 1)
    console.log('new cartdetaisl:', temp_cart)
    setCartDetails(temp_cart)
  };
  return (
    <div class="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
      <div class="flex w-2/5">
        <div class="w-20">
          <img class="h-24" src={`${MEDIA_SERVER_URL}${product.image}`} />
        </div>
        <div class="flex flex-col justify-between ml-4 flex-grow">
          <span class="font-bold text-sm">{product.name}</span>
          {/* <span class="text-red-500 text-xs">{product.href}</span> */}
          <a onClick={() => handleDelete(index)} class="font-semibold hover:text-red-500 text-gray-500 text-xs">Remove</a>
        </div>
      </div>
      <div class="flex justify-center w-1/5">
        <svg class="fill-current text-gray-600 w-3" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
        </svg>

        <input class="mx-2 border text-center w-8" type="text" value={product.quantity} />

        <svg class="fill-current text-gray-600 w-3" viewBox="0 0 448 512">
          <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
        </svg>
      </div>
      <span class="text-center w-1/5 font-semibold text-sm">₹{product.price}</span>
      <span class="text-center w-1/5 font-semibold text-sm">₹{product.quantity * product.price}</span>
    </div>


  )

}

export default function Cart() {

  let totalPrice = 0.00;
  const { user, get_cart_from_buyer, cartDetails, API_SERVER_URL } = useContext(BackendContext)

  console.log('userid:', user.id)
  useEffect(() => {
    if (user.id !== '') {
      get_cart_from_buyer(user.id, false)
    }
  }, [user])

  const handleCheckout = async () => {
    if (cartDetails.length < 1)
      alert("NO_PRODUCTS_FOUND")
    else {
      cartDetails.forEach(async (element, index) => {
        console.log('order_id:', element.id, '\nindex:', index)
        let tmp = await axios.post(`${API_SERVER_URL}/addtocart/buy/`,
          {
            buyer_id: user.id,
            order_id: element.id
          })

        console.log('checkout res:', tmp)
      })
    }
  }


  console.log('old cartdetails:', cartDetails)
  // const products = cartDetails[0]
  return (
    cartDetails.length > 0 ?
      <div class="mx-auto md:mx-auto md:w-2/3">
        <div class="flex shadow-md ">
          <div class="w-full md:w-3/4 bg-white px-10 py-10">
            <div class="flex justify-between border-b pb-8">
              <h1 class="font-semibold text-2xl">Shopping Cart</h1>
              <h2 class="font-semibold text-2xl">{cartDetails.length} Items</h2>
            </div>
            <div class="flex mt-10 mb-5">
              <h3 class="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
              <h3 class="font-semibold  text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
              <h3 class="font-semibold  text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
              <h3 class="font-semibold  text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
            </div>

            {
              cartDetails.length > 0 && cartDetails.map((product, i) => {
                totalPrice += product.price * product.quantity
                return (<CartItem product={product} index={i} />);
              })
            }
            <div class="md:hidden border-t mt-8">
              <div class="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>₹{totalPrice + 10.00}</span>
              </div>
              <button class="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">Checkout</button>
            </div>

            <Link to='/product' class="flex font-semibold text-indigo-600 text-sm mt-10">
              <svg class="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
              Continue Shopping
            </Link>

          </div>

          <div id="summary" class="hidden md:block w-1/4 px-8 py-10">
            <h1 class="font-semibold text-2xl border-b pb-8">Order Summary</h1>
            <div class="flex justify-between mt-10 mb-5">
              <span class="font-semibold text-sm uppercase">Items {cartDetails.length}</span>
              <span class="font-semibold text-sm">₹{totalPrice}</span>
            </div>
            <div>
              <label class="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
              <select class="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - ₹10.00</option>
              </select>
            </div>
            <div class="py-10">
              <label for="promo" class="font-semibold inline-block mb-3 text-sm uppercase">Promo Code</label>
              <input type="text" id="promo" placeholder="Enter your code" class="p-2 text-sm w-full" />
            </div>
            <button class="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">Apply</button>
            <div class="border-t mt-8">
              <div class="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>₹{totalPrice + 10.00}</span>
              </div>
              <button onClick={handleCheckout} class="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">Checkout</button>
            </div>
          </div>

        </div>
      </div>
      :
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
  );
}
