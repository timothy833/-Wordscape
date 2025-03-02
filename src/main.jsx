import { createRoot } from "react-dom/client";
import "./style/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ 確保 Bootstrap JS 加載
import { RouterProvider, createHashRouter } from "react-router-dom";
import router from "./router/router";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={createHashRouter(router)} />
);
