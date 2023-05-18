import { React, useContext, useEffect, useState } from "react";
import BackendContext from "context/BackendContext";
import { gridColumnsTotalWidthSelector } from "@material-ui/data-grid";
import axios from 'axios'
const AboutPage = () => {

  const { user, logout, API_SERVER_URL } = useContext(BackendContext)
  const [walletBalance, setWalletBalance] = useState('')
  useEffect(() => {
    const get_wallet_balance = () => {
      axios.get(`${API_SERVER_URL}/user/get_wallet/${user.id}`)
        .then((res) => {
          if (res.status = 200) {
            console.log(res.data)
            setWalletBalance(res.data.wallet)
          }
          else
            alert("handle delete error")
        })
    }
    get_wallet_balance()
  }, [user,walletBalance])



  console.log(user)
  // console.log('userDetails:',userDetails)
  return (
    <div class='mx-auto'>
      <div className="w-1/3 mx-auto my-4 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-3 py-3 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">About {user.username}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">User information</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.username}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fullname</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.fullname}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.email}</dd>
            </div>
            <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">DOB</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.dob}</dd>
            </div>
            <div className="bg-white px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Wallet Balance:</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">${walletBalance}</dd>
            </div>
          </dl>
        </div>
        <button class='px-4 m-4 w-1/9 p-2 bg-red-600 items-center rounded-md text-red-300 font-semibold '
          onClick={logout}> Logout </button>
      </div>
    </div>
  )
}

export default AboutPage
