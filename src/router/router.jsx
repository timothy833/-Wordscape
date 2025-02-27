import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";
import ArticleListPage from "../page/ArticleListPage/ArticleListPage";
import BlogPage from "../page/BlogPage/BlogPage";
import TestLoginPage from "../page/BlogPage/TestLoginPage";
import TestArticlePage from "../page/BlogPage/TestArticlePage";


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
  {
    path: "/blogpage",
    element: <BlogPage />
  },{
    path: "/testlogin",
    element: <TestLoginPage />
  },{
    path: "/testArticle/:id",
    element: <TestArticlePage />
  }


];

export default router;