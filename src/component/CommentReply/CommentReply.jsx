import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentReply = ({ content, user_id, isAuther }) => {
  const [commentUserData, setCommentUserData] = useState({
    username: "piggy",
    profile_picture:
      "https://megapx-assets.dcard.tw/images/c3bb80c5-2fd9-42e4-9310-d61ef38473e2/640.jpeg",
  });
  const getCommentUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/${user_id}`);
      setCommentUserData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex">
        <div className="d-flex align-items-center gap-2 me-5">
          <img
            className="avatar object-fit-cover rounded-pill"
            src={commentUserData.profile_picture}
            alt="avatar"
          />
          <a href="#">{commentUserData.username}</a>
          {isAuther && <span className="text-gray">作者</span>}
        </div>
        <a href="#" className="d-flex align-items-center text-primary gap-1">
          <span className="material-symbols-outlined icon-fill fs-6">
            favorite
          </span>
        </a>
      </div>
      <p>{content}</p>
    </div>
  );
};

export default CommentReply;
