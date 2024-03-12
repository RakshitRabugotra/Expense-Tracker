"use client";
import PasswordChecklist from "react-password-checklist";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";
import { useState } from "react";
import Heading from "../(components)/Heading";
import Loader from "../(components)/Loader";
import styles from "./auth.module.css";

function loginUser({ email, password, router }) {
  let token = null;

  return fetch(
    process.env.SERVER + "/api/collections/users/auth-with-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identity: email,
        password: password,
      }),
    }
  )
    .then((resp) => {
      if (resp.status === 200) {
        return resp.json();
      }
      if (resp.status === 400) throw new Error("Network Error");
    })
    .then((json) => {
      token = json.token;
      router.replace(`/login?token=${token}`);
      return { code: 200 };
    })
    .catch((resp) => {
      // We've a failed authentication
      return { code: 400 };
    });
}

function FormError({ trigger, message }) {
  return (
    <div
      style={{
        visibility: !trigger ? "hidden" : "visible",
      }}
      className={styles.loginError}
    >
      <MdErrorOutline />
      <span>{message}</span>
    </div>
  );
}

function LoginComponent({ router }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    Promise.resolve(loginUser({ email, password, router })).then((result) => {
      setLoginSuccess(result?.code !== 400);
    });

    if (!loginSuccess) {
      setPassword("");
    }
    setLoading(false);
  };

  // Show the loading screen if we're processing...
  if (isLoading) return <Loader context={"login"} />;
  // Else the form
  return (
    <>
      <Heading text={"Login"} coloredText={"User"} />
      <form onSubmit={handleLogin} className="customForm">
        <label>
          <input
            required
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>E-mail</span>
        </label>

        <label>
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        {/* The error on login icon */}
        <FormError trigger={!loginSuccess} message={"Invalid Credentials"} />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
      <Link className="redirect-links" href="?register=true">
        Register Instead
      </Link>
    </>
  );
}

function RegisterComponent({ router }) {
  // The state of this component
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");
  const [isPasswordValid, setPasswordValid] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(true);

  // The loading state of the component
  const [isLoading, setLoading] = useState(false);

  // The submit handler
  const registerUser = (e) => {
    setLoading(true);
    e.preventDefault();

    // Check if the password is valid
    const user = {
      email: email,
      emailVisibility: true,
      password: password,
      passwordConfirm: passwordRep,
      name: fullname,
      monthly_limit: 100,
    };

    // Send a request to create the user
    fetch(process.env.SERVER + "/api/collections/users/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (response.status !== 200) {
          setRegisterSuccess(false);
          // Something went wrong
          throw "registered";
        }
        // Else, the user is created successfully
        return response.json();
      })
      .then((json) => {
        loginUser({
          email: user.email,
          password: user.password,
          router,
        });
      })
      .catch((error) => {
        setRegisterSuccess(false);
      });

    // Send an email verification request
    // await pb.collection("users").requestVerification(data.email);
    setLoading(false);
  };

  // If loading then display this
  if (isLoading) return <Loader context={"register"} />;

  return (
    <>
      <Heading text={"Register"} coloredText={"User"} />
      <form onSubmit={registerUser} className="customForm">
        <label htmlFor="fullname">
          <input
            required
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <span>Full Name</span>
        </label>
        <label htmlFor="email">
          <input
            required
            type="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>E-mail</span>
        </label>
        <label htmlFor="password">
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>
        <label htmlFor="password-repeat">
          <input
            required
            type="password"
            name="password-repeat"
            placeholder="Repeat Password"
            value={passwordRep}
            onChange={(e) => setPasswordRep(e.target.value)}
          />
          <span>Repeat Password</span>
        </label>

        <button type="submit" disabled={isLoading || !isPasswordValid}>
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>
      {/* Is the user already registered? */}
      <div
        style={{
          visibility: registerSuccess ? "hidden" : "visible",
        }}
        className={styles.loginError}
      >
        <MdErrorOutline />
        <span>User already registered — Login</span>
      </div>
      {/* Password validation */}
      <PasswordChecklist
        rules={["minLength", "specialChar", "number", "capital", "match"]}
        minLength={8}
        value={password}
        valueAgain={passwordRep}
        onChange={setPasswordValid}
      />
      <Link className="redirect-links" href="/auth">
        Login Instead
      </Link>
    </>
  );
}

export default function AuthPage() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("register");
  const router = useRouter();

  return (
    <div className="page">
      {isRegister ? (
        <RegisterComponent router={router} />
      ) : (
        <LoginComponent router={router} />
      )}
    </div>
  );
}
