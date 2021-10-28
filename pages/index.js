import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
  const [prevOperand, setPrevOperand] = useState('')
  const [currentOperand, setCurrentOperand] = useState('')
  const [operation, setOperation] = useState()

  const clear = () => {
    setPrevOperand('')
    setCurrentOperand('')
    setOperation()
  }

  const deleteOne = () => {
    setCurrentOperand(currentOperand => currentOperand.toString().slice(0, -1))
  }

  const appendNumber = (num) => {
    if (num === '.' && currentOperand.toString().includes('.')) return false
    setCurrentOperand(currentOperand => currentOperand.toString().concat(num))
  }

  const getDisplayNumber = (number) => {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]

    let integerDisplay

    if(isNaN(integerDigits)) integerDisplay = ''
    else integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
    
    if(decimalDigits !== null && decimalDigits !== undefined ) return `${integerDisplay}.${decimalDigits}`
    else return integerDisplay
  }

  const chooseOperation = (operation) => {
    if(currentOperand === '') {
      if(prevOperand === "") setPrevOperand(0)
      return setOperation(operation)
    }
    
    if(operation === '%') {
      if(currentOperand === '') return false
      if(prevOperand !== '') {
        setCurrentOperand((compute()) / 100)
        setPrevOperand('')
      }
      else setCurrentOperand(currentOperand => currentOperand / 100)
      return setOperation(undefined)
    }

    if(prevOperand !== '') {
      setPrevOperand(compute())
      setOperation(operation)
      return setCurrentOperand('')
    }

    setPrevOperand(currentOperand)
    setOperation(operation)
    setCurrentOperand('')
  }

  const compute = () => {
    let computation
    const cf = (prevOperand || currentOperand) && (!prevOperand.toString().split('.')[1] || !currentOperand.toString().split('.')[1]) ? 0 : 
      prevOperand.toString().split('.')[1].length < currentOperand.toString().split('.')[1].length ? 
      currentOperand.toString().split('.')[1].length : prevOperand.toString().split('.')[1].length
    const prev = parseFloat(prevOperand)
    const curr = parseFloat(currentOperand)
    console.log(Math.pow(10, cf))
    
    if(isNaN(prev) || isNaN(curr)) return false

    switch (operation) {
      case '+':
        if(cf > 0) computation = ((prev * Math.pow(10, cf)) + (curr * Math.pow(10, cf))) / Math.pow(10, cf)
        else computation = prev + curr
        break;
      case '-':
        if(cf > 0) computation = ((prev * Math.pow(10, cf)) - (curr * Math.pow(10, cf))) / Math.pow(10, cf)
        else computation = prev - curr
        break;
      case '×':
        if(cf > 0) computation = ((prev * Math.pow(10, cf)) * (curr * Math.pow(10, cf))) / Math.pow(10, (cf * 2))
        else computation = prev * curr
        break;
      case '÷':
        if(cf > 0) computation = ((prev * Math.pow(10, cf)) / (curr * Math.pow(10, cf)))
        computation = prev / curr
        break;
    
      default:
        break;
    }
    
    setOperation(undefined)
    setPrevOperand('')
    setCurrentOperand(computation)
    return computation
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault()
      const numbers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.' ]
      const operation = [ '%', '-', '+', '=', '/', '*' ]

      let key = e.key

      if(numbers.includes(key)) appendNumber(key)
      if(operation.includes(key)) {
        if(key === "/") key = '÷'
        if(key === "*") key = '×'
        chooseOperation(key)
      }
      if(key === "Enter") compute()
      if(key === "Backspace") deleteOne()
      if(key === "Delete") clear()
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => removeEventListener('keydown', handleKeyPress)

  }, [currentOperand])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans font-normal bg-gray-200">
      <Head>
        <title>Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="grid items-center justify-center grid-cols-4 bg-gray-900 shadow-2xl p-5 sm:p-10 rounded-3xl">
        <div className="flex flex-col items-end justify-around col-span-full bg-gray-200 rounded-3xl w-full p-2 mb-4 font-bold h-28">
          <div className="flex flex-row-reverse overflow-hidden text-2xl text-gray-500 w-96 text-right">{`${getDisplayNumber(prevOperand)} ${operation ? operation : ''}`}</div>
          <div className="flex flex-row-reverse overflow-hidden pt-2 text-4xl text-black w-96 text-right">{getDisplayNumber(currentOperand)}</div>
        </div>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-200 m-2 text-gray-700 hover:bg-gray-50" onClick={clear}>AC</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-200 m-2 text-gray-700 hover:bg-gray-50" onClick={deleteOne}>DEL</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-200 m-2 text-gray-700 hover:bg-gray-50" onClick={e => chooseOperation(e.target.innerText)}>%</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-[#fd8c3b] m-2 text-white hover:bg-[#FFA655]" onClick={e => chooseOperation(e.target.innerText)}>÷</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>1</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>2</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>3</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-[#fd8c3b] m-2 text-white hover:bg-[#FFA655]" onClick={e => chooseOperation(e.target.innerText)}>×</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>4</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>5</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>6</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-[#fd8c3b] m-2 text-white hover:bg-[#FFA655]" onClick={e => chooseOperation(e.target.innerText)}>-</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>7</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>8</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>9</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-[#fd8c3b] m-2 text-white hover:bg-[#FFA655]" onClick={e => chooseOperation(e.target.innerText)}>+</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>00</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>0</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-gray-500 m-2 text-white hover:bg-gray-400" onClick={e => appendNumber(e.target.innerText)}>.</button>
        <button className="w-16 h-16 sm:w-24 sm:h-24 pointer text-3xl outline-none rounded-full font-bold bg-[#fd8c3b] m-2 text-white hover:bg-[#FFA655]" onClick={compute}>=</button>
      </div>
    </div>
  )
}
