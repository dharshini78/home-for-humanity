import React from 'react';
import { FaCircleArrowRight } from 'react-icons/fa6';
import Navbar from '../Features/navbar';

const Login = () => {
  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
        <h2 className="text-2xl mb-8">Login to your admin account</h2>
        <form>
          <input type="email" placeholder="Email" className="w-full p-2 mb-4 border border-gray-300 rounded" />
          <input type="password" placeholder="Password" className="w-full p-2 mb-4 border border-gray-300 rounded" />
          <div className="text-center mb-5">
            <a href="#" className="text-gray-[#3A3A3A] underline text-sm">Forgot password?</a>
          </div>
          <div className='flex justify-center items-center'>
          <button type="submit" className="w-[9rem] p-2 bg-gray-200 border-none rounded flex justify-center items-center">
            Login <FaCircleArrowRight className="ml-2" />
          </button>
          </div>
      
        </form>
        <div className="flex mt-4 justify-center items-center gap-1">
          <p className='text-gray-[#3A3A3A] text-sm'>Don't have an account?</p>
          <a href="#" className="text-gray-[#3A3A3A] underline text-sm">Register</a>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
