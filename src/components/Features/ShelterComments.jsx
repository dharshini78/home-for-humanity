import React, { useEffect, useState } from "react";
import axios from 'axios';
import CommentModal from './CommentModal';

const ShelterComments = ({ shelterId }) => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://homeforhumanity.onrender.com/comments?shelterId=${shelterId}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [shelterId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal} className="bg-blue-500 text-white py-2 px-4 rounded">
        Post Comment
      </button>
      {isModalOpen && <CommentModal onClose={closeModal} shelterId={shelterId} />}
      <div>
        {comments.map((comment, index) => (
          <div key={index} className="border p-4 mb-4">
            <h3 className="font-bold">{comment.name}</h3>
            <p>{comment.message}</p>
            {comment.filePaths.map((filePath, idx) => (
              <img key={idx} src={filePath} alt={`Upload ${idx}`} className="mt-2" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShelterComments;
