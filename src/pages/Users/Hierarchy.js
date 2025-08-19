import { isEmpty } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import constants from "../../utils/constants";
const Hierarchy = (props) => {
  let { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  useEffect(() => {
    setProfile(props?.results?.balance || {});
  }, [props]);

  let userStatus = {
    owner: "OW",
    sub_owner: "SOW",
    super_admin: "SUA",
    admin: "AD",
    sub_admin: "SAD",
    senior_super: "SSM",
    super_agent: "SA",
    agent: "AG",
    user: "CL",
  };

  if(user?.userType==="sub_owner")
  {
    userStatus = {
      super_admin: "SUA",
      admin: "AD",
      sub_admin: "SAD",
      senior_super: "SSM",
      super_agent: "SA",
      agent: "AG",
      user: "CL",
    };
  }else if(user?.userType==="super_admin")
  {
    userStatus = {
      admin: "AD",
      sub_admin: "SAD",
      senior_super: "SSM",
      super_agent: "SA",
      agent: "AG",
      user: "CL",
    };
  }else if(user?.userType==="admin")
  {
    userStatus = {
      sub_admin: "SAD",
      senior_super: "SSM",
      super_agent: "SA",
      agent: "AG",
      user: "CL",
    };
  }else if(user?.userType==="sub_admin")
  {
    userStatus = {
      senior_super: "SSM",
      super_agent: "SA",
      agent: "AG",
      user: "CL",
    };
  }else if(user?.userType==="senior_super")
  {
    userStatus = {
      super_agent: "SA",
      agent: "AG",
      user: "CL",
    };
  }else if(user?.userType==="super_agent")
  {
    userStatus = {
      agent: "AG",
      user: "CL",
    };
  }
  
  return (
    <div className="agent-path mb-3">
      {user.userType in profile ? (
        <ul className="m-0 list-unstyled">
          {Object.keys(userStatus).map((u_type) => {
            // console.log('u_type0',u_type)
            return (!isEmpty(profile[u_type]) && u_type != "owner")? (
              <li>
                <Link
                  to={`/${profile[u_type]._id}/${
                    profile[u_type]?.userType || ""
                  }`}
                >
                  <span className="sua orange_bg">
                    {userStatus[u_type]}
                  </span>
                  <strong>{profile[u_type]?.username || ""}</strong>
                </Link>
              </li>
            ) : null;
          })}
          {profile?.userType && (
            <>
              <li>
                <Link to={`/${profile._id}/${profile?.userType || ""}`}>
                  <span className="sua lv_1">
                    {constants.user_status[profile?.userType]}
                  </span>
                  <strong>{profile?.username || ""}</strong>
                </Link>
              </li>
            </>
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default Hierarchy;