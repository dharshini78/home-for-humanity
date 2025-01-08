import React, { useState } from 'react';
import { FaCircleArrowRight } from 'react-icons/fa6';
import Navbar from '../Features/navbar';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the styles for PhoneInput

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');

  const handleInputBlur = () => {
    // Handle input blur logic if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg w-full max-w-md text-center mt-[-7rem]">
          <h2 className="ff-xl mb-8">Create your account</h2>
          <form onSubmit={handleSubmit}>
            <input
              required
              onBlur={handleInputBlur}
              type="text"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-smm"
              value={name}
              onChange={(event) => {
                const newValue = event.target.value;
                if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
                  setName(newValue);
                }
              }}
              placeholder="Name"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-smm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-smm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='input-cont mb-4'>
              <PhoneInput
                required
                className='w-full p-2 border border-gray-300 rounded text-smm'
                value={mobile}
                onChange={setMobile}
                placeholder='Mobile'
                defaultCountry='IN'
                inputClassName='w-full p-2 border border-gray-300 rounded text-smm'
                countrySelectClassName='w-10 h-10 flex items-center justify-center'
                buttonClassName='w-10 h-10 flex items-center justify-center'
              />
            </div>
            {/* <input
              required
              type="text"
              placeholder="Country"
              className="w-full p-2 mb-4 border border-gray-300 rounded text-smm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            /> */}
            <div className='flex justify-center items-center'>
              <button type="submit" className="w-[9rem] p-2 bg-gray-200 border-none rounded flex justify-center items-center text-smm">
                Signup <FaCircleArrowRight className="ml-2" />
              </button>
            </div>
          </form>
          <div className="flex mt-4 justify-center items-center gap-1">
            <p className='text-gray-[#3A3A3A] text-smm'>Already have an account?</p>
            <a href="/user/login" className="text-gray-[#3A3A3A] underline text-smm">Login</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
