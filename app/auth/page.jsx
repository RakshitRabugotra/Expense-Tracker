"use client";
import { useState } from "react";
import Form from "../(components)/Form";
import styles from "./auth.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Loader from "../(components)/Loader";

const loginUser = async ({ email, password, router }) => {

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
    router.replace(`/login?token=${userData.token}`);
  } catch (error) {
    console.log(error);
    // alert("Incorrect Username/Password\nPlease retry...");
    throw error;
  }
};

function LoginComponent({ router }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);


  const handleLogin = async() => {
    setLoading(true);
    await loginUser({ email, password, router })
    setLoading(false);
  }

  // Show the loading screen if we're processing...
  if(isLoading) return <Loader context={"login"}/>
  // Else the form
  return (
    <>
      <Form
        heading={{ text: "Login", coloredText: "User" }}
        submitHandler={handleLogin}
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
      <Link className="redirect-links" href="?register=true">Register Instead</Link>
    </>
  );
}

function RegisterComponent({ router }) {
  // The state of this component
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRep, setPasswordRep] = useState("");

  // The loading state of the component
  const [isLoading, setLoading] = useState(false);

  // The submit handler
  const registerUser = async () => {
    setLoading(true);
    const user = {
      email: email,
      emailVisibility: true,
      password: password,
      passwordConfirm: password,
      name: fullname,
      monthly_limit: 100,
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
      await loginUser({
        email: user.email,
        password: user.password,
        router
      });
    }
    // Send an email verification request
    // await pb.collection("users").requestVerification(data.email);
    setLoading(false);
  };

  
  // If loading then display this
  if(isLoading) return <Loader context={"register"}/>

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
      <Link className="redirect-links" href="#">Login Instead</Link>
    </>
  );
}

export default function AuthPage() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("register");
  const router = useRouter();

  return (
    <div className={styles.page}>
      {isRegister ? (
        <RegisterComponent router={router}/>
      ) : (
        <LoginComponent router={router}/>
      )}
    </div>
  );
}
