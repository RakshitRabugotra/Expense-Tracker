import { Inter } from "next/font/google";
import styles from "./page.module.css";
import "./globals.css";
import Link from "next/link";

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
          <Link href="/">Home</Link>
          <Link href="/expenses">Expenses</Link>
          <Link href="/expenses/new">New</Link>
        </nav>
      </body>
    </html>
  );
}
