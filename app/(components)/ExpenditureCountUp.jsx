"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CountUp } from "use-count-up";

// Custom modules
import {
  EXPENDITURE_COLORS,
  clampNumber,
  hexToRgb,
  lerpRGB,
} from "../(lib)/utils";

// The counting prop
function Count(countUpProps) {
  return (
    <CountUp {...countUpProps}>
      {({ value, reset }) => (
        <>
          <span>{value}</span>
        </>
      )}
    </CountUp>
  );
}

export default function ExpenditureCountUp({
  title,
  expenditure,
  duration,
  currencySymbol,
  monthlyLimit,
  counterWrapperClass,
  styleClass,
}) {
  const [color, setColor] = useState("#fff");
  const [countEnd, setCountEnd] = useState(expenditure);

  // The color of the counter will be calculated like this
  const counterColor = useMemo(() => {
    const ratio = expenditure / monthlyLimit;
    // Check where the ratio lies
    const newColorRGB = lerpRGB(
      hexToRgb(EXPENDITURE_COLORS[ratio <= 0.5 ? 0 : 1]),
      hexToRgb(EXPENDITURE_COLORS[ratio <= 0.5 ? 1 : 2]),
      clampNumber(ratio <= 0.5 ? ratio * 2 : (ratio - 0.5) * 2, 0, 1)
    );
    return `rgb(${newColorRGB.r}, ${newColorRGB.g}, ${newColorRGB.b})`;
  }, [expenditure, monthlyLimit]);

  // Change the counter color whenever it's calculated
  useEffect(() => {
    setColor((prev) => counterColor);
  }, [counterColor]);

  useEffect(() => {
    setCountEnd(expenditure);
  }, [countEnd, expenditure]);

  const countUpProps = {
    isCounting: true,
    start: 0,
    end: expenditure,
    duration: duration,
    easing: "easeOutCubic", // easeOutCubic | easeInCubic | linear
    shouldUseToLocaleString: true,
    toLocaleStringParams: {
      locale: 'en-IN', // set locale here
      // set options here
      options: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
    prefix: currencySymbol,
    decimalPlaces: 2,
    thousandsSeparator: ",",
    decimalSeparator: ".",
  };

  return (
    <div className={styleClass}>
      <h3>{title}</h3>
      <motion.div
        initial={{ backgroundColor: "#fff", opacity: 0 }}
        animate={{ backgroundColor: color, opacity: 1 }}
        exit={{ backgroundColor: "#fff", opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.75 }}
        className={counterWrapperClass}
        style={{ boxShadow: `0px 0px 1rem ${color}` }}
      >
        <Count {...countUpProps}/>
      </motion.div>
    </div>
  );
}
