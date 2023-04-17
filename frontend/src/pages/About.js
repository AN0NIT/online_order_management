import { React, useContext } from "react";
import BackendContext from "context/BackendContext";
import { gridColumnsTotalWidthSelector } from "@material-ui/data-grid";

const AboutPage = () => {

  const { user, logout } = useContext(BackendContext)

  console.log(user)

  return (
    <div class='mx-auto'>
      <div className="w-1/3 mx-auto my-4 overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">About {user.username}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">User information</p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.username}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Fullname</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.fullname}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.email}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">DOB</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{user.dob}</dd>
            </div>
          </dl>
        </div>
        <button class='m-4 w-1/9 p-4 bg-red-600 rounded-md text-red-300 font-semibold '
          onClick={logout}> Logout </button>
      </div>
    </div>
  )
}

export default AboutPage
