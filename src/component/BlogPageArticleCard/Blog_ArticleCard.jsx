// import articleImg from "../../assets/images/article/article-thumbnail-1.jpeg";
import PropTypes from "prop-types";
import Blog_CommentReply from "../BlogPageCommentReply/Blog_CommentReply";
import axios from "axios";
import { useEffect,useState} from "react";
// import EditPostModal from "../../page/BlogPage/EditPostModal"
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blog_ArticleCard = ({ article, comments, togglePin, isPinned, likePost, token, getBlogArticle, onEdit, isAuthor}) => {
  const [addcontent, setAddContent] = useState("");
  const [articleId, setArticleId] =useState("");
  const [showArticleReply, setShowArticleReply] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    if (!likePost) {
      console.warn("⚠️ likePost 函式未傳遞，請檢查 BlogHome.jsx");
    }
  }, [likePost]);

   // ✅ 確保留言按照時間排序（最新留言在最前）
   const sortedComments = [...comments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // 🔥 計算該文章的留言總數（包含回覆）
   const countTotalComments = (commentsList) => {
    let count = 0;
    const countReplies = () => {
      count++; //計算這則留言
      // comment.replies.forEach(countReplies); //遞迴計算回覆
    }
    commentsList.forEach(countReplies);
    return count;
   }

  // ✅ 顯示距離現在多久
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffMs = now - createdAt;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    return diffDays > 0 ? `${diffDays} 天前` : diffHours > 0 ? `${diffHours} 小時前` : "剛剛";
  };


   // 🔥 留言按讚功能（只影響該文章內部）
  const likeComment = (commentId) => {
    axios.post(`${API_BASE_URL}/comments/comment_likes/${commentId}`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(( )=> {
          console.log("留言按讚成功")
          getBlogArticle();
        })
      .catch(error => console.error("留言按讚失敗", error));


  };

  // 文章刪除modal功能
  const articleDelete = async(post_id)=> {
    try {
      const res  = await axios.delete(`${API_BASE_URL}/posts/${post_id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("文章刪除成功", res);
      getBlogArticle();
      alert("文章刪除成功");
    } catch (error) {
      console.error("文章刪除失敗", error);
    }
  }

  //切換文章發布狀態
  const toggleStatus = async (article) => {
    try {
      const newStatus = article.status === "published" ? "draft" : "published";
      await axios.put(`${API_BASE_URL}/posts/${article.id}/status`, { status: newStatus },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      // 重新獲取文章
      getBlogArticle();
    } catch (error) {
      console.error("狀態切換失敗:", error);
    }
  };



  //發送文章留言請求
  const addArticleRep = async()=>{
    try {
      const res = await axios.post(`${API_BASE_URL}/comments`,{
        post_id :articleId,
        content: addcontent
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      getBlogArticle();
      alert("發送文章留言成功");
      console.log("發送文章留言成功", res);
    } catch (error) {
      console.log("發送文章留言失敗",error)
    }

  }


  return (
    <>
      <div className="blog_articleCard card border-gray_light px-3 pt-3 mb-5 rounded-3">
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-lg-8">
            <div className="card-body p-0">
              <h5 className="card-title text-truncate-2lines fw-bold mb-3 text-primary">
                {article.title}
              </h5>
              <p className="card-text mb-5 text-truncate-2lines">
                {article.description}
              </p>
              <Link to={`/article/${article.id}`} className=" text-gray blog-card-link">
                (繼續閱讀...)
              </Link>
              <div className="blogArticleCardFooter d-flex justify-content-between justify-content-md-start align-items-center gap-3">
                <p className="text-gray">{new Date(article.created_at).toLocaleString("zh-TW")}</p>
                
                {/* 🔥 文章按讚功能 */}
                <div className="d-flex text-gray gap-1" onClick={() => likePost(article.id)} style={{ cursor: "pointer" }}>
                  <p>{article.likes_count}</p>
                  <span className="material-symbols-outlined">
                    favorite
                  </span>
                </div>

                 {/* 🔥 顯示該文章的留言總數 */}
                <div className="d-flex text-gray gap-1" >
                  <p>{countTotalComments(comments)}</p>
                  <span className="material-symbols-outlined">
                    chat_bubble
                  </span>
                </div>

                <p className="text-gray" style={{ cursor: "pointer" }} onClick={() => {
                  setShowArticleReply(!showArticleReply)
                  setArticleId(article.id)
                  }}>
                  回覆
                </p>

                {/* 釘選按鈕 */}
                {isAuthor&& (<i className={`bi bi-pin-fill text-primary fs-6 ${isPinned ? "text-warning" : "text-primary"}`}
                   onClick={()=> togglePin(article.id)}
                   style={{cursor: "pointer"}}
                ></i>)}

                
                {isAuthor && (<div className="">
                  <i className="bi bi-three-dots text-gray fs-6" id="dropdownMenuButton1" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                  <ul className="dropdown-menu dropdown-menu-end py-3 px-5 shadow-sm border">
                    <li className="dropdown-item" onClick={()=> onEdit(article)} style={{ cursor: "pointer" }}>編輯</li>
                    <li className="dropdown-item" onClick={() => toggleStatus(article)} style={{ cursor: "pointer" }} > {article.status === "published" ? "取消發布" : "發布文章"}</li>
                    <li className="dropdown-item" onClick={()=>articleDelete(article.id)} style={{ cursor: "pointer" }}>刪除</li>
                  </ul>
                </div>)}
              </div>
               {/* （點擊展開所有留言） */}
              <div className="text-gray" style={{ cursor: "pointer" }} onClick={() => setShowAllComments(!showAllComments)}>
                {showAllComments ? "隱藏留言" : `查看 ${sortedComments.length} 則留言`}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <img
              src={article.image_url}
              className="card-img-top rounded-1 mb-5"
              alt="articleImg"
            />
          </div>

          {/* 回覆輸入框 */}
          {showArticleReply && (
            <div
            className="input-group"
            onBlur={() => {
              setShowArticleReply(false);
            }}
          >
              <input
              type="text"
              className="form-control border-end-0 rounded-1"
              value={addcontent}
              onChange={(e) => {
                setAddContent(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && addArticleRep()}
            />
            <span
              className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1"
              onMouseDown={(e) => {
                e.preventDefault();
                addArticleRep()
              }}>
              send
              </span>
          </div>
          )}
        </div>

       

         {/* 🔥 渲染留言（傳遞 `likeComment` 給留言組件） ✅ 只顯示最新留言，點擊留言數量圖標才展開  */}
        { (showAllComments ? sortedComments : sortedComments.slice(0, 1)).map(comment =>(
          <Blog_CommentReply 
            key={comment.id} 
            comment={comment} 
            likeComment={likeComment} 
            postId= {comment.post_id}  
            getBlogArticle={getBlogArticle} 
            token={token} 
            formatTimeAgo={formatTimeAgo} // ✅ 傳入格式化時間函式  
          />
        ))}
      </div>



    </>
  );
};

// ✅ 定義 PropTypes，確保 `children` 是 React 可渲染的內容
Blog_ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string, // 選填
    likes_count: PropTypes.string,
    image_url:PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      user_name: PropTypes.string.isRequired,
      profile_picture: PropTypes.string,
      replies: PropTypes.arrayOf(PropTypes.object),
    })
  ),
  togglePin: PropTypes.func.isRequired,
  isPinned: PropTypes.bool.isRequired,
  likePost: PropTypes.func,
  token: PropTypes.string,
  getBlogArticle: PropTypes.func,
  onEdit: PropTypes.func,
  isAuthor:PropTypes.bool
}


export default Blog_ArticleCard;
