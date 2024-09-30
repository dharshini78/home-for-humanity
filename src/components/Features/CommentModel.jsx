// import React, { useEffect, useState } from "react";
// import axios from 'axios';

// const CommentModal = ({ onClose, shelterId }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [files, setFiles] = useState([]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('name', name);
//     formData.append('email', email);
//     formData.append('comments', message);
//     formData.append('shelterId', shelterId);
//     files.forEach(file => {
//       formData.append('files', file);
//     });

//     try {
//       await axios.post('https://api.homeforhumanity.xrvizion.com/shelter/updatecomments', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       onClose();
//     } catch (error) {
//       console.error('Error posting comment:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-6 rounded-lg w-96">
//         <h2 className="text-lg font-bold mb-4">Post a Comment</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full mb-2 p-2 border rounded"
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full mb-2 p-2 border rounded"
//             required
//           />
//           <textarea
//             placeholder="Comment"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             className="w-full mb-2 p-2 border rounded"
//             required
//           />
//           <input
//             type="file"
//             onChange={(e) => setFiles([...e.target.files])}
//             className="w-full mb-2 p-2 border rounded"
//             multiple
//           />
//           <div className="flex justify-end">
//             <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
//             <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const ShelterComments = ({ shelterId }) => {
//   const [comments, setComments] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(`https://api.homeforhumanity.xrvizion.com/shelter/comments?shelterId=${shelterId}`);
//         setComments(response.data);
//       } catch (error) {
//         console.error('Error fetching comments:', error);
//       }
//     };

//     fetchComments();
//   }, [shelterId]);

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <div>
//       <button onClick={openModal} className="bg-blue-500 text-white py-2 px-4 rounded">
//         Post Comment
//       </button>
//       {isModalOpen && <CommentModal onClose={closeModal} shelterId={shelterId} />}
//       <div>
//         {comments.map((comment, index) => (
//           <div key={index} className="border p-4 mb-4">
//             <h3 className="font-bold">{comment.name}</h3>
//             <p>{comment.message}</p>
//             {comment.filePaths && comment.filePaths.map((filePath, idx) => (
//               <img key={idx} src={filePath} alt={`Upload ${idx}`} className="mt-2 max-w-full h-auto" />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ShelterComments;