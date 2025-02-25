import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";
import BlogHome from "../page/BlogPage/BlogHome";

const router = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/article",
    element: <ArticlePage />
  },
  {
    path: "/blog",
    element: <BlogHome />
  },
];

export default router;