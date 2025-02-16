import { createRoot } from "react-dom/client";
import "./style/main.scss";
import { RouterProvider, createHashRouter } from "react-router-dom";
import router from "./router/router";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={createHashRouter(router)} />
);
