import GraphBox from "../(components)/GraphBox";
import Heading from "../(components)/Heading";

export default function StatsPage() {
  return (
    <div className="page">
      <Heading text={"Your"} coloredText={"Statistics"}/>
      <GraphBox />
    </div>
  );
}
