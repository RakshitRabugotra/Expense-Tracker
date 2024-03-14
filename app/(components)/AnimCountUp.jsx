"use client";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { EXPENDITURE_COLORS, clampNumber, hexToRgb, lerpRGB } from "../(lib)/utils";

export default function AnimCountUp({
  start,
  end,
  duration,
  decimals,
  delay,
  useEasing,
  prefix,
  currencySymbol,
  monthlyLimit,
  counterWrapperClass,
  styleClass,
}) {
  const [color, setColor] = useState("#fff");
  const [countEnd, setCountEnd] = useState(end);

  // The color of the counter will be calculated like this
  const counterColor = useMemo(() => {
    const ratio = end / monthlyLimit;

    // Check where the ratio lies
    const newColorRGB = lerpRGB(
      hexToRgb(EXPENDITURE_COLORS[ratio <= 0.5 ? 0 : 1]),
      hexToRgb(EXPENDITURE_COLORS[ratio <= 0.5 ? 1 : 2]),
      clampNumber((ratio <= 0.5 ? ratio * 2 : (ratio - 0.5) * 2), 0, 1)
    );
    /*
    // The above statement translate to:
    if (ratio <= 0.5) {
      // It is between green and orange
      // Linearly interpolate between these two
      newColorRGB = lerpRGB(
        hexToRgb(EXPENDITURE_COLORS[0]),
        hexToRgb(EXPENDITURE_COLORS[1]),
        ratio * 2
      );
    } else {
      // It is between orange and red
      // Linearly interpolate between these two
      newColorRGB = lerpRGB(
        hexToRgb(EXPENDITURE_COLORS[0]),
        hexToRgb(EXPENDITURE_COLORS[1]),
        (ratio - 0.5) * 2
      );
    }
    */
    return `rgb(${newColorRGB.r}, ${newColorRGB.g}, ${newColorRGB.b})`;
  }, [end, monthlyLimit]);

  // Change the counter color whenever it's calculated
  useEffect(() => {
    setColor((prev) => counterColor);
  }, [counterColor]); 

  useEffect(() => {
    setCountEnd(end);
  }, [end]);

  return (
    <CountUp
      start={start}
      end={countEnd}
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
              style={{ boxShadow: `0px 0px 1rem ${color}` }}
            >
              <span ref={countUpRef} />
            </motion.div>
          </div>
        );
      }}
    </CountUp>
  );
}
