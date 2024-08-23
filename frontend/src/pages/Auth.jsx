import { Fragment, useContext, useState } from "react";

import { Navigate, redirect, useNavigate } from "react-router-dom";
import Input from "../shared/components/FormElements/Input";
import Button from "../shared/components/FormElements/Button";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../shared/util/validators";
import { useForm } from "../shared/hooks/form-hook";
import { AuthContext } from "../shared/context/auth-context";
import { useHttpClient } from "../shared/hooks/http-hook";
import "./Auth.css";

const Auth = () => {
  const { isLoggedIn, login } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          username: undefined,
          confirmPassword: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          username: {
            value: "",
            isValid: true,
          },
          image: {
            value: null,
            isValid: false,
          },
          confirmPassword: {
            value: "",
            isValid: true,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        login(
          // responseData.loggedInUser,
          responseData.userId,
          responseData.token
        );
        redirect("/");
      } catch (err) {
        /* empty */
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("fullName", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("username", formState.inputs.username.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("profileImage", formState.inputs.image.value);
        formData.append(
          "confirmPassword",
          formState.inputs.confirmPassword.value
        );

        const responseData = await sendRequest(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/auth/signup`,
          "POST",
          formData
        );
        login(
          // responseData.loggedInUser,
          responseData.userId,
          responseData.token
        );
        navigate("/");
      } catch (err) {
        /* empty */
      }
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <section className="auth">
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoggedIn && <Navigate to="/" replace={true} />}
        {/* <div className="logo">
          <SiGooglemessages />
          <h4>Mern Chat App</h4>
        </div> */}
        <p className="title">{isLoginMode ? "Sign in" : "Create account"}</p>
        <p className="text">to continue to Mern Chat App</p>
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <div className="inputRow">
              <div>
                <Input
                  element="input"
                  id="name"
                  type="text"
                  label="Full Name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your full name."
                  onInput={inputHandler}
                />
                <Input
                  element="input"
                  id="username"
                  type="text"
                  label="Username"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Please enter your username."
                  onInput={inputHandler}
                />
              </div>
              <ImageUpload
                id="image"
                center
                onInput={inputHandler}
                errorText="Please provide an image"
              />
            </div>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          {!isLoginMode && (
            <Input
              element="input"
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter the required password."
              onInput={inputHandler}
            />
          )}
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
          <div className="formFooter">
            <p>
              {isLoginMode
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <p className="span" onClick={switchModeHandler}>
              {isLoginMode ? "Register" : "Login"}
            </p>
          </div>
        </form>
      </section>
    </Fragment>
  );
};

export default Auth;
