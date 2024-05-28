import React, {useState} from 'react'

export const AddTransaction = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState(0);
    return (
        <>
            <h3>Add new transaction</h3>
            <form id="form">
            <div className="form-control">
                <label for="text">Text</label>
                <input type="text" value={text} onChanage={(e) => setText(e.target.value)} placeholder="Enter text..." />
            </div>
            <div className="form-control">
                <label for="amount"
                >Amount <br />
                (negative - expense, positive - income)</label
                >
                <input type="number" value={amount} onChanage={(e) => setAmount(e.target.value)} placeholder="Enter amount..." />
            </div>
            <button className="btn">Add transaction</button>
            </form>
        </>
    )
}

