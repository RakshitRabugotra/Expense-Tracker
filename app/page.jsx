import styles from "./page.module.css";
import Heading from "./(components)/Heading";
import GraphBox from "./(components)/GraphBox";

export default function Home() {

  const username = "Rakshit";

  return (
    <main className={styles.main}>  
      <Heading text={"Hello,"} coloredText={username + "!"}/>
      {/* The box showing the graph */}
      <GraphBox/>
    </main>
  );
}
