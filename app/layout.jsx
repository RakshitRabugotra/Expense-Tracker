import { Inter } from "next/font/google";
import styles from "./page.module.css";
import "./globals.css";
import Link from "next/link";

// Icons
import { IoIosHome } from "react-icons/io";
import { IoReceiptSharp } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { MdAccountCircle } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";


export const metadata = {
  title: "Expense Tracker",
  description: "An app to track all your expenses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* The navbar */}
        <nav className={styles.navbar}>
          <Link className={styles.link} href="/"><IoIosHome/></Link>
          <Link className={styles.link} href="/expenses"><IoReceiptSharp/></Link>
          <Link className={`${styles.link} ${styles.bigIcon}`} href="/expenses/new"><IoMdAddCircle/></Link>
          <Link className={styles.link} href="/stats"><IoStatsChart/></Link>
          <Link className={styles.link} href="/profile"><MdAccountCircle/></Link>
        </nav>
      </body>
    </html>
  );
}
