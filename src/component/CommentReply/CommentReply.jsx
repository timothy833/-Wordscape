import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentReply = ({
  content,
  user_name,
  user_profile_picture,
  comment_id,
  isAuther,
  isCurrentUser,
  getComment,
}) => {
  const [currentComment, setCurrentComment] = useState(content);
  const [isEdit, setIsEdit] = useState(false);
  const editInputRef = useRef(null);
  
  const delComment = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/comments/${comment_id}`);
      getComment();
    } catch (error) {
      console.log(error);
    }
  };
  const putComment = async () => {
    try {
      await axios.put(`${API_BASE_URL}/comments/${comment_id}`, {
        content: currentComment,
      });
      getComment();
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = () => {
    putComment();
    setIsEdit(false);
    getComment();
  };
  useEffect(() => {
    isEdit && editInputRef?.current?.focus();
  }, [isEdit]);
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex">
        <div className="d-flex align-items-center gap-2 me-5">
          <img
            className="avatar object-fit-cover rounded-pill"
            src={user_profile_picture}
            alt="avatar"
          />
          <a href="#">{user_name}</a>
          {isAuther && <span className="text-gray">作者</span>}
        </div>
        <div className="d-flex gap-5 align-items-center">
          <a href="#" className="d-flex align-items-center text-primary gap-1">
            <span className="material-symbols-outlined icon-fill fs-6">
              favorite
            </span>
          </a>
          {isCurrentUser && (
            <div className="comment-dropdown dropdown">
              <a
                className="text-gray"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="material-symbols-outlined">more_horiz</span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEdit(true);
                    }}
                  >
                    編輯
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      delComment();
                    }}
                  >
                    刪除
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {isEdit ? (
        <div
          className="input-group"
          onBlur={() => {
            setIsEdit(false);
          }}
        >
          <input
            type="text"
            className="form-control border-end-0 rounded-1"
            value={currentComment}
            ref={editInputRef}
            onChange={(e) => {
              setCurrentComment(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleEdit()}
          />
          <span
            className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1"
            onMouseDown={(e) => {
              e.preventDefault();
              handleEdit();
            }}
          >
            send
          </span>
        </div>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};

export default CommentReply;
