import React from "react";
import ExitFrame from "./ExitFrame";
import CalenderIndex from "./pages/CalenderIndex";
import Index from "./pages/Index";
import Bookings from "./pages/Bookings";
import CustomBookings from "./pages/CustomBookings";
import OrderSuccess from "./pages/OrderSuccess";

const routes = {
  "/": () => <Index />,
  "/exitframe": () => <ExitFrame />,
  //Routes
  "/calender": () => <CalenderIndex />,
  "/bookings": () => <Bookings />,
  "/custom-bookings": () => <CustomBookings />,
  "/order-success": () => <OrderSuccess />,
  //Add your routes here
};

export default routes;
