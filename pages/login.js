import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import styles from "../styles/Signup.module.css";
import baseUrl from "../helpers/baseUrl";

const Login = () => {
  const { authCard } = styles;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const res2 = await res.json();

    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
    } else {
      M.toast({ html: "Logged In", classes: "green" });
      Cookies.set("token", res2.token);
      Cookies.set("user", res2.user);
      router.replace("/account");
    }
  };

  return (
    <div className={`container card center-align ${authCard}`}>
      <h3>LOGIN</h3>
      <form onSubmit={userLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #1565c0 blue darken-3"
          type="submit"
        >
          Login
          <i className="material-icons right">forward</i>
        </button>
        <Link href="/signup">
          <a>
            <h5>Don't have a account?</h5>
          </a>
        </Link>
      </form>
    </div>
  );
};

export default Login;
