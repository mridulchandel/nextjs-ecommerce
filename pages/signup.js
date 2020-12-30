import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "../styles/Signup.module.css";
import baseUrl from "../helpers/baseUrl";

const Signup = () => {
  const { authCard } = styles;
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: "red" });
    } else {
      M.toast({ html: res2.message, classes: "green" });
      router.push("/login");
    }
  };

  return (
    <div className={`container card center-align ${authCard}`}>
      <h3>SignUp</h3>
      <form onSubmit={userSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          Signup
          <i className="material-icons right">forward</i>
        </button>
        <Link href="/login">
          <a>
            <h5>Already have a account?</h5>
          </a>
        </Link>
      </form>
    </div>
  );
};

export default Signup;
