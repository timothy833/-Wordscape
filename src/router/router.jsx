import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";
import ArticleListPage from "../page/ArticleListPage/ArticleListPage";
const router = [
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/article", 
    element: <ArticlePage /> 
  },
  { path: "/articleList", 
    element: <ArticleListPage /> 
  },
];

export default router;