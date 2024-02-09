import styles from "./component.module.css";

export default function Heading({ text, coloredText}) {

    return (<h3 className={styles.heading}>
        {text}
        <p>{coloredText}</p>
    </h3>);
}