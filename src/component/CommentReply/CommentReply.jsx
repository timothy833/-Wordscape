import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentReply = ({
  commentData,
  isAuther,
  isCurrentUser,
  getComment,
  loginUserId,
  isAuthorized,
}) => {
  const [commentLikeData, setCommentLikeData] = useState(null);
  const [currentComment, setCurrentComment] = useState(commentData.content);
  const [isEdit, setIsEdit] = useState(false);
  const editInputRef = useRef(null);

  const delComment = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentData.id}`);
      getComment();
    } catch (error) {
      console.log(error);
    }
  };
  const putComment = async () => {
    try {
      await axios.put(`${API_BASE_URL}/comments/${commentData.id}`, {
        content: currentComment,
      });
      getComment();
    } catch (error) {
      console.log(error);
    }
  };
  const getCommentLikeData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/comments/comment_likes/${commentData.id}`
      );
      setCommentLikeData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const postCommentLike = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/comments/comment_likes/${commentData.id}`
      );
      getComment();
      getCommentLikeData();
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
    getCommentLikeData();
  }, []);
  useEffect(() => {
    isEdit && editInputRef?.current?.focus();
  }, [isEdit]);
  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex">
        <Link
          to={`/blog/:${commentData.user_id}`}
          className="d-flex align-items-center gap-2 me-5"
        >
          <img
            className="avatar object-fit-cover rounded-pill"
            src={
              commentData.profile_picture ||
              "https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/695229fa8c60c474d3d9dc0d60b25f9539ac74d9/default-avatar.svg"
            }
            alt="avatar"
          />
          <span>{commentData.user_name}</span>
          {isAuther && <span className="text-gray">作者</span>}
        </Link>
        <div className="d-flex gap-5 align-items-center">
          <a
            href="#"
            className={`d-flex align-items-center user-select-none pe-open ${
              commentLikeData?.some(
                (LikeDataItem) => LikeDataItem.user_id === loginUserId
              )
                ? "text-primary"
                : "text-gray"
            } gap-1`}
            onClick={(e) => {
              e.preventDefault();
              isAuthorized ? postCommentLike() : alert("請先登入");
            }}
          >
            <span className="material-symbols-outlined icon-fill fs-6">
              favorite
            </span>
            {commentData.likes_count}
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
        <p>{commentData.content}</p>
      )}
    </div>
  );
};

export default CommentReply;
