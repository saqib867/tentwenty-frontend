import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-w-7xl mx-aut">
      <Header />
      <div className="mt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
