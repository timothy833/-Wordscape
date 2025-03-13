// import articleImg from "../../assets/images/article/article-thumbnail-1.jpeg";
import PropTypes from "prop-types";
import Blog_CommentReply from "../BlogPageCommentReply/Blog_CommentReply";
import axios from "axios";
import { useEffect} from "react";
// import EditPostModal from "../../page/BlogPage/EditPostModal"
import { Link } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blog_ArticleCard = ({ article, comments, togglePin, isPinned, likePost, token, getBlogArticle, onEdit, isAuthor}) => {

//  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (!likePost) {
      console.warn("⚠️ likePost 函式未傳遞，請檢查 BlogHome.jsx");
    }
  }, [likePost]);

  // 🔥 計算該文章的留言總數（包含回覆）
   const countTotalComments = (commentsList) => {
    let count = 0;
    const countReplies = (comment) => {
      count++; //計算這則留言
      comment.replies.forEach(countReplies); //遞迴計算回覆
    }
    commentsList.forEach(countReplies);
    return count;
   }

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

  return (
    <>
      <div className="blog_articleCard card border-gray_light px-3 pt-3 mb-5 rounded-3">
        <div className="row flex-column-reverse flex-lg-row">
          <div className="col-lg-8">
            <div className="card-body p-0">
              <Link to={`/article/${article.id}`}>
                <h3 className="card-title text-truncate-2lines fw-bold mb-3 text-primary">
                  {article.title}
                </h3>
              </Link>
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
                <div className="d-flex text-gray gap-1">
                  {/* 🔥 顯示該文章的留言總數 */}
                  <p>{countTotalComments(comments)}</p>
                  <span className="material-symbols-outlined">
                    chat_bubble
                  </span>
                </div>

                {/* 釘選按鈕 */}
                {isAuthor&& (<i className={`bi bi-pin-fill fs-6 ${isPinned ? "text-primary" : "text-gray"}`}
                   onClick={()=> togglePin(article.id)}
                   style={{cursor: "pointer"}}
                ></i>)}

                {isAuthor && (<div className="">
                  <i className="bi bi-three-dots text-gray fs-6" id="dropdownMenuButton1" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}></i>
                  <ul className="dropdown-menu dropdown-menu-end py-3 px-5 shadow-sm border">
                    <li className="dropdown-item" onClick={()=> onEdit(article)} >編輯</li>
                    <li className="dropdown-item" onClick={() => toggleStatus(article)} > {article.status === "published" ? "取消發布" : "發布文章"}</li>
                    <li className="dropdown-item" onClick={()=>articleDelete(article.id)}>刪除</li>
                  </ul>
                </div>)}
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <img
              src={article.image_url}
              className="card-img-top rounded-3 mb-5"
              alt="articleImg"
            />
          </div>
        </div>

         {/* 🔥 渲染留言（傳遞 `likeComment` 給留言組件） */}
        {comments.map(comment =>(
          <Blog_CommentReply key={comment.id} comment={comment} likeComment={likeComment}  />
        ))}
      </div>

      {/* ✅ 彈出編輯 Modal */} 
      {/* {selectedArticle && <EditPostModal article={selectedArticle} token={token} getBlogArticle={getBlogArticle}/>} */}
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
