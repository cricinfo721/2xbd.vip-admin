import React, { useEffect, useRef, useState, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import helpers from "../utils/helpers";

const Login = () => {
  const navigate = useNavigate();
  let { loginUser, user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      uniqueId: Math.random() * 10000,
    },
  });
  const [getValidateCode, setValidateCode] = useState("");

  const onSubmit = (data) => {
    //if (parseInt(data.validateCode) === parseInt(getValidateCode)) {
      loginUser(data);
      // navigate('/')
    //}
  };

  // const canvasRef = useRef(null);

  // const changeCode = () => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");
  //   context.font = "60px sans-serif";
  //   const code = Math.floor(1000 + Math.random() * 9000);
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  //   context.fillText(code, 10, 50);
  //   setValidateCode(code);
  // };

  useEffect(() => {
    // console.log('%cLogin.js line:43 user', 'color: #007acc;', user);
    if (user !== null) {
      // console.log("MMMM")
      // window.location.reload();
      navigate("/");
    }
  }, [user]);

  // useEffect(() => {
  //   changeCode();
  // }, []);

  return (
    <div>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <section className="login-sec">
        <Container fluid>
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="main-center">
              <div className="login_box m-auto">
                <div className="login_left">
                  
                  <span className="login_logo">
                  <img src="assets/images/logo.png" alt="" />
                  </span>
                </div>

                <div className="form_outer">
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-white">Agent login </h2>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        className={errors.username ? "is-invalid" : ""}
                        {...register("username", {
                          required: "Please enter Username",
                        })}
                      />
                      {errors.username && errors.username.message && (
                        <label className="invalid-feedback text-left">
                          {errors.username.message}
                        </label>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        className={errors.password ? "is-invalid" : ""}
                        {...register("password", {
                          required: "Please enter password",
                        })}
                      />
                      {errors.password && errors.password.message && (
                        <label className="invalid-feedback text-left">
                          {errors.password.message}
                        </label>
                      )}
                    </Form.Group>
                    {/* <Form.Group className="position-relative mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Validate Code"
                        maxLength="4"
                        className={errors.validateCode ? "is-invalid" : ""}
                        {...register("validateCode", {
                          required: "Please enter validate code",
                          validate: {
                            validate: (value) =>
                              parseInt(value) === parseInt(getValidateCode) ||
                              "Invalid validate code",
                          },
                        })}
                      />
                      <canvas ref={canvasRef} onClick={changeCode} />
                      
                      {errors.validateCode && errors.validateCode.message && (
                        <label className="invalid-feedback text-left">
                          {errors.validateCode.message}
                        </label>
                      )}
                    </Form.Group> */}
                    <Button type="submit" className="green-btn theme-btn">
                      Login
                      <span>
                        <img src="assets/images/loginicon.svg" />
                      </span>
                    </Button>
                  </Form>
                </div>
              </div>

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
                    <a href="https://t.me/+">+</a>
                  </div>
                </div> 
              </div>
              <div className=""style={{color:`#fff`,fontSize:`16px`,marginTop:`5px`,textAlign:`center`}}>Affiliate Link  <a href={"https://aff."+helpers?.getDomain()+"/"} target="_blank" className="">Click </a></div>

            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Login;
