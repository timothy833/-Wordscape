import { Navigate } from "react-router-dom";
import FrontLayout from "../layout/FrontLayout";
import HomePage from "../page/HomePage/HomePage";
import ArticlePage from "../page/ArticlePage/ArticlePage";
import ArticleListPage from "../page/ArticleListPage/ArticleListPage";
import BlogHome from "../page/BlogPage/BlogHome";
import AdminLayout from "../page/AdminPage/AdminLayout/AdminLayout";
import AdminBackground from "../page/AdminPage/AdminBackground";
import AdminInfo from "../page/AdminPage/AdminInfo";
import AdminCollection from "../page/AdminPage/AdminCollection";
import AdminSubscription from "../page/AdminPage/AdminSubscription";
import ResetPassword from "../page/AccessPage/ResetPassword";
import ErrorPage from "../page/ErrorPage/ErrorPage";
import SearchPage from "../page/SearchPage/SearchPage";
const router = [
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchPage />
      },
      {
        path: "/article/:id",
        element: <ArticlePage />,
      },
      {
        path: "/blog/:user_id",
        element: <BlogHome />,
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="info" replace />,
          },
          {
            path: "info",
            element: <AdminInfo />,
          },
          {
            path: "collection",
            element: <AdminCollection />,
          },
          {
            path: "subscription",
            element: <AdminSubscription />,
          },
          {
            path: "background",
            element: <AdminBackground />,
          },
        ],
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      { path: "/articleList", element: <ArticleListPage /> },
      {
        path:"*",
        element: <ErrorPage />,
      }
    ],
  },
];

export default router;
