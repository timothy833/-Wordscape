import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";

const router = [
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "/article", 
    element: <ArticlePage /> 
  },
];

export default router;