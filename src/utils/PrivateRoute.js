import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { isEmpty } from "lodash";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";
const PrivateRoute = ({ children, ...rest }) => {
  const location = useLocation();
  const current_url = location.pathname.split("/")[1];

  let { user } = useContext(AuthContext);
  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return !isEmpty(user) ? (
    <>
      {!["transaction-logs"].includes(current_url) ? <Header /> : null}
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
