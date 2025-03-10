import avatar from "../../assets/images/avatar-1.png";
import PropTypes from "prop-types";
import { useEffect } from "react";
const Blog_CommentReply = ({comment, likeComment }) => {

  useEffect(() => {
    if (!likeComment) {
      console.warn("⚠️ likeComment 函式未傳遞，請檢查 Blog_ArticleCard.jsx");
    }
  }, [likeComment]);

  return (
    <div className="d-flex flex-column gap-3 py-5 mt-5 mt-md-0 border-top border-gray_light">
      {/* 顯示留言者資訊 */}
      <div className="d-flex">
        <div className="d-flex align-items-center gap-2">
          <img className="avatar rounded-circle border" src={comment.profile_picture ||avatar} alt="avatar" />
          <a href="#">{comment.user_name}</a>
        </div>
      </div>
      {/* 顯示留言內容 */}
      <p>{comment.content}</p>
      {/*按讚、留言等互動按鈕 */}
      <div className="d-flex align-items-center gap-5">
        <div className="d-flex text-primary gap-1" onClick={() => likeComment(comment.id)} style={{ cursor: "pointer" }}>
          <span className="material-symbols-outlined">
            favorite
          </span>
          <p>{comment.likes_count}</p>
        </div>
        <div className="d-flex text-gray gap-1">
          <span className="material-symbols-outlined">
            chat_bubble
          </span>
          <p>{comment.replies.length}</p>
        </div>
        <p className="text-gray">回覆</p>
      </div>

      {/* 遞迴渲染子留言 */}
      {comment.replies.length >0 && (
         <div className="ms-4 border-start border-gray_light ps-3">
          {comment.replies.map(reply => (
              <Blog_CommentReply key={reply.id} comment={reply} likeComment={likeComment}/>
            )
          )}
         </div>
      )}

    </div>
  );
};

Blog_CommentReply.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user_name: PropTypes.string.isRequired,
    profile_picture: PropTypes.string,
    likes_count: PropTypes.string,
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,  
  likeComment: PropTypes.func, // 按讚留言
  commentLikes: PropTypes.object, // 留言按讚數對應物件
};




export default Blog_CommentReply;
