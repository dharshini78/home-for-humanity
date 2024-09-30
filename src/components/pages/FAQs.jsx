import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { RiArrowDropDownFill } from 'react-icons/ri';
import axios from 'axios';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'Some question here',
      answer: 'Description',
    },
    {
      question: 'Few more question here',
      answer: 'Description',
    },
    {
      question: 'Few more question here',
      answer: 'Description',
    },
    {
      question: 'Few more question here',
      answer: 'Description',
    },
  
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className='p-3'>
      <h1 className='mini mb-4'>FAQs</h1>
      {faqs.map((faq, index) => (
        <div key={index} className=''>
          <button
            onClick={() => toggleFAQ(index)}
            className='w-full text-left px-4 py-[1rem] bg-gray-200 border border-gray-300 flex items-center justify-between'
          >
            {faq.question}
            <RiArrowDropDownFill className={`transition-transform ${activeIndex === index ? 'transform rotate-180' : ''}`} />
          </button>

          {activeIndex === index && (
            <div className='p-4 bg-gray-100 border border-gray-300 transition-max-height duration-300 ease-in-out max-h-screen overflow-auto'>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
      await axios.post('https://homeforhumanity.onrender.com/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  return (
    <div className='p-3'>
      <h2 className='mini mb-4'>Have any more questions?</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-gray-700'>Name</label>
          <input
            type='text'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Email</label>
          <input
            type='email'
            className='w-full px-3 py-2 border border-gray-300 rounded-lg'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Message</label>
          <textarea
            className='w-full px-3 py-2 border border-gray-300 h-[7rem] rounded-lg'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type='submit' className='w-1/2 bg-gray-800 text-white py-2 border border-gray-300'>
          Submit
        </button>
      </form>
    </div>
  );
};

const CommentModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
      await axios.post('https://homeforhumanity.onrender.com/comments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onClose();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4'>
      <div className='bg-white p-6 rounded-lg w-96 relative'>
        <button onClick={onClose} className='absolute top-2 right-2 p-4 text-gray-600 hover:text-gray-900'>
          <IoMdClose size={24} color='black' />
        </button>
        <h2 className='ff-xl font-bold mb-4'>Post Comment</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700'>Name</label>
            <input
              type='text'
              className='w-full px-3 py-2 border border-gray-300'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type='email'
              className='w-full px-3 py-2 border border-gray-300'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Message</label>
            <textarea
              className='w-full px-3 py-2 border border-gray-300 h-64'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type='submit' className='w-1/2 bg-gray-800 text-white py-2 border border-gray-300'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='p-4'>
      <FAQs />
      <ContactForm />
      {isModalOpen && <CommentModal onClose={closeModal} />}
    </div>
  );
};

export default App;
