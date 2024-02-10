import GraphBox from "../(components)/GraphBox";
import Heading from "../(components)/Heading";
import styles from "./stats.module.css";

export default function StatsPage() {
  return (
    <div className={styles.page}>
      <Heading text={"Your"} coloredText={"Statistics"}/>
      <GraphBox />
    </div>
  );
}
