import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "../src/assets/css/style.css";
import "../src/assets/css/developer.css";
// import "../src/assets/css/responsive.css";
import Login from "./Auth/Login";
import NoMatch from "./pages/NoMatch";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import AuthContext from "./context/AuthContext";
import { routes } from "./Route";
import ViewDialog from "./pages/RiskManagement/ViewDialog";
import FancyBetDialog from "./pages/RiskManagement/FancyBetDialog";
import ViewSportPremium from "./pages/RiskManagement/ViewSportPremium";
import ViewBetsResult from "./pages/ViewBetsResult";
import MarketBets from "./pages/MarketBets";
import "./App.css"
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import LoginMobile from "./Auth/LoginMobile";
function App() {
  const location = useLocation();
  let { user } = useContext(AuthContext);
  return (
    <div className="App">
      <wc-toast
        position={
          location.pathname == "/add-match" ? "top-center" : "top-right"
        }
      ></wc-toast>
      <Routes>
        <Route element={<PrivateRoute />}>
          {routes?.map((item, index) => {
            return item?.permission?.includes(user?.userType) ? (
              <Route
                exact
                path={item.path}
                key={index}
                element={<item.Component />}
              />
            ) : item?.permission?.length == 0 ? (
              <Route
                exact
                path={item.path}
                key={index}
                element={<item.Component />}
              />
            ) : (
              ""
            );
          })}
        </Route>
        <Route
          exact
          path="/login"
          element={isMobile ? <LoginMobile /> : <Login />}
          // element={<Login />}
        ></Route>
        <Route
          exact
          path="/DownlinePnl/:userId/:userType/:id/:type"
          element={<ViewDialog />}
        ></Route>
        <Route
          exact
          path="/DownlinePnl-Fancy/:name/:eventid/:marketId/:selectionId"
          element={<FancyBetDialog />}
        ></Route>
         <Route
          exact
          path="/DownlinePnl-sport-premium/:eventId/:selectionId/:marketId/:userType/:userId"
          element={<ViewSportPremium />}
        ></Route>
        <Route
          exact
          path="/view-bets-result/:eventId/:marketId/:selectionId"
          element={<ViewBetsResult />}
        ></Route>
         <Route
          exact
          path="/match-market-bets/:eventId/:betFairType"
          element={<MarketBets />}
        ></Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
}

export default App;
