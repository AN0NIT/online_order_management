import PopUp from 'components/Popup';
import React, { useContext } from 'react'
import { Carousel } from "react-carousel-minimal";
import { Link } from 'react-router-dom';
import BackendContext from "context/BackendContext";


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

// Edit this to get various clothes to be displayed in the home page
// const getImageUrl = () => {
//     const staticUrl = 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-0';
//     const imageName = 1;
//     const imageExtension = '.jpg';
//     return `${staticUrl}${imageName}${imageExtension}`;
//   };


const TShirt = ({ num }) => {
    if (typeof num === 'undefined') {
        num = 1;
    }
    return (

        <Link to='/product' >
            <div class="group relative">
                <div class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                    <img src={`https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-0${num}.jpg`} alt="Front of men&#039;s Basic Tee in black." class="w-full h-full object-center object-cover lg:w-full lg:h-full" />
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
                    <p class="text-sm font-medium text-gray-900">₹35</p>
                </div>
            </div>
        </Link>
    )

}

function HomePageHeader(){
    const categories = [
        { id: 1, name: "IT & Tech", href: "#linkToCategory", picture: "https://fancytailwind.com/static/keyboard1-d324995c7d24b66f6935a11f1afcd6e7.jpg" },
        { id: 2, name: "Accessories", href: "#linkToCategory", picture: "https://fancytailwind.com/static/watch5-a86e63e37a603823384a28ed21b5bd30.jpg" },
        { id: 3, name: "Christmas", href: "#linkToCategory", picture: "https://fancytailwind.com/static/fun-pull1-c99e4d9aad2713d512f34897d43d7382.jpg" },
        { id: 4, name: "Cameras", href: "#linkToCategory", picture: "https://fancytailwind.com/static/photo3-7a3f62bb0365e6bcfb3695a21e194700.jpg" },
        { id: 5, name: "Shoes", href: "#linkToCategory", picture: "https://fancytailwind.com/static/shoes5-c9e834160d04845addcdf9d9e95d951c.webp" },
    ]

    return (
        // <div className="mx-auto py-5 px-4 w-full max-w-7xl bg-gray-100">
        //     <div className="mx-auto max-w-sm sm:max-w-3xl lg:max-w-none">

        //         {/* :TITLE */}
        //         <h2 className="text-2xl lg:text-3xl text-black font-bold">Shop by Category</h2>

        //         {/* :CATEGORIES */}
        //         <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 sm:gap-x-8">
        //             {categories.map(category => (
        //                 <div key={category.id} className="col-span-1 aspect-w-2 aspect-h-3 relative shadow-sm rounded-lg overflow-hidden bg-white hover:shadow-lg">
        //                     <a href={category.href} className="py-6 flex justify-center items-end">
        //                         {/* ::Background Image */}
        //                         <img src={category.picture} alt="" className="absolute inset-0 w-full h-full object-contain object-center" />
        //                         {/* ::Overlay */}
        //                         <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-gray-600 via-transparent" />
        //                         {/* ::Category Name */}
        //                         <h3 className="relative text-center text-sm sm:text-base lg:text-lg text-white font-semibold tracking-wide antialiased">{category.name}</h3>
        //                     </a>
        //                 </div>
        //             ))
        //             }
        //         </div>

        //     </div>
        // </div>
        <div className="mx-auto py-5 px-4 w-full max-w-md sm:max-w-2xl lg:max-w-7xl">
      <div className="grid lg:grid-rows-2 grid-cols-2 lg:grid-cols-5 lg:grid-flow-col gap-5">

        {/* :TITLE */}
        <h2 className="sr-only">Categories preview</h2>

        

        {/* :CATEGORY 1 -> LARGEST, LEFT */}
        <div className="order-1 lg:row-span-2 col-span-2 relative shadow rounded-md overflow-hidden bg-pink-100 filter hover:shadow-lg hover:brightness-125">
          <a href="#link" className="pt-8 pb-20 px-5 block w-full h-full">
            {/* ::Background Picture */}
            <div>
              {/* :::picture */}
              <img src="https://fancytailwind.com/static/model-woman2-ee6e3c8ec2648417a86c813d9acd0ac3.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              {/* :::overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-gray-600 opacity-70" />
            </div>
            {/* ::Category Infos */}
            <div className="relative h-full flex flex-col items-start text-white">
              {/* :::name */}
              <h3 className="text-3xl font-playfair tracking-wider leading-relaxed antialiased">
                <span className="block">Women</span>
                <span className="block">Collection</span>
              </h3>
              {/* :::collection */}
              <p className="mt-4 text-base font-medium font-serif">Summer 2022</p>
              {/* :::badge tag */}
              <span className="mt-4 inline-flex justify-center items-center py-1 px-3 border-none rounded bg-white bg-opacity-30 text-xs text-white font-semibold">Popular</span>
            </div>
          </a>
        </div>



        {/* :CATEGORY 2 -> SMALL, CENTER LEFT */}
        <div className="order-2 lg:row-span-1 col-span-full sm:col-span-1 relative shadow rounded-md overflow-hidden bg-gray-800 filter hover:shadow-lg hover:brightness-125">
          <a href="#link" className="py-5 px-5 block w-full h-full">
            {/* ::Background Picture */}
            <div>
              {/* :::picture */}
              <img src="https://fancytailwind.com/static/model-accessories1-b4739ca1decc6649c1bb240fedf4d7fe.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              {/* :::overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-gray-600 opacity-70" />
            </div>
            {/* ::Category Infos */}
            <div className="pt-10 relative h-full flex flex-col justify-end items-start text-white">
              {/* :::description */}
              <p className="text-sm font-light">To have that <br /> "je ne sais quoi"</p>
              {/* :::name */}
              <h3 className="text-2xl font-playfair tracking-wide leading-relaxed antialiased">Men Accessories</h3>
            </div>
          </a>
        </div>



        {/* :CATEGORY 3 -> LARGE, CENTER BOTTOM*/}
        <div className="order-4 lg:order-3 lg:row-span-1 col-span-full sm:col-span-1 lg:col-span-2 relative shadow rounded-md overflow-hidden bg-pink-400 filter hover:shadow-lg hover:brightness-125">
          <a href="#link" className="py-5 px-5 block w-full h-full">
            {/* ::Background Picture */}
            <div>
              {/* :::picture */}
              <img src="https://fancytailwind.com/static/model-woman3-50be74f3cd7349e4ff9686622ab7af6d.jpg" alt="" className="absolute top-0 right-0 w-full lg:w-auto h-full object-cover lg:object-contain object-center" />
              {/* :::overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 lg:via-pink-300" />
            </div>
            {/* ::Category Infos */}
            <div className="relative h-full flex flex-col justify-between items-start text-white">
              {/* :::badge tag */}
              <span className="inline-flex justify-center items-center py-1 px-3 border-none rounded bg-white bg-opacity-30 text-xs text-white font-semibold">Trendy</span>
              {/* :::name */}
              <h3 className="mt-16 text-2xl font-playfair tracking-wide leading-relaxed antialiased">Denim Jacket</h3>
            </div>
          </a>
        </div>



        {/* :CATEGORY 4 -> SMALL, CENTER RIGHT */}
        <div className="order-3 lg:order-4 lg:row-span-1 col-span-full sm:col-span-1 relative shadow rounded-md overflow-hidden bg-gray-500 filter hover:shadow-lg hover:brightness-125">
          <a href="#link" className="py-5 px-5 block w-full h-full">
            {/* ::Background Picture */}
            <div>
              {/* :::picture */}
              <img src="https://fancytailwind.com/static/model-woman4-286b4700eb73ed8cec43ff51aa31aa01.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              {/* :::overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black via-transparent opacity-70" />
            </div>
            {/* ::Category Infos */}
            <div className="relative h-full flex flex-col justify-between items-start space-y-16 text-white">
              {/* :::badge tag */}
              <span className="inline-flex justify-center items-center py-1 px-3 border-none rounded bg-white bg-opacity-30 text-xs text-white font-semibold">New</span>
              {/* :::name */}
              <h3 className="text-2xl font-playfair tracking-wide leading-relaxed antialiased">Dresses</h3>
            </div>
          </a>
        </div>
        
        
        
        {/* :CATEGORY 5 -> TALL, RIGHT */}
        <div className="order-5 lg:row-span-2 col-span-full sm:col-span-1 relative shadow rounded-md overflow-hidden bg-blue-800 filter hover:shadow-lg hover:brightness-125">
          <a href="#link" className="py-5 px-5 block w-full h-full">
            {/* ::Background Picture */}
            <div>
              {/* :::picture */}
              <img src="https://fancytailwind.com/static/model-man2-81cb793bea6706ced7de0972a24bfa99.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              {/* :::overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 opacity-50" />
            </div>
            {/* ::Category Infos */}
            <div className="relative h-full flex flex-col justify-between items-start space-y-10 text-white">
              {/* :::badge tag */}
              <span className="inline-flex justify-center items-center py-1 px-3 border-none rounded bg-white bg-opacity-30 text-xs text-white font-semibold">Popular</span>
              {/* :::name */}
              <h3 className="text-3xl font-playfair tracking-wider leading-relaxed antialiased">
                <span className="block">Men</span>
                <span className="block">Collection</span>
              </h3>
            </div>
          </a>
        </div>

      </div>
    </div>
    )
}


function ProductLists() {
    
    return (
        <div class="bg-white">
            <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 class="text-2xl font-extrabold tracking-tight text-gray-900">Customers also purchased</h2>

                <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    <TShirt num={1} />
                    <TShirt num={2} />
                    <TShirt num={3} />
                    <TShirt num={4} />
                </div>
            </div>
        </div>
    )             
}

const StartingSection = () => {
    const { isAuth } = useContext(BackendContext);
    if (!isAuth) {
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
}

export default function Home() {
    return (
        <>
            <HomePageHeader/>
            <ProductLists />
            {/* <CarouselOfPosters data={Posters} /> */}
            <StartingSection />

        </>
    );
}