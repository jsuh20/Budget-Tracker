import './App.css';
import {useState, useEffect} from 'react'

function App() {

  const [plusMinus, setPlusMinus] = useState(''); 
  const [name,setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(()=> {
    getTransactions().then(setTransactions)
  }, [])

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL+'/transactions'
    const response = await fetch(url);
    console.log(response)
    return await response.json();
  }

  function handleSelectChange(event) {
    setPlusMinus(event.target.value); // Update the state when the user selects an option
  }

  function addNewTransaction(ev) {
    ev.preventDefault()
    const url = process.env.REACT_APP_API_URL+'/transaction';
    const price = name.split(' ')[0];
    console.log(price)
    if (!plusMinus) {
      alert('Please select + or -'); // Ensure the user has selected an option
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({
        plusMinus,
        price,
        name: name.substring(price.length+1),
        description, 
        datetime 
      })
    }).then(response => {
      response.json().then(json => {
        setPlusMinus('');
        setName('');
        setDateTime('');
        setDescription('');
      })
    }).then(json => {
      console.log('Parsed JSON:', json);
    }).catch(error => {
      console.error('Fetch error:', error);
    });
  }

  function deleteTransaction(name) {
    const url = `${process.env.REACT_APP_API_URL}/deleteTransaction/${name}`;

    fetch(url, {
      method: 'DELETE',
    }).then(response => {
      console.log('response: ' + response)
      if (response.ok) {
        setTransactions(transactions.filter(transaction => transaction.name !== name));
        console.log("transations: " + transactions);
      }
    }).catch(error => {
      console.error('Delete error:', error);
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    if (transaction.plusMinus == '+') {
      balance = balance + transaction.price;
    } else if (transaction.plusMinus == '-'){
      balance = balance - transaction.price;
    }
  }
  balance = balance.toFixed(2)
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0]
  return (
    <main>
      <h1> Balance: ${balance}<span>.{fraction}</span></h1> 
      <form onSubmit={addNewTransaction}>
        <div className="form-row">
          <div className="basic">
            <select style={{height: '32px'}} value={plusMinus} onChange={handleSelectChange}>
              <option value="" disabled selected> +/-</option>
              <option value="+">income</option>
              <option value="-">expense</option>
            </select>
            <input type="text" 
              value={name}
              onChange={ev => setName(ev.target.value)}
              placeholder={'200 tv'}/>
            <input value={datetime} 
                  onChange={ev => setDateTime(ev.target.value)}
                  type="datetime-local"/>
          </div>
        </div>
        <div className="description">
          <input type="text" value={description}
                onChange={ev => setDescription(ev.target.value)}
                placeholder={'description'}/>
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (
          <div className="transaction">
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={"price "+(transaction.plusMinus=='-'?'red':'green')}>
                <span>{transaction.plusMinus === '-' ? '-' : ''}</span>{transaction.price}</div>
              <div className="datetime">2022-12-28</div>
              <button onClick={() => deleteTransaction(transaction.name)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
