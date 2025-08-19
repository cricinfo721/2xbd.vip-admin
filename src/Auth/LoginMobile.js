import { isEmpty } from "lodash";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import { apiGet } from "../utils/apiFetch";
import apiPath from "../utils/apiPath";
import styles from "../assets/newCss/sky.css";
import { Helmet } from "react-helmet";
import helpers from "../utils/helpers";

function LoginMobile(props) {
  let { loginUser, isLoged, user } = useContext(AuthProvider);
  const navigate = useNavigate();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    unregister,
    reset: reset2,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      uniqueId: Math.random() * 10000,
    },
  });
  const [getValidateCode, setValidateCode] = useState("");
  const [data, setData] = useState({});
  const onSubmit2 = (data) => {
   // if (parseInt(data.validateCode) === parseInt(getValidateCode)) {
      loginUser(data);
    //}
  };
  // const canvasRef = useRef(null);
  // const changeCode = () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");
  //   context.font = "bold 120px sans-serif";
  //   const code = Math.floor(1000 + Math.random() * 9000);
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   context.fillText(code, 0, 130);
  //   setValidateCode(code);
  // };

  const getSetting = async (event) => {
    try {
      const { status, data: response_users } = await apiGet(apiPath.getSetting);
      if (status === 200) {
        if (response_users.success) {
          setData(response_users.results);
        }
      }
    } catch (err) { }
  };
  // useEffect(() => {
  //   changeCode();
  //   // getSetting();
  // }, []);
  useEffect(() => {
    // console.log('%cLogin.js line:43 user', 'color: #007acc;', user);
    if (user !== null) {
      // console.log("MMMM")
      // window.location.reload();
      navigate("/");
    }
  }, [user]);

  return (
    <div className="newLogin">
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1.0, maximum-scale = 1.0, user-scalable = no"
        />
      </Helmet>

      <div className="login_main" style={{"height":`100vh`}}>
       
          <div className="login-log-sec w-100">
          <div className="login-logo">
            <img src="../assets/images/logo.png" alt="" />
          </div>
          
        
        <Form onSubmit={handleSubmit2(onSubmit2)} className="p-0">
        <label className="mb-3 d-block text-center fs-2 login-tm">Agent <span>Sign in</span></label>
          <dl className="form-login mb-3">
            <Form.Group
              style={{ marginBottom: "10px" }}
              id="loginNameErrorClass"
            >
              <Form.Control
                type="text"
                autocomplete="off"
                // id="loginName"
                className={errors2.username ? "is-invalid" : "mb-3"}
                {...register2("username", {
                  required: "Please enter Username",
                })}
                placeholder="Username"
              />
              {errors2.username && errors2?.username?.message && (
                <label className="invalid-feedback text-left">
                  {errors2.username.message}
                </label>
              )}
            </Form.Group>
            <Form.Group
              style={{ marginBottom: "10px" }}
              id="passwordErrorClass"
            >
              <Form.Control
                type="password"
                autocomplete="off"
                // id="password"
                className={errors2.password ? "is-invalid" : "mb-3"}
                {...register2("password", {
                  required: "Please enter password",
                })}
                data-role="none"
                placeholder="Password"
              />
              {errors2.password && errors2.password.message && (
                <label className="invalid-feedback text-left">
                  {errors2.password.message}
                </label>
              )}
            </Form.Group>
            {/* <dd id="validCodeErrorClass" style={{ display: "block" }}>
              <input
                type="number"
                keyboardType="numeric"
                autocomplete="off"
                maxLength="4"
                className={errors2.validateCode ? "is-invalid" : "mb-3"}
                {...register2("validateCode", {
                  required: "Please enter validate code",
                  validate: {
                    validate: (value) =>
                      parseInt(value) === parseInt(getValidateCode) ||
                      "Invalid validate code",
                  },
                })}
                onChange={(e) => {
                  if (e.target.value.length == 4) {
                    e.target.blur();
                    unregister("validateCode", { keepValue: true });
                  }
                }}
               
                id="validCode"
                placeholder="Validation Code"
              
              />
              
              <canvas
                ref={canvasRef}
                onClick={changeCode}
                className="inputcanvas"
                id="authenticateImage"
              />

              {errors2.validateCode && errors2.validateCode.message && (
                <label className="invalid-feedback text-left">
                  {errors2.validateCode.message}
                </label>
              )}
            </dd> */}
            
            <div className="text-center mt-0">
              <Button type="submit" className="theme-btn ms-auto px-5" id="loginBtn">
                Login
                <span>
                        <img src="assets/images/loginicon.svg" />
                      </span>
              </Button>
              </div>
            {isLoged == "failed" && (
              <dd id="errorMsg" className="state">
                Login name or password is invalid! Please try again.
              </dd>
            )}
          </dl>
        </Form>
        
        <div id="supportWrap" className="support-wrap">
                <div className="support-service">
                  <a
                    id="support_whatsapp"
                    href="#"
                    className="support-whatsapp open"
                  >
                    <img src="assets/images/telegram.svg" title="WhatsApp" />
                  </a>
                </div>

                 <div className="support-info">
                  <div
                    id="supportDetail_whatsapp"
                    className="support-detail open"
                  >
                    <a href="https://t.me/">+</a>
                  </div>
                </div> 
              </div>
              <div className=""style={{color:`#fff`,fontSize:`16px`,marginTop:`5px`,textAlign:`center`}}>Affiliate Link  <a href={"https://aff."+helpers?.getDomain()+"/"} target="_blank" className="">Click </a></div>

        </div>
        
        
      </div>
      
    </div>
  );
}

export default LoginMobile;
