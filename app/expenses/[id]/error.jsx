'use client';

export default function ErrorExpense({ error, reset }) {

    return (<div>
        <p>An error occurred: {error.message}</p>
        <button onClick={() => reset()}>Retry</button>
    </div>);
}