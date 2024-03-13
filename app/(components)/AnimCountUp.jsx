"use client";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimCountUp({
  start,
  end,
  duration,
  decimals,
  delay,
  useEasing,
  prefix,
  currencySymbol,
  counterWrapperClass,
  styleClass,
  monthlyLimit
}) {

  const [color, setColor] = useState("#fff");

  useEffect(() => {
    const ratio = end/monthlyLimit;
    if(ratio < 0.34) setColor("green");
    else if(ratio < 0.66) setColor("yellow");
    else setColor("red");
  }, [end, monthlyLimit]);

  return (
    <CountUp
      start={start}
      end={end}
      duration={duration}
      decimals={decimals}
      delay={delay}
      useEasing={useEasing}
      prefix={currencySymbol}
    >
      {({ countUpRef }) => {
        return (
          <div className={styleClass}>
            <h3>{prefix}</h3>
            <motion.div
              initial={{ backgroundColor: "#fff", opacity: 0 }}
              animate={{ backgroundColor: color, opacity: 1 }}
              exit={{ backgroundColor: "#fff", opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.75 }}
              className={counterWrapperClass}
              style={{boxShadow: `0px 0px 1rem ${color}`}}
            >
              <span ref={countUpRef} />
            </motion.div>
          </div>
        );
      }}
    </CountUp>
  );
}
