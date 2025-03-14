import avatar from "../../assets/images/avatar-1.png";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blog_CommentReply = ({comment, likeComment, getBlogArticle, token, postId, formatTimeAgo}) => {

  const [addReply, setAddReply] = useState("");
  const [commentId, setCommentId] =useState("");
  const [showCommentReply, setShowCommentReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false); // 控制回覆展開

  useEffect(() => {
    if (!likeComment) {
      console.warn("⚠️ likeComment 函式未傳遞，請檢查 Blog_ArticleCard.jsx");
    }
  }, [likeComment]);

  //發送留言回覆請求
  const addCommentRep = async()=>{
    try {
      const res = await axios.post(`${API_BASE_URL}/comments`,{
        post_id: postId,
        parent_comment_id:commentId,
        content: addReply,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      getBlogArticle();
      alert("發送留言回覆成功");
      console.log("發送留言回覆成功", res);
    } catch (error) {
      console.log("發送文章留言失敗",error)
    }

  }


  return (
    <div className="d-flex flex-column gap-1 py-5 mt-5 mt-md-0 border-top border-gray_light">
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
        <p className="text-gray">{formatTimeAgo(comment.created_at)}</p> {/* ✅ 顯示發言時間 */}
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
        <p className="text-gray" onClick={() => {
                  setShowCommentReply(!showCommentReply)
                  setCommentId(comment.id)
                  }}>回覆</p>
      </div>

      {/* ✅ 只顯示回覆數量，點擊才展開 */}
      {comment.replies.length > 0 && (
      <div className="text-gray" style={{ cursor: "pointer" }} onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? "隱藏回覆" : `查看 ${comment.replies.length} 則回覆`}
      </div>
      )}


      {/* 回覆輸入框 */}
      {showCommentReply && (
        <div
        className="input-group"
        onBlur={() => {
          setShowCommentReply(false);
        }}
      >
          <input
          type="text"
          className="form-control border-end-0 rounded-1"
          value={addReply}
          onChange={(e) => {
            setAddReply(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && addCommentRep()}
        />
        <span
          className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1"
          onMouseDown={(e) => {
            e.preventDefault();
            addCommentRep()
          }}>
          send
          </span>
      </div>
      )}

   
      {/* 遞迴渲染子留言 */}
      {showReplies && comment.replies.length >0 && (
         <div className="ms-4 border-start border-gray_light ps-3">
          {comment.replies.map(reply => (
              <Blog_CommentReply 
                key={reply.id} 
                comment={reply} 
                likeComment={likeComment} 
                postId= {postId}  
                getBlogArticle={getBlogArticle} 
                token={token}
                formatTimeAgo={formatTimeAgo} // ✅ 傳遞時間函式給子回覆
              />
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
    created_at: PropTypes.string
  }).isRequired,  
  likeComment: PropTypes.func, // 按讚留言
  commentLikes: PropTypes.object, // 留言按讚數對應物件
  getBlogArticle: PropTypes.func,
  token: PropTypes.string,
  postId: PropTypes.string,
  formatTimeAgo: PropTypes.func
};




export default Blog_CommentReply;
