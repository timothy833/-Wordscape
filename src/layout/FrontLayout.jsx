import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar/Navbar";

const FrontLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default FrontLayout;