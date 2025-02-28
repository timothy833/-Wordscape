import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";
import BlogHome from "../page/BlogPage/BlogHome";
import AdminBackground from "../page/AdminPage/AdminBackground";
import AdminInfo from "../page/AdminPage/AdminInfo";
import AdminCollection from "../page/AdminPage/AdminCollection";
import AdminSubscription from "../page/AdminPage/AdminSubscription";


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
  {
    path: "/adminbackground",
    element: <AdminBackground />
  },
  {
    path: "/admininfo",
    element: <AdminInfo />
  },
  {
    path: "/admincollection",
    element: <AdminCollection />
  },
  {
    path: "/adminsubscription",
    element: <AdminSubscription />
  },
];

export default router;