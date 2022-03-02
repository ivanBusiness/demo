import { useEffect, useContext, useState, useCallback } from "react";
import { SiteContext } from "../SiteContext";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  createSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input, Checkbox } from "./elements";
import { Prompt } from "./modal";
import bcrypt from "bcryptjs";
import s from "./login.module.scss";
import paths from "./path";

import { appConfig, endpoints as defaultEndpoints } from "../config";

export default function Login() {
  const { user, setUser, setEndpoints, his, setHis } = useContext(SiteContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (user) {
      navigate("/");
      return;
    }
    fetch(`${process.env.REACT_APP_HOST}/user?size=10000`)
      .then((res) => res.json())
      .then((users) => {
        if (users._embedded.user) {
          setUsers(
            users._embedded.user.map((user) => ({
              ...user,
              role: user.role?.split(",").filter((r) => r) || [],
            }))
          );
        }
      })
      .catch((err) => {
        Prompt({ type: "error", message: err.message });
      });
  }, []);
  return (
    <div className={s.login} data-testid="login">
      <img src="/asset/new_login_img.jpg" />
      <div className={s.formWrapper}>
        <img src="/asset/logo.jpg" />
        <form
          onSubmit={handleSubmit(async (data) => {
            setLoading(true);
            if (his) {
              let token = sessionStorage.getItem("token");

              const endpoints = await fetch(defaultEndpoints.apiUrl)
                .then((res) => res.json())
                .then((data) => {
                  const _urls = {};
                  if (data._embedded.apiurls) {
                    data._embedded.apiurls.forEach(({ url, action }) => {
                      _urls[action] = url;
                    });
                    return _urls;
                  }
                  return null;
                })
                .catch((err) => {
                  setLoading(false);
                });

              if (!endpoints || !Object.keys(endpoints).length) {
                setLoading(false);
                return Prompt({
                  type: "error",
                  message:
                    "Could not load HIS API endpoints. Please try again.",
                });
              }

              if (!token) {
                const salt = await fetch(
                  `${endpoints.getSalt}?userid=${data.username}`
                )
                  .then((res) => res.json())
                  .then((data) => data?.password)
                  .catch((err) => {
                    setLoading(false);
                  });
                if (!salt) {
                  setLoading(false);
                  return Prompt({
                    type: "error",
                    message: "Could not load salt. Please try again.",
                  });
                }
                const hash = bcrypt.hashSync(data.password, salt);
                await fetch(
                  `${endpoints.discardSession}?userId=${data.username}`
                );
                token = await fetch(`${endpoints.login}`, {
                  method: "POST",
                  headers: { "Content-type": "application/json" },
                  body: JSON.stringify({
                    userName: data.username,
                    passWord: hash,
                    authenticationType: 1,
                    authPassword: "",
                    isLDAPEnable: "Y",
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => data?.tokenID)
                  .catch((err) => {
                    setLoading(false);
                  });
                sessionStorage.setItem("token", token);
              }
              if (!token) {
                setLoading(false);
                return Prompt({
                  type: "error",
                  message: "Could not load Token. Please try again.",
                });
              }
              const user = await fetch(
                `${endpoints.users}?userId=${data.username}`,
                {
                  method: "GET",
                  headers: { SECURITY_TOKEN: token },
                }
              )
                .then((res) => res.json())
                .then((data) =>
                  data?.userViewList ? data.userViewList[0] : null
                )
                .catch((err) => {
                  setLoading(false);
                  return Prompt({
                    type: "error",
                    message: "Could not get user data. Please try again.",
                  });
                });

              if (!user) {
                sessionStorage.removeItem("token");
                setLoading(false);
                return Prompt({
                  type: "error",
                  message: "Could not log in. Please try again.",
                });
              }

              const userDetail = users.find(
                (u) => u.name.toLowerCase() === user.userId.toLowerCase()
              );

              if (!userDetail) {
                setLoading(false);
                return Prompt({
                  type: "error",
                  message:
                    "Please make sure that the logged in user is added in the Users master.",
                });
              }

              setEndpoints(endpoints);
              setUser({
                ...userDetail,
                ...user,
              });
              navigate(paths.incidentReport);
            } else {
              const _user = users.find(
                (u) => u.name === data.username && u.password === data.password
              );
              if (_user) {
                setUser(_user);
                navigate(paths.incidentReport);
              } else {
                setLoading(false);
                Prompt({
                  type: "error",
                  message: "Invalid credentials.",
                });
              }
            }
          })}
        >
          <h1>Sign In</h1>
          <section>
            <Checkbox
              label="Login with HIS"
              checked={his}
              onChange={(e) => setHis(e.target.checked)}
            />
          </section>
          <Input
            label={"Username"}
            {...register("username", {
              required: `Plase enter a Username`,
            })}
            error={errors.username}
          />
          <Input
            type="password"
            label="Password"
            {...register("password", {
              required: "Plase enter your password",
            })}
            error={errors.password}
          />
          <button className="btn w-100">Sign in</button>
        </form>
      </div>
    </div>
  );
}
