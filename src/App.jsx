import axios from 'axios'
import { useState ,useEffect } from 'react'
import './Styles/App.scss'


function App() {

  const [currency,setCurrency] = useState(null)
  const [time , setTime] = useState('')
  const [isCurrentRates, setIsCurrentRates] = useState(false) // To show the current rates component when its button is clicked , and vice versa

  useEffect(()=> {
    const getCurrency = async () => {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const data = await response.json()
      setCurrency(data.bpi)
      setTime(data.time.updated)
    }

    getCurrency()
  }, [])

  function getCurrentTime() {
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });
    return formattedDate;
  }


  return (
    <div className="App">
      <header>
        <h2 className='header-title'>BTC Currency Converter</h2>
        <div className='header-buttons'>
          <button onClick={()=> {setIsCurrentRates(true)}}>Current Rates</button>
          <button onClick={()=> {setIsCurrentRates(false)}}>Convert To BTC</button>
        </div>
      </header>

      <div className='main'>
        {isCurrentRates ? <CurrentRates currencyData={currency}/> : <Conversions />}
      </div>

      <div className='time-container'>
        <p className='time'>{time}</p>
        <p className='time'>{getCurrentTime()} ( User )</p>
      </div>
    </div>
  )
}

const CurrentRates = ({currencyData}) => {
  
  const USD = currencyData.USD.rate_float.toFixed(3)
  const EUR = currencyData.EUR.rate_float.toFixed(3)
  const GBP = currencyData.GBP.rate_float.toFixed(3)

  return <div>
    <h2>{USD} $ (USD) to 1 BTC , {(1/USD).toFixed(6)} BTC to USD</h2>
    <h2>{EUR} € (EUR) to 1 BTC , {(1/EUR).toFixed(6)} BTC to EUR</h2>
    <h2>{GBP} £ (GBP) to 1 BTC , {(1/GBP).toFixed(6)} BTC to GBP</h2>

  </div>
}

const Conversions = () => {
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState(0);
  const [btcValue, setBtcValue] = useState(0);
  const [currencyObj, setCurrencyData] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc'); // to sort the exchange rates


  useEffect(()=> {
    const getCurrency = async () => {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      const data = await response.json()
      setCurrencyData(data.bpi)
      // setTime(data.time.updated)
    }

    getCurrency()
  }, [])


  function handleCurrencyChange(event) {
    setCurrency(event.target.value);
  }

  function handleAmountChange(event) {
    setAmount(event.target.value);
  }

  function handleConvert() {

    // Calcuate the value of BTC base on use input
    const valueInBtc = (amount * (1 / currencyObj[currency].rate_float)).toFixed(3);
    setBtcValue(valueInBtc);
  }

  // to sort the exchange rates  
  const sortExchangeRates = (exchangeRates, sortOrder) => {
    return exchangeRates.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.rate_float - b.rate_float;
      } else {
        return b.rate_float - a.rate_float;
      }
    });
  };

  const sortedExchangeRates = sortExchangeRates(
    [    { currency: 'USD', rate: currencyObj && currencyObj.USD.rate, rate_float: currencyObj && currencyObj.USD.rate_float },    { currency: 'EUR', rate: currencyObj&& currencyObj.EUR.rate, rate_float: currencyObj&& currencyObj.EUR.rate_float },    { currency: 'GBP', rate: currencyObj && currencyObj.GBP.rate, rate_float: currencyObj && currencyObj.GBP.rate_float },  ],
    sortOrder
  );


  return (
    <div>
      
      <div className='convert-currency-container'>
        <label htmlFor="currency-select">Select Currency:</label>
        <select className='dropdown-currency' id="currency-select" value={currency} onChange={handleCurrencyChange}>
          <option value="USD">USD</option>
          <option value="EUR">Euro</option>
          <option value="GBP">GBP</option>
        </select>

        <label htmlFor="amount-input">Enter amount:</label>
        <input type="number" id="amount-input" value={amount} onChange={handleAmountChange} />

        <button onClick={handleConvert}>Convert to BTC</button>

        <h2>{amount} {currency} is equal to {btcValue} BTC</h2>
      </div>
    
      <div>
        <button className='sort-button' onClick={()=>setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort The Exchange Rates <br/> (Ascending or Descending)
        </button>

        {sortedExchangeRates.map((exchangeRate) => (
          <li key={exchangeRate.currency}>
            {exchangeRate.currency} to BTC: {exchangeRate.rate} ({exchangeRate.rate_float})
          </li>
        ))}

      </div>
    </div>
  )
}

export default App;
