import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TestArticlePage = () => {
  const { id } = useParams(); // ✅ 取得 URL 參數的 `id`
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async ()=>{
      try {
        const res = await axios.get(`${API_BASE_URL}/posts/${id}`);

         // ✅ 確保 `res.data` 結構正常
        if (!res.data || !res.data.data) {
          console.error("❌ 文章 API 回傳錯誤，資料可能不存在", res);
          setError("文章內容獲取失敗");
          return;
        }

        setArticle(JSON.parse(JSON.stringify(res.data.data))); // ✅ 確保不會是 frozen object  ✅ 確保是可變的物件
      } catch (error) {
        console.error("❌ 文章獲取失敗:", error);
        setError("找不到文章或文章已刪除");
      }
    }
    if(id) fetchArticle(); // ✅ 確保 `id` 存在才發送請求
  }, [id]);

  if(error) return <p className="text-danger">{error}</p>
  if (!article) return <p>載入中...</p>;

  // **解析 HTML 內容**
  const parseHTMLContent = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    


    if (!doc.body || doc.body.children.length === 0) {
      console.error("❌ HTML 解析失敗，內容可能有問題", html);
      return <p className="text-danger">內容解析失敗</p>;
    }

    return Array.from(doc.body.children).map((el, index) => {
      const className = `article-element ${el.className || ""}`;
      const inlineStyle = el.getAttribute("style") || ""; // ✅ 確保 `style` 是字串
      switch (el.tagName.toLowerCase()) {
        case "p":
          return <p key={index} className={className} style={{ inlineStyle }} dangerouslySetInnerHTML={{ __html: el.innerHTML }} />;
        case "a":
          return (
            <a
              key={index}
              href={el.getAttribute("href")}
              target="_blank"
              rel="noopener noreferrer"
              className={`${className} article-link`}
            >
              {el.innerHTML}
            </a>
          );
        case "img":
          return (
            <img
              key={index}
              src={el.getAttribute("src")}
              alt="內文圖片"
              className={`${className} article-img`}
              style={{ inlineStyle }}
            />
          );
        case "iframe": // ✅ 處理嵌入影片（YouTube）
          return (
            <iframe
              key={index}
              src={el.getAttribute("src")}
              width="100%"
              height="400"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={`${className} article-video`}
            />
          );
        case "ul": // ✅ 處理無序清單
          return (
            <ul key={index} className={`${className} article-list`}>
              {Array.from(el.children).map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />)}
            </ul>
          );
        case "ol": // ✅ 處理有序清單
          return (
            <ol key={index} className={`${className} article-list`}>
              {Array.from(el.children).map((li, i) => <li key={i} dangerouslySetInnerHTML={{ __html: li.innerHTML }} />)}
            </ol>
          );
        default:
          return <div key={index} className={className} style={{ inlineStyle }} dangerouslySetInnerHTML={{ __html: el.outerHTML }} />;
      }
    
    });
  };

  return (
    <div className="container mt-4">
      <div className="article-header">
        <h1 className="article-title">{article.title}</h1>
      </div>
      {article.image_url && <img src={article.image_url} alt="封面圖片" className="article-cover" />}
      {/* ✅ 解析 HTML 結構，保留 Quill 編輯器原始格式 */}
      <div className="article-content">{article.content ? parseHTMLContent(article.content) : <p>無內容</p>}</div>
      <div className="text-center mt-4">
        <Link to="/blogpage" className="btn btn-primary">返回部落格</Link>
      </div>

    </div>
  );
};

export default TestArticlePage;