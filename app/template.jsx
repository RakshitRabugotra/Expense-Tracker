"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      //   initial={{ y: 20, opacity: 0 }}
      //   animate={{ y: 0, opacity: 1 }}
      initial={{ y: -150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -150, opacity: 0 }}
      transition={{ ease: "easeOut", duration: 0.75 }}
      //   transition={{
      //     type: "spring",
      //     stiffness: 260,
      //     damping: 20,
      //   }}
    >
      {children}
    </motion.div>
  );
}
