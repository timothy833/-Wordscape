import { useLocation } from 'react-router-dom';
import DOMParserReact from "dom-parser-react";

const SearchPage = () => {
  const location = useLocation();
  const searchResults = location.state?.results || [];

  return (
    <div>
      <h1>搜尋結果</h1>
      {searchResults.length ? (
        searchResults.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <div className="container">
          {/* DOMParserReact套件用來渲染文章內容，避免XSS攻擊 */}
          <div className="article-wrap d-flex flex-column gap-2 border-bottom pt-5 pt-lg-10 pb-10 pb-lg-15">
            <DOMParserReact source={post?.content} />
          </div>
        </div>
          </div>
        ))
      ) : (
        <p>未找到相關文章</p>
      )}
    </div>
  );
};

export default SearchPage;
