// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Package, RefreshCw, Search, ArrowRight, Tag } from 'lucide-react';
// import Layout from '../components/Layout/Layout';

// const Home: React.FC = () => {
//   return (
//     <Layout>
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
//         {/* Hero Section */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
//               Welcome to{' '}
//               <span className="text-orange-700">Relamp Digital</span>
//             </h1>
//             <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//               Streamline your E-commerce shopping experience with our comprehensive management system.
//               Check current offers and coupons , track best available deals across all platforms, and track things all in one place.
//             </p>
//           </div>

//           {/* <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8 mt-1">
//             {[

//               // {
//               //   title: "Active Deals",
//               //   desc: "Explore current active deals and special offers. Find the best opportunities.",
//               //   iconBg: "bg-orange-100",
//               //   iconColor: "text-orange-600",
//               //   icon: Tag,
//               //   btnColor: "bg-orange-500 hover:bg-orange-600",
//               //   link: "/activedeals",
//               //   btnText: "View Deals",
//               // },
              
//               {
//                 title: "Login To Track Order",
                
//                 desc: "Track the status of your order or refund request. View timeline and get real-time updates.",
//                 iconBg: "bg-purple-100",
//                 iconColor: "text-purple-600",
//                 icon: Search,
//                 btnColor: "bg-orange-700 hover:bg-blue-700",
//                 link: "/login",
//                 btnText: "LOGIN",
//               },
//             ].map((card, index) => (
//               <div
//                 key={index}
//                 className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col justify-between"
//               >
//                 <div>
//                   <div
//                     className={`flex items-center justify-center w-4 h-4 ${card.iconBg} rounded-full mb-6 mx-auto`}
//                   >
//                     <card.icon className={`h-8 w-8 ${card.iconColor}`} />
//                   </div>
//                   <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
//                     {card.title}
//                   </h3>
//                   <p className="text-gray-600 text-center mb-6">{card.desc}</p>
//                 </div>
//                 <Link
//                   to={card.link}
//                   className={`w-full ${card.btnColor} text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
//                 >
//                   <span>{card.btnText}</span>
//                   <ArrowRight className="h-4 w-4" />
//                 </Link>
//               </div>
//             ))}
//           </div> */}

// {/* Parent Container: Centers the card */}
// <div className="flex justify-center items-center w-full mt- px-4">
  
//   {/* The Card Itself */}
//   <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col justify-between w-full max-w-md min-h-[400px]">
    
//     {/* Card Content (Top) */}
//     <div>
//       <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto">
//         <Search className="h-8 w-8 text-purple-600" />
//       </div>
      
//       <h3 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
//         Login To Track Order
//       </h3>
      
//       <p className="text-gray-600-3xl text-center mb-3">
//         Track the status of your tickets. View timeline and get real-time updates.
//       </p>
//     </div>

//     {/* Card Button (Bottom) */}
//     <Link
//       to="/login"
//       className="w-full bg-orange-700 hover:bg-orange-500 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
//     >
//       <span>LOGIN</span>
//       <ArrowRight className="h-4 w-4" />
//     </Link>

//   </div>
// </div>
//           {/* Features Section */}
//           <div className="mt-20">
//             <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
//               Why Choose Relamp Digital?
//             </h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Tag className="h-6 w-6 text-orange-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Deals</h3>
//                 <p className="text-gray-600">Access to special offers</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Package className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Process</h3>
//                 <p className="text-gray-600">Guaranteed working coupons</p>
//               </div>

//               <div className="text-center">
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <RefreshCw className="h-6 w-6 text-green-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Deals</h3>
//                 <p className="text-gray-600">Trusted Deals and offers</p>
//               </div>
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//                   <Search className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>

//                 <p className="text-gray-600">Track Best Coupons and deals  </p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats Section (Optional) */}
//           <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//               <div>
//                 <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
               
//                 <div className="text-gray-600">Coupons</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
//                 <div className="text-gray-600"> Deals</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
//                 <div className="text-gray-600">Success Rate</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
//                 <div className="text-gray-600">Support</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Home;

//all buttons
// @ -0,0 +1,158 @@
import React from 'react';
import { Link } from 'react-router-dom';
import { Package, RefreshCw, Search, ArrowRight, Tag } from 'lucide-react';
import Layout from '../components/Layout/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="text-orange-600">Relamp Digital</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your order and reimbursement process with our comprehensive management system.
              Check Active Deals, Submit orders, request refunds, and track your submissions all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[

              // {
              //   title: "Active Deals",
              //   desc: "Explore current active deals and special offers. Find the best opportunities.",
              //   iconBg: "bg-orange-100",
              //   iconColor: "text-orange-600",
              //   icon: Tag,
              //   btnColor: "bg-orange-500 hover:bg-orange-600",
              //   link: "/activedeals",
              //   btnText: "View Deals",
              // },
              {
                title: "Submit Order",
                desc: "Submit a new order with all required details and supporting documents.",
                iconBg: "bg-blue-100",
                iconColor: "text-orange-600",
                icon: Package,
                btnColor: "bg-orange-600 hover:bg-orange-700",
                link: "/order",
                btnText: "Submit Order",
              },
              {
                title: "Request Refund",
                desc: "Already have an order? Request a refund by providing your order number and refund details.",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                icon: RefreshCw,
                btnColor: "bg-orange-600 hover:bg-orange-700",
                link: "/refund",
                btnText: "Request Refund",
              },
              {
                title: "Track Order",
                desc: "Track the status of your order or refund request. View timeline and get real-time updates.",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                icon: Search,
                btnColor: "bg-orange-600 hover:bg-orange-700",
                link: "/track",
                btnText: "Track Order",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`flex items-center justify-center w-16 h-16 ${card.iconBg} rounded-full mb-6 mx-auto`}
                  >
                    <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">{card.desc}</p>
                </div>
                <Link
                  to={card.link}
                  className={`w-full ${card.btnColor} text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2`}
                >
                  <span>{card.btnText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose Relamp Digital?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Tag className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Deals</h3>
                <p className="text-gray-600">Access to special offers and promotions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Order Submission</h3>
                <p className="text-gray-600">Simple form with file upload support</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Refund Process</h3>
                <p className="text-gray-600">Streamlined refund request workflow</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">Track your orders with detailed timeline</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Section (Optional) */}
          <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Orders Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                <div className="text-gray-600">Active Deals</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;