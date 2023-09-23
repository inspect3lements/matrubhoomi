import { Home, Login, Report } from "./screens";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/report",
    component: Report,
  },
]);
