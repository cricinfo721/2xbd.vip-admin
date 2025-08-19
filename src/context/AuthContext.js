import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { isEmpty, pick } from "lodash";
import { useNavigate } from "react-router-dom";
import { toast } from "wc-toast";
import { apiPost, apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import moment from "moment";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("token")
      ? jwt_decode(localStorage.getItem("token"))
      : null
  );

  const [comission, setComission] = useState(0);
  let [loading, setLoading] = useState(false);
  let [user_coins, setUserCoins] = useState(0.0);
  const [isRefereshLoader, setRefereshLoader] = useState(false);
  const navigate = useNavigate();
  const [count, setCount] = useState({});
  const [agentId, setAgentId] = useState("");

  const [invalidCount, setInvalidCount] = useState(0);
  const [invalidCountTimer, setInvalidCountTimer] = useState({
    status: false,
  });
  const [call, setCall] = useState(false);
  useEffect(() => {
    if (
      !isEmpty(localStorage.getItem("invalidCount")) &&
      localStorage.getItem("invalidCount") > 0
    ) {
      setInvalidCount(Number(localStorage.getItem("invalidCount")));
    }
    let obj = !isEmpty(localStorage?.getItem("invalidCountTime"))
      ? JSON.parse(localStorage?.getItem("invalidCountTime"))
      : {};
    if (!isEmpty(obj) && obj?.status) {
      setInvalidCountTimer(obj);
    }
  }, []);

  const handelTimeCheck = (obj) => {
    if (
      moment(new Date()).isAfter(
        moment(obj?.time).add(Number(obj?.length), "minutes")
      )
    ) {
      setInvalidCountTimer({
        ...invalidCountTimer,
        status: false,
        isCompleted: true,
      });
      localStorage.setItem(
        "invalidCountTime",
        JSON.stringify({
          ...invalidCountTimer,
          status: false,
          isCompleted: true,
        })
      );
      return {
        ...invalidCountTimer,
        status: false,
        isCompleted: true,
      };
    } else {
      return invalidCountTimer;
    }
  };

  const handelTimerFunc = () => {
    if (invalidCount > 0) {
      let count = invalidCount + 1;
      let obj = handelTimeCheck(invalidCountTimer);
      if (count === 3) {
        if (!obj?.status) {
          if (obj?.isCompleted && obj?.next == 6) {
            setInvalidCount(count);
            localStorage.setItem("invalidCount", count);
          } else {
            setInvalidCountTimer({
              status: true,
              time: new Date(),
              length: 15,
              next: 6,
            });
            localStorage.setItem(
              "invalidCountTime",
              JSON.stringify({
                status: true,
                time: new Date(),
                length: 15,
                next: 6,
              })
            );
          }
        }
        toast.error("Invalid Password your account is blocked for 15 min");
      } else if (count == 6) {
        if (!obj?.status) {
          if (obj?.isCompleted && obj?.next == 6) {
            setInvalidCount(count);
            localStorage.setItem("invalidCount", count);
          } else {
            setInvalidCountTimer({
              status: true,
              time: new Date(),
              length: 60,
              next: 12,
            });
            localStorage.setItem(
              "invalidCountTime",
              JSON.stringify({
                status: true,
                time: new Date(),
                length: 60,
                next: 12,
              })
            );
          }
        }
        toast.error("Invalid Password your account is blocked for 1 hr");
      } else if (count == 9) {
        if (!obj?.status) {
          if (obj?.isCompleted && obj?.next == 12) {
            setInvalidCount(count);
            localStorage.setItem("invalidCount", count);
          } else {
            setInvalidCountTimer({
              status: true,
              time: new Date(),
              length: 1440,
              next: 24,
            });
            localStorage.setItem(
              "invalidCountTime",
              JSON.stringify({
                status: true,
                time: new Date(),
                length: 1440,
                next: 24,
              })
            );
          }
        }
        toast.error("Invalid Password your account is blocked for 24 hr");
      } else {
        if (!obj?.status) {
          setInvalidCount(count);
          localStorage.setItem("invalidCount", count);
          toast.error("Invalid password.");
        }
      }
    } else {
      setInvalidCount(1);
      localStorage.setItem("invalidCount", 1);
      toast.error("Invalid password.");
    }
    setCall(false);
  };

  useEffect(() => {
    if (call) {
      handelTimerFunc();
    }
  }, [call]);

  let loginUser = async (body) => {
    let hostname = window.location.hostname;
    hostname = hostname.replace(/^www\./, "");
    hostname = hostname.replace(/^ag\./, "");
    hostname = hostname.replace(/^msa\./, "");
    body.website = hostname || "SABAEXCH";
    // body.request = "local";
    const { status, data } = await apiPost(
      apiPath.loginUser,
      pick(body, ["username", "password", "uniqueId", "website"])
    );
    if (status === 200) {
      if (data.success) {
        localStorage.removeItem("invalidCount");
        localStorage.removeItem("invalidCountTime");
        const token = data?.results?.token || null;
        const refresh_token = data?.results?.refresh_token || null;
        setUserCoins(data.results.totalCoins);
          localStorage.setItem("token", token);
        localStorage.setItem("refresh_token", refresh_token);
        setUser(jwt_decode(token));
        localStorage.setItem("uniqueId", body.uniqueId);
        navigate("/dashboard");
      } else {
        if (data?.message == "Invalid password.") {
          setCall(true);
        } else {
          toast.error(data?.message);
        }
      }
    } else {
      toast.error("API Error");
    }
  };

  const [profileData, setProfileData] = useState({});
  const getData = async () => {
    const { status, data: response_users } = await apiGet(apiPath.userProfile);
    if (status === 200) {
      if (response_users.success) {
        setProfileData(response_users?.results);
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(user)) {
      getData();
    }
  }, [user]);
  const [bellSound, setBellSound] = useState(false);
  const getCount = async () => {
    const { data } = await apiGet(apiPath.notificationCount);
    if (data?.success) {
      setCount((prev) => {
        if (prev?.depositRequests < data?.results?.depositRequests) {
          setBellSound(true);
        }
        if (prev?.withdrawalRequests < data?.results?.withdrawalRequests) {
          setBellSound(true);
        }
        return data?.results;
      });
      setAgentId(data?.results?.default_agentID);
    }
  };

  useEffect(() => {
    if (!isEmpty(user)) {
      const intervalCall = setInterval(() => {
        getCount();
      }, 15000);
      return () => {
        clearInterval(intervalCall);
      };
    }
  }, [user]);

  useEffect(() => {
    if (!isEmpty(user)) {
      if (user?.userType == "owner" || user?.userType == "sub_owner") {
        getCount();
      }
    }
  }, [user]);

  const getCoins = async () => {
    if (!isEmpty(user)) {
      setRefereshLoader(true);
      const { status, data } = await apiGet(
        apiPath.refreshAmount + "?userType=agent"
      );
      if (status === 200) {
        if (data.success) {
          setUserCoins(data.results.totalCoins);
          setRefereshLoader(false);
        } else {
          toast.error(data.message);
          setRefereshLoader(false);
        }
      } else {
        toast.error("API Error");
        setRefereshLoader(false);
      }
    }
  };

  let logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  let contextData = {
    user: user,
    user_coins,
    loginUser: loginUser,
    logoutUser: logoutUser,
    getCoins,
    setUserCoins,
    setRefereshLoader: setRefereshLoader,
    isRefereshLoader: isRefereshLoader,
    setComission,
    comission,
    agentId,
    setAgentId,
    count,
    setCount,
    bellSound,
    setBellSound,
    profileData,
    getProfileData: getData,
  };

  useEffect(() => {
    getCoins();
  }, []);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
