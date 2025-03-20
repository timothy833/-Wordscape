import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 5000);
  }, []);
  return (
    <div
      className="container"
      style={{ paddingTop: "200px", paddingBottom: "300px" }}
    >
      <h2 className="text-dark d-flex flex-row align-items-center mb-5">
        <span className="material-symbols-outlined fs-2 me-2">menu_book</span>
        您所查看的頁面已經不存在
        <span className="material-symbols-outlined fs-2 ms-2">menu_book</span>
      </h2>
      <h3 className="text-gray mb-5">可能的原因</h3>
      <ul className="text-gray">
        <li>該文章已經被刪除</li>
        <li>您輸入了錯誤的路由</li>
      </ul>
      <span className="d-block pt-5 text-gray fs-6">
        將於5秒後將您送回之前的頁面...
      </span>
    </div>
  );
};

export default ErrorPage;
