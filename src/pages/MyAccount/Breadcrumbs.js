import React, {useContext } from "react";
import AuthContext from '../../context/AuthContext'
import constants from '../../utils/constants';
import { Link } from 'react-router-dom';
const Breadcrumbs = () => {
 
  let { user } = useContext(AuthContext);
  
  return (
    <div className="agent-path mb-4">
    <ul className="m-0 list-unstyled">
        <li>
        <Link to="#">
            <a href={"#"} className="text-primary">
              <span>
                {constants?.user_status[user?.userType || ""]}
              </span>
            </a>
            <strong>{user.username}</strong>
        </Link>
        </li>
    </ul>
    </div>
  );
};

export default Breadcrumbs;
