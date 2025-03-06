import { useEffect, useState } from "react";
import axios from "axios";
const { VITE_API_BASE_URL } = import.meta.env;
import { Link } from "react-router-dom";


const Admin_ArticleCard = () => {
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("WS_token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    (async () => {
      const token = getTokenFromCookies();
      if (!token) {
        console.log("驗證錯誤，請重新登入");
        return;
      };
      try {
        const res = await axios.get(`${VITE_API_BASE_URL}/posts/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const cancelFavorites = async (id) => {
    const token = getTokenFromCookies();
    if (!token) {
      console.log("驗證錯誤，請重新登入");
      return;
    };
    try {
      const res = await axios.post(`${VITE_API_BASE_URL}/posts/favorites/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.status === "success") {
        setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== id));
      }
      alert(res.data.status);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {favorites.length === 0 ? (
        <h3 className="mt-3 text-gray">目前沒有收藏的文章</h3>
      ) : (
        favorites.map((item) => {
          const extractFirstParagraphText = (htmlContent) => { //取得第一段的<p>內的文字
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");
            const firstParagraph = doc.querySelector("p");
            if (!firstParagraph) return "";
            return firstParagraph.textContent.trim();
          };
          const formDate = (str) => {
            const date = new Date(str);
            return date.toLocaleDateString();
          };
          return (
            <div className="admin_articleCard card border-gray_light p-3  mb-5 rounded-3" key={item.id}>
              <div className="row flex-column-reverse flex-lg-row">
                <div className="col-lg-8">
                  <div className="card-body p-0 d-flex flex-column justify-content-between h-100">
                    <div>
                      <h5>
                        <Link to={`/article/${item.id}`} className="card-title text-truncate-2lines fw-bold mb-3 text-primary">
                          {item.title}
                        </Link>
                      </h5>
                      <p className="card-text mb-5 text-truncate-2lines">
                        {extractFirstParagraphText(item.content)}
                      </p>
                    </div>
                    <div className="adminArticleCardFooter d-flex  align-items-center gap-3">
                      <p className="text-gray">{formDate(item.updated_at)}</p>
                      <div className="d-flex text-gray gap-1">
                        <p>{item.likes_count}</p>
                        <span className="material-symbols-outlined">
                          favorite
                        </span>
                      </div>
                      <div className="d-flex text-gray gap-1">
                        <p>{item.comments_count}</p>
                        <span className="material-symbols-outlined">
                          chat_bubble
                        </span>
                      </div>
                      <div className="d-flex text-gray gap-1">
                        <p>{item.favorites_count}</p>
                        <span class="material-symbols-outlined text-primary" style={{ cursor: "pointer" }} onClick={() => cancelFavorites(item.id)}>
                          bookmark
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <img
                    src={item.image_url}
                    className="card-img-top rounded-1 mb-5"
                    alt="articleImg"
                  />
                </div>
              </div>
            </div>
          )
        })
      )}
    </>
  );
};

export default Admin_ArticleCard;
