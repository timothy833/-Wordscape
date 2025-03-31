// import articleImg from "../../assets/images/article/article-thumbnail-1.jpeg";
import PropTypes from "prop-types";
import Blog_CommentReply from "../BlogPageCommentReply/Blog_CommentReply";
import axios from "axios";
import { useEffect,useState} from "react";
// import EditPostModal from "../../page/BlogPage/EditPostModal"
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { alertDeletePost, alertMsgForAdminInfo, alertReply } from "../../utils/alertMsg"
import Swal from "sweetalert2";
import { logError } from "../../utils/sentryHelper";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useMediaQuery = (query) => {
  // window.matchMedia(query).matches 瀏覽器內建查詢CSS符不符合標準
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", documentChangeHandler);
    return () => mediaQueryList.removeEventListener("change", documentChangeHandler);
  }, [query]);

  return matches;
};


const Blog_ArticleCard = ({ article, comments, togglePin, isPinned, token, getBlogArticle, onEdit, isAuthor, userId, setIsLoading, }) => {
  const [addcontent, setAddContent] = useState("");
  const [articleId, setArticleId] =useState("");
  const [showArticleReply, setShowArticleReply] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isGood, setIsGood] = useState(false);
  
  //取得文章是否按讚狀態
  // 🔥 檢查登入者是否已按讚
  const checkLikeStatus = async (postId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/posts/post_likes/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 從回傳資料中檢查當前使用者是否有在按讚者列表內
      const hasLiked = res.data.data.some(user => user.id === userId);
      setIsGood(hasLiked); // 如果有按讚則為 true，否則 false
    } catch (error) {
      logError("檢查按讚狀態失敗", error);
    }
  };

  // 🔥 當組件掛載時，檢查當前使用者是否已按讚
  useEffect(() => {
    checkLikeStatus(article.id);
  }, [article.id]); 


  //文章內容按讚
  const likePost = async (postId) => {
    const res =  await axios.post(`${API_BASE_URL}/posts/post_likes/${postId}`,{}, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
    if(res.data.liked === true){
      setIsGood(true);
    }else{
      setIsGood(false);
    }

    getBlogArticle(); 
  };

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



  // 文章刪除modal功能
  const articleDelete = async(post_id)=> {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/posts/${post_id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setIsLoading(false);
      Swal.fire(alertDeletePost);
      getBlogArticle();
      
    } catch (error) {
      logError("文章刪除失敗", error);
    }
  }

  //切換文章發布狀態
  const toggleStatus = async (article) => {
    try {
      setIsLoading(true);
      const newStatus = article.status === "published" ? "draft" : "published";
      await axios.put(`${API_BASE_URL}/posts/${article.id}/status`, { status: newStatus },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setIsLoading(false);
      Swal.fire(alertMsgForAdminInfo);
      // 重新獲取文章
      getBlogArticle();
    } catch (error) {
      logError("狀態切換失敗:", error);
    }
  };



  //發送文章留言請求
  const addArticleRep = async()=>{
    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/comments`,{
        post_id :articleId,
        content: addcontent
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setIsLoading(false);
      Swal.fire(alertReply);
      getBlogArticle();
  
    
    } catch (error) {
      logError("發送文章留言失敗",error)
    }

  }


  return (
    <>
      <div className="blog_articleCard card border-gray_light px-3 pt-3 mb-5 rounded-3">
        <div className="row flex-column flex-lg-row">
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
              <div className={`blogArticleCardFooter d-flex justify-content-between justify-content-md-start align-items-center ${isMobile ? "gap-1": "gap-3"}`}>
                <p className="text-gray">
                {isMobile
                ? dayjs(article.created_at).format("MM/DD HH:mm") // 行動版
                : dayjs(article.created_at).format("YYYY/MM/DD HH:mm:ss")} {/* 桌機版 */}
                </p>
                
                {/* 🔥 文章按讚功能 */}
                <div className={`d-flex gap-1  ${isGood ? "text-primary" : "text-gray"}`} onClick={() => {
                  likePost(article.id)
                  }} style={{ cursor: "pointer" }}>
                  <span className="material-symbols-outlined">
                    favorite
                  </span>
                  <p>{article.likes_count}</p>
                </div>

                 {/* 🔥 顯示該文章的留言總數 */}
                <div className="d-flex text-gray gap-1" >
                  <span className="material-symbols-outlined">
                    chat_bubble
                  </span>
                  <p>{countTotalComments(comments)}</p>
                </div>

                {userId &&(<p className="text-gray hover-effect"  onClick={() => {
                  setShowArticleReply(!showArticleReply)
                  setArticleId(article.id)
                  }}>
                  回覆
                </p>)}

                {/* 釘選按鈕 */}
                {isAuthor && (<i className={`bi bi-pin-fill fs-6 ${isPinned ? "text-primary" : "text-gray"}`}
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
              {sortedComments.length > 1 && (<div className="text-gray hover-effect" style={{ cursor: "pointer" }} onClick={() => setShowAllComments(!showAllComments)}>
                {showAllComments? "隱藏留言" : `查看 ${sortedComments.length} 則留言`}
              </div>)}
            </div>
          </div>
          <div className="col-lg-4">
            <img
              src={article.image_url}
              className="card-img-top rounded-3 mb-5"
              alt="articleImg"
            />
          </div>

          {/* 回覆輸入框 */}
          {showArticleReply && (
            <div
            className="input-group mb-2"
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
              className="material-symbols-outlined input-group-text border-start-0 bg-light text-primary icon-fill fs-6 rounded-1 btn-click"
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
            postId= {comment.post_id}  
            getBlogArticle={getBlogArticle} 
            token={token} 
            formatTimeAgo={formatTimeAgo}   // ✅ 傳入格式化時間函式  
            isAuthor={isAuthor}
            userId={userId}
            setIsLoading={setIsLoading}
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
  token: PropTypes.string,
  getBlogArticle: PropTypes.func,
  onEdit: PropTypes.func,
  isAuthor:PropTypes.bool,
  userId: PropTypes.string,
  setIsLoading: PropTypes.func,
}


export default Blog_ArticleCard;
