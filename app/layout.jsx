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


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Expense Tracker",
  description: "An app to track all your expenses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        {/* The navbar */}
        <nav className={styles.navbar}>
          <Link href="/"><IoIosHome/></Link>
          <Link href="/expenses"><IoReceiptSharp/></Link>
          <Link href="/expenses/new" className={styles.roundIcon}><IoMdAddCircle/></Link>
          <Link href="/stats"><IoStatsChart/></Link>
          <Link href="/profile"><MdAccountCircle/></Link>
        </nav>
      </body>
    </html>
  );
}
