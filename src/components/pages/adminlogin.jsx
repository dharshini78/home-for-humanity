import React from 'react';
import { FaCircleArrowRight } from 'react-icons/fa6';
import Navbar from '../Features/navbar';

const Login = () => {
  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-center mt-[-9rem]">
        <h2 className="ff-xl mb-8">Login to your account</h2>
        <form>
          <input type="email" placeholder="Email" className="w-full p-2 mb-4 border border-gray-300 rounded text-smm" />
          <input type="password" placeholder="Password" className="w-full p-2 mb-4 border border-gray-300 rounded text-smm" />
          <div className="text-center mb-5">
            <a href="#" className="text-gray-[#3A3A3A] underline text-smm">Forgot password?</a>
          </div>
          <div className='flex justify-center items-center'>
          <button type="submit" className="w-[9rem] p-2 bg-gray-200 border-none rounded flex justify-center items-center text-smm">
            Login <FaCircleArrowRight className="ml-2" />
          </button>
          </div>
      
        </form>
        {/* <div className="flex mt-4 justify-center items-center gap-1 text-smm">
          <p className='text-gray-[#3A3A3A] text-smm'>Don't have an account?</p>
          <a href="/user/signup" className="text-gray-[#3A3A3A] underline text-smm">Register</a>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default Login;
