import React, { useContext, useEffect, useState } from "react";
import ChartComp from "./Chart";
import RecentRegistered from "./RecentRegistered";
import AuthContext from "../context/AuthContext";
import { toast } from "wc-toast";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import helpers from "../utils/helpers";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  function copy(text) {
    toast.success("Link Copied!");
    return window.navigator.clipboard.writeText(text);
  }
  const [profileData, setProfileData] = useState({});
  const myProfile = async () => {
    const { status, data: response_users } = await apiGet(apiPath.userProfile);
    if (status === 200) {
      if (response_users.success) {
        setProfileData(response_users.results);
      }
    }
  };

  useEffect(() => {
    myProfile();
  }, []);
  return (
    <div>
      {user?.userType == "agent" && (
         <div className="d-flex align-items-start">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            paddingTop:"10px",
            fontSize: "15px",
            border: "#ccc thin solid",
            background: "#fff",
            marginTop: "15px",
            marginLeft: "22px",
            borderRadius: "20px",
            padding: "5px 0",
            paddingLeft: "0px"
          }} >
          <span style={{ paddingLeft: "12px"}}>User Referal Code : </span> 
          <span
            style={{ 
              cursor: "pointer", color: "#fff",paddingLeft:"5px",
              background: "green",
              borderRadius: "20px",
              padding: "5px 20px",
              margin: "0 5px" }}
            onClick={() => {
              copy(
                "https://"+helpers?.getDomain()+"/register?referral_code=" +
                  profileData?.referalCode
              );
            }}
            className="text-start"
          >
            { profileData?.referalCode
              ? " https://"+helpers?.getDomain()+"/register?referral_code=" +
                profileData?.referalCode
              : "-"}
          </span>
        </div>
        <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          paddingTop: "10px",
          fontSize: "15px",
          border: "#ccc thin solid",
          background: "#fff",
          marginTop: "15px",
          marginLeft: "22px",
          borderRadius: "20px",
          padding: "5px 0",
          paddingLeft: "0px",
        }}
      >
        <span style={{ paddingLeft: "12px" }}>Agent Referal Code : </span>
        <span
          style={{
            cursor: "pointer",
            color: "#fff",
            paddingLeft: "5px",
            background: "green",
            borderRadius: "20px",
            padding: "5px 20px",
            margin: "0 5px",
          }}
          onClick={() => {
            copy(
              "https://"+helpers?.getDomain()+"/affilate?referral_code=" +
                profileData?.referalCode
            );
          }}
          className="text-start"
        >
          {profileData?.referalCode
            ? " https://"+helpers?.getDomain()+"/affilate?referral_code=" +
              profileData?.referalCode
            : "-"}
        </span>
      </div>
      </div>
      )}
      <ChartComp />
      <RecentRegistered />
    </div>
  );
};

export default Dashboard;
