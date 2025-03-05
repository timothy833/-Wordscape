import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../../node_modules/bootstrap/js/src/dropdown.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CommentBox = ({
  children,
  content,
  articleId,
  comment_id,
  replie_count,
  getComment,
  user_name,
  user_profile_picture,
  isAuther,
  hasReplie,
  isCurrentUser,
}) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [review, setReview] = useState("");
  const [showAllReview, setShowAllReview] = useState(false);
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
  const postReviewComment = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/comments`, {
        post_id: articleId,
        parent_comment_id: comment_id,
        content: review,
      });
      await getComment();
      setIsReviewOpen(false);
      setReview("");
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
    <>
      <div className="d-flex flex-column gap-3 mb-5">
        <div className="d-flex align-items-center gap-2">
          <img
            className="avatar object-fit-cover rounded-pill"
            src={user_profile_picture}
            alt="avatar"
          />
          <a href="#">{user_name}</a>
          {isAuther && <span className="text-gray">作者</span>}
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
        <div className="d-flex gap-5">
          <a href="#" className="d-flex align-items-center text-primary gap-1">
            <span className="material-symbols-outlined icon-fill fs-6">
              favorite
            </span>
            2
          </a>
          <a
            href="#"
            className={`d-flex align-items-center ${
              hasReplie ? "text-primary" : "text-gray"
            } gap-1`}
            onClick={(e) => {
              e.preventDefault();
              setIsReviewOpen(!isReviewOpen);
            }}
          >
            <span className="material-symbols-outlined icon-fill fs-6">
              chat_bubble
            </span>
            {replie_count}
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

          <a
            href="#"
            className="text-gray"
            onClick={(e) => {
              e.preventDefault();
              setIsReviewOpen(!isReviewOpen);
            }}
          >
            回覆
          </a>
        </div>
      </div>
      <div className="d-flex flex-column gap-3 ms-5 mb-5">
        {children.map((childrenItem, index) => {
          return (showAllReview || index < 2) && childrenItem;
        })}
        {isReviewOpen && (
          <div className="input-group">
            <input
              type="text"
              className="form-control border-end-0 rounded-1"
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && postReviewComment()}
            />
            <span
              className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1"
              onClick={() => {
                postReviewComment();
              }}
            >
              send
            </span>
          </div>
        )}
        {!showAllReview && replie_count > 2 && (
          <a
            href="#"
            className="text-primary"
            onClick={(e) => {
              e.preventDefault();
              setShowAllReview(true);
            }}
          >
            全部留言
          </a>
        )}
      </div>
    </>
  );
};

export default CommentBox;
