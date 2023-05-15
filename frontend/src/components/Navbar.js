import { React, Fragment, useContext, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { SearchIcon, MenuIcon, ShoppingCartIcon, XIcon, UserIcon, LoginIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import UserContext from 'context/BackendContext'
import TODO from 'utils/basic'

import BackendContext from 'context/BackendContext'
import logo_big from 'assets/asiet.png'
import CartPopup from 'pages/Buyer/CartPage'

const buyerNavigation = [
  { name: 'More', href: '/product', current: false },
  { name: 'Orders', href: '/buyer/orders', current: false },
]
const sellerNavigation = [
  { name: 'Your Profile', href: '/seller/about' },
  { name: 'Settings', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Logo() {
  return (
    <div class="flex items-center w-1/4">
      <div class="flex-shrink-0">
        <Link to='/' >
          <img
            class="h-8 w-40"
            src={logo_big}
            alt="Suyati-Logo"
          />
        </Link>
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div class='mx-8 w-full'>
      <div class="py-2 relative text-gray-600">
        <input class="border-2 border-gray-300 bg-white h-10 w-full px-5 pr-16 rounded-lg text-sm focus:outline-none"
          type="search" name="search" placeholder="Search" />
        <button type="submit" class="absolute right-0 top-0 mt-4 mr-3">
          <SearchIcon class='h-6  w-6 ' aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function NavigationLinks() {
  const { isBuyer, isSeller } = useContext(BackendContext);
  return (
    <div class="hidden md:block">
      <div class="text-left h-auto flex flex-1 items-baseline space-x-4">
        {isBuyer && buyerNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            class={classNames(
              item.current
                ? 'bg-suyati-blue text-white'
                : 'text-suyati-gray hover:bg-suyati-blue hover:text-white',
              'px-3 py-2 text-left rounded-md text-sm font-medium my-auto'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
        {isSeller && sellerNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            class={classNames(
              item.current
                ? 'bg-suyati-blue text-white'
                : 'text-suyati-gray hover:bg-suyati-blue hover:text-white',
              'px-3 py-2 text-left rounded-md text-sm font-medium my-auto'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>

  )
}

function ShoppingCart() {
  const context = useContext(BackendContext);
  const { isBuyer } = context;
  return (
    <Link to={`${isBuyer ? '/buyer/cart' : '/'}`}>
      <button
        type="button"
        class="bg-white p-1 rounded-full text-suyati-blue hover:text-white hover:bg-suyati-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
      >
        <ShoppingCartIcon class="h-6 w-6 hover:bg-suyati-blue hover:text-white" aria-hidden="true" />
      </button>
    </Link>

  );
}

function Profile() {
  const { isBuyer, isSeller, isAuth } = useContext(BackendContext);

  if (isAuth && isBuyer) {
    return (
      <Link to='/about' >
        <div class='w-8'>
          <button class="bg-white p-1 rounded-full text-suyati-yellow"  >
            <UserIcon class='w-full h-full' />
          </button>
        </div>
      </Link>
    )
  }

  else if (isAuth && isSeller) {
    return (
      <Link to='/seller/about' >
        <div class='w-8'>
          <button class="bg-white p-1 rounded-full text-suyati-yellow"  >
            <UserIcon class='w-full h-full' />
          </button>
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to='/login' >
        <div class='w-8'>
          <button class="bg-white p-1 rounded-full text-suyati-yellow"  >
            <LoginIcon class='w-full h-full' />
          </button>
        </div>
      </Link>
    )
  }
}

function MobileDropDownPanel() {

  const { user, isAuth } = useContext(UserContext)
  const { isBuyer, isSeller } = useContext(BackendContext);
  return (
    <Disclosure.Panel class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {isBuyer && buyerNavigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            class={classNames(
              item.current ? 'bg-gray-900 text-white' : 'text-suyati-gray hover:bg-gray-700 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}
        {isSeller && sellerNavigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as="a"
            href={item.href}
            class={classNames(
              item.current ? 'bg-gray-900 text-white' : 'text-suyati-gray hover:bg-gray-700 hover:text-white',
              'block px-3 py-2 rounded-md text-base font-medium'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}

        {/* USER STUFF SHOULD GO HERE */}
        {/* <Disclosure.Button
          key={isAuthenticated ? user.username : "Login" }
          as="a"
          href=""
          class={classNames(
            user.current ? 'bg-gray-900 text-white' : 'text-suyati-gray hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium'
          )}
          aria-current=""
        >
          "lksadjf"
        </Disclosure.Button> */}

      </div>
    </Disclosure.Panel>
  )
}

function MobileDropDownButton({ isOpen }) {
  return (
    <div class="mr-2 flex md:hidden">
      {/* Mobile menu button */}
      <Disclosure.Button class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
        <span class="sr-only">Open main menu</span>
        {isOpen ? (
          <XIcon class="block h-6 w-6" aria-hidden="true" />
        ) : (
          <MenuIcon class="block h-6 w-6" aria-hidden="true" />
        )}
      </Disclosure.Button>
    </div>
  );
}

export default function Navbar() {

  return (
    <>
      <div class="min-h-full md:sticky shadow">
        <Disclosure as="nav" class="bg-white">
          {({ open }) => (
            <>
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div class="flex items-center justify-evenly h-16 space-x-9">

                  <Logo />
                  <SearchBar />

                  <div class="hidden md:block">
                    <div class="ml-4 flex items-center md:ml-6 space-x-6">

                      <NavigationLinks />
                      <ShoppingCart />
                      <Profile />

                    </div>
                  </div>

                  <MobileDropDownButton isOpen={open} />

                </div>
              </div>

              <MobileDropDownPanel />

            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}




