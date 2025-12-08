import React from 'react';
import { Link } from 'react-router-dom';
import { Package, RefreshCw, Search, ArrowRight, Tag, User, ShieldCheck, Users } from 'lucide-react';
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
              <span className="text-blue-600">Hawk Agency</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your order and refund process with our comprehensive management system.
              Check Active Deals, Submit orders, request refunds, and track your submissions all in one place.
            </p>
          </div>

          {/* SINGLE BIG USER CARD SECTION */}
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 transform transition-all hover:shadow-2xl">
              <div className="p-10">
                {/* Icon */}
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                
                {/* Content */}
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                  User Portal
                </h2>
                <p className="text-gray-600 text-center mb-8 text-lg">
                  Log in to submit new orders, upload proof of purchase, request refunds, and track your personal status in real-time.
                </p>

                {/* Primary Action Button */}
                <Link
                  to="/user"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/30"
                >
                  <span>Login to Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>

                {/* Divider for Secondary Logins */}
                <div className="relative mt-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Staff & Partners</span>
                  </div>
                </div>

                {/* Secondary Links (Mediator/Admin) */}
                <div className="mt-6 flex justify-center space-x-6">
                  <Link to="/mediator" className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    <Users className="h-4 w-4 mr-1" />
                    Mediator Access
                  </Link>
                  <Link to="/seller" className="flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Admin Access
                  </Link>
                </div>

              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose Hawk Agency?
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