import apiPath from "../utils/apiPath";
const axios = require("axios");
function getHeaders() {
  return { "Content-Type": "application/json" };
}
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // timeout: 1000,
  headers: getHeaders(),
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return config;
  }
  config = {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  };
  if (
    ![
      "/v1/admin/refresh-amount",
      "/v1/admin/notification-count",
      "/v1/cron/match-odds",
      "/v1/cron/fancy-odds",
      "/v1/cron/bookmaker-odds",
    ].includes(config?.url?.split("?")[0])
  ) {
    document.getElementById("loader").style.display = "block";
    let cover = document.getElementById("cover").style;
    cover.position = "absolute";
    cover.height = "100%";
    cover.width = "100%";
    cover.zIndex = "999";
    cover.background = "black";
    cover.opacity = "0.5";
  }
  return config;
});

instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    document.getElementById("loader").style.display = "none";
    let cover = document.getElementById("cover").style;
    cover.position = "";
    cover.height = "";
    cover.width = "";
    cover.zIndex = "";
    cover.background = "";
    cover.opacity = "";
    return response;
  },
  function (error) {
    const { status } = error.response;
    if (status === 401) {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("uniqueId");
        window.location.href = "/";
      }
      let config = { refresh_token: refresh_token };
      instance.post(apiPath.refreshToken, config).then((res) => {
        if (res?.data?.results?.token) {
          localStorage.setItem("token", res?.data?.results?.token);
          localStorage.setItem(
            "refresh_token",
            res?.data?.results?.refresh_token
          );
          const oldRequest = error.config;
          oldRequest._retry = true;
          oldRequest.headers = {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          };
          return instance(oldRequest);
        }
      });
    } else if (status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("uniqueId");
      window.location.href = "/";
    } else if (status === 422) {
      // localStorage.removeItem("token");
      // localStorage.removeItem("refresh_token");
      // localStorage.removeItem("uniqueId");
      // window.location.href = "/";
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

function apiGet(url, params = {}) {
  return instance.get(url, { params });
}

function apiPost(url, body) {
  return instance.post(url, body);
}

function apiPut(url, body) {
  return instance.put(url, body);
}

function apiDelete(url) {
  return instance.delete(url);
}

export { getHeaders, apiGet, apiPost, apiPut, apiDelete };
