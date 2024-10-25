import { useAuthStore } from "./page/(auth)/store";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export const Middleware = ({ children }) => {
  const { isAuthenticated, authUser, setAccesses, accesses } = useAuthStore();

  const location = useLocation();
  const [searchParams] = useSearchParams();

  console.log("user", isAuthenticated, authUser);
  console.log("aaaa", sessionStorage.getItem("authToken"));
  console.log("id", sessionStorage.getItem("id"));

  /**
   * Require Authenticated
   * avoid public path
   * redirect to login
   */
  if (
    !isAuthenticated &&
    !(location.pathname === "/") &&
    ["signin"].find((route) => !location.pathname.includes(route))
    // !Object.values({ ...ROUTES, ...ROUTES.auth.children }).find(
    //   (route) =>
    //     route.path &&
    //     route.path !== "/" &&
    //     location.pathname.includes(route),
    // )
  ) {
    return (
      <Navigate
        to={"signin"}
        // to={"signin" + "?to=" + location.pathname}
        // state={{ from: location }}
        replace
      />
    );
  }

  const accessRight = {
    admin: ["Dashboard"],
    pondOwner: ["Overview"],
    shop: ["ShopOverview"],
  };

  if (isAuthenticated && authUser) {
    if (["signin"].find((route) => location.pathname.includes(route))) {
      let path = "/";
      if (authUser.role === "Admin") {
        path = "/DashBoard";
      } else if (authUser.role === "PondOwner") {
        path = "/overview";
      } else if (authUser.role === "Shop") {
        path = "/ShopOverview";
      } else {
        // setErrorMessage("Unknown user role.");
      }
      //   const pathState = searchParams.get("to");

      let hasAccess = false;

      console.log("navigate");

      return (
        <Navigate
          to={path}
          //   to={pathState ?? path}
          // to={withLocalePath(!hasAccess ? homePath : pathState ?? homePath)}
        />
      );
    }
  }
  return <>{children}</>;
};