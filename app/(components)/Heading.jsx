import styles from "./component.module.css";

export default function Heading({ text, coloredText}) {

    return (<h3 className={styles.heading}>
        {text}
        <div>{coloredText}</div>
    </h3>);
}