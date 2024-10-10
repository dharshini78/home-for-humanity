import React from 'react'
import { useState } from 'react';
import {Link} from 'react-router-dom'



const About = () => {

    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
      setMenuOpen(!isMenuOpen);
  }
  return (
    <>
     

     <div className='p-6 flex flex-col justify-evenly leading-7'>
      <div>

      <h1 className='ff-m mb-4'>About</h1>
      <p className='ff-xl font-bold mb-8 '>At Home for Humanity, we believe that everyone deserves a safe and nurturing place to call home. Founded on the principles of compassion, community, and sustainable living, our mission is to create affordable housing solutions that empower individuals and families to thrive.</p>
      </div>

      <div>

        <h1 className='ff-m mb-4'>Our Vision</h1>
        <p className='ff-xl font-bold mb-8 '>Our vision is a world where everyone has access to quality housing that meets their needs and supports their well-being.</p>
        </div>

        <div>

        <h1 className='ff-m'>Our Mission</h1>
        <p className='ff-xl font-bold '>Our mission is a world where everyone has access to quality housing that meets their needs and supports their well-being.</p>
        </div>
     
     </div>

     <div className={`text-black bg-white w-full min-h-screen flex flex-col justify-start items-center transition-transform duration-300 ease-in-out fixed top-12 ${
          isMenuOpen ? 'translate-x-0': 'translate-x-full'
        }`}
        >


        <Link to="/" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl font-bold">Shelters</Link>
        <Link to="/about" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl font-bold">About</Link>
        <Link to="/faqs" className="underline-animation p-7 w-full flex items-center justify-start border-b border-gray-300 ff-xl font-bold">FAQs</Link>
  
       </div>
    </>
  )
}

export default About

