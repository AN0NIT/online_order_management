import PopUp from 'components/Popup';
import React from 'react'
import { Carousel } from "react-carousel-minimal";
import { Link } from 'react-router-dom';

const Posters = [
    { title: 'Poster01', imageUrl: '#', link: <Home /> },
    { title: 'Poster02', imageUrl: '#', link: <Home /> },
    { title: 'Poster03', imageUrl: '#', link: <Home /> },
]

function CarouselOfPosters({ data }) {

    const captionStyle = {
        fontSize: "1.5em",
        fontWeight: "bold",
    };

    return (
        <div class="bg-black border-2 h-auto text-center w-full">
            <Carousel
                data={data}
                time={10000}
                width="100%"
                captionStyle={captionStyle}
                radius="10px"
                captionPosition="center"
                automatic={true}
                dots={true}
                pauseIconColor="white"
                pauseIconSize="40px"
                slideBackgroundColor="darkgrey"
                slideImageFit="cover"
            />
        </div>
    )
};

const TShirt = () => {

    return (

        <Link to='/product' >
            <div class="group relative">
                <div class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                    <img src="https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg" alt="Front of men&#039;s Basic Tee in black." class="w-full h-full object-center object-cover lg:w-full lg:h-full" />
                </div>
                <div class="mt-4 flex justify-between">
                    <div>
                        <h3 class="text-sm text-gray-700">
                            <a href="#">
                                <span aria-hidden="true" class="absolute inset-0"></span>
                                Basic Tee
                            </a>
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">Black</p>
                    </div>
                    <p class="text-sm font-medium text-gray-900">$35</p>
                </div>
            </div>
        </Link>
    )

}

function ProductLists() {

    return (
        <div class="bg-white">
            <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">Customers also purchased</h2>

                <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    <TShirt />
                    <TShirt />
                    <TShirt />
                    <TShirt />
                </div>
            </div>
        </div>
    )

}

const StartingSection = () => {
    return (
        <div className="relative overflow-hidden bg-gray-100">
            <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <div className="sm:max-w-lg">
                        <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            One stop place for sellers
                        </h1>
                        <p className="mt-4 text-xl text-gray-500">
                            Using state of the art AI technology to enhance sellers experience.
                        </p>
                    </div>
                    <div>
                        <div className="mt-10">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                            >
                                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                    <div className="flex items-center space-x-6 lg:space-x-8">
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img
                                                    src="https://www.refinery29.com/images/10226353.jpg?format=webp&width=720&height=864&quality=85&crop=5%3A6"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    src="https://www.refinery29.com/images/10226385.jpg?format=webp&width=720&height=864&quality=85"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    src="https://www.refinery29.com/images/10226387.jpg?format=webp&width=720&height=864&quality=85"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    src="https://www.refinery29.com/images/10226392.jpg?format=webp&width=720&height=864&quality=85"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    src="https://www.refinery29.com/images/10226395.jpg?format=webp&width=720&height=864&quality=85"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    src="https://www.refinery29.com/images/10226405.jpg?format=webp&width=720&height=864&quality=85"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    src="https://www.refinery29.com/images/10226422.jpg?format=webp&width=720&height=864&quality=85"
                                                    alt=""
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/login"
                                className="inline-block rounded-md border border-transparent bg-blue-600 py-3 px-8 text-center font-medium text-white hover:bg-indigo-700"
                            >
                                Login now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Home() {
    return (
        <>
            <ProductLists />
            {/* <CarouselOfPosters data={Posters} /> */}
            <StartingSection />
            
        </>
    );
}