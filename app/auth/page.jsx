"use client";
import { useState } from "react";
import Form from "../(components)/Form";
import styles from "./auth.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const loginUser = async ({ email, password, callbackUrl, router }) => {
  try {
    // Try logging the user in
    const response = await fetch(
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
    );

    const userData = await response.json();
    if (response.status === 400) throw userData;

    // On successful login, send a login request for the middleware
    try {
      const resp = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userData.token,
        },
      });
      // If the status is not good, then return
      if (resp.status !== 200) return;
      // Check if we have any callbackURL
      if (typeof callbackUrl !== "undefined") {
        router.replace(callbackUrl);
      }
    }
    catch(error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    // alert("Incorrect Username/Password\nPlease retry...");
    throw error;
  }
};

function LoginComponent({ callbackUrl, router }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Form
        heading={{ text: "Login", coloredText: "User" }}
        submitHandler={() =>
          loginUser({ email, password, callbackUrl, router })
        }
        buttonText={{
          loading: "Loading",
          normal: "Login",
        }}
      >
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
      </Form>
      <Link
        className="redirect-links"
        href={
          "?register=1" + (!callbackUrl ? "" : `&callbackUrl=${callbackUrl}`)
        }
      >
        Register Instead
      </Link>
    </>
  );
}

function RegisterComponent({ router, callbackUrl }) {
  // The state of this component
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");

  const registerUser = async () => {
    const user = {
      email: email,
      emailVisibility: true,
      password: password,
      passwordConfirm: password,
      name: fullname,
    };

    // Send a request to create the user
    const response = await fetch(
      process.env.SERVER + "/api/collections/users/records",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }
    );

    if (response.status === 200) {
      // The user is created successfully
      const data = await response.json();
      // The user is created successfully
      // Login the user
      loginUser({
        email: user.email,
        password: user.password,
        callbackUrl,
        router,
      });
    }
    // Send an email verification request
    // await pb.collection("users").requestVerification(data.email);
  };

  return (
    <>
      <Form
        heading={{ text: "Register", coloredText: "User" }}
        submitHandler={registerUser}
        buttonText={{
          loading: "Loading",
          normal: "Register",
        }}
      >
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

        {/* <label htmlFor="password-repeat">
        <input
        required
          type="password"
          name="password-repeat"
          placeholder="Repeat Password"
          value={passwordRep}
          onChange={(e) => setPasswordRep(e.target.value)}
        />
        <span>Repeat Password</span>
      </label> */}
      </Form>
      <Link
        className="redirect-links"
        href={!callbackUrl ? "" : `?callbackUrl=${callbackUrl}`}
      >
        Login Instead
      </Link>
    </>
  );
}

export default function AuthPage() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("register");
  console.log("is register? ", isRegister);
  const callbackUrl = searchParams.get("callbackUrl");
  console.log("callback: ", callbackUrl);
  const router = useRouter();

  return (
    <div className={styles.page}>
      {isRegister ? (
        <RegisterComponent callbackUrl={callbackUrl} router={router} />
      ) : (
        <LoginComponent callbackUrl={callbackUrl} router={router} />
      )}
    </div>
  );
}
