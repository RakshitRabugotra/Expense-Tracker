"use client";
import CountUp from "react-countup";

export default function AnimCountUp({
  start,
  end,
  duration,
  decimals,
  delay,
  useEasing,
  prefix,
}) {
  return (
    <CountUp
      start={start}
      end={end}
      duration={duration}
      decimals={decimals}
      delay={delay}
      useEasing={useEasing}
    >
      {({ countUpRef }) => {
        return (
          <div>
            <h6>{prefix}</h6>
            <span ref={countUpRef} />
          </div>
        );
      }}
    </CountUp>
  );
}
