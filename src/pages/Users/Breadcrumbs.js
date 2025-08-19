import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import constants from "../../utils/constants";
import { apiGet } from "../../utils/apiFetch";
import apiPath from "../../utils/apiPath";
const Breadcrumbs = (props) => {
  let { user } = useContext(AuthContext);

  const [summaryData, setSummaryData] = useState("");
  const accountSummary = async () => {
    const { status, data: response_users } = await apiGet(
      apiPath.userProfile + "?user_id=" + props?.user_id
    );
    if (status === 200) {
      if (response_users.success) {
        // console.log("response_users.results", response_users.results);
        setSummaryData(response_users.results);
      }
    }
  };

  useEffect(() => {
    accountSummary();
  }, []);

  return (
    <div className="agent-path mb-4">
      <ul className="m-0 list-unstyled">
        <li>
          <a href="#">
            <span>{constants?.user_status[user?.userType || ""]}</span>
            <strong>{user.username}</strong>
          </a>
        </li>
        <li>
          <a href="#">
            <span>{constants?.user_status[summaryData?.userType || ""]}</span>
            <strong>{summaryData?.username}</strong>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Breadcrumbs;
