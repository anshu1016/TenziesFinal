

import React from "react"
import Die from "./components/die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [diceCount, setDiceCount] = React.useState(0)
    const [timeStarted, setTimeStarted] = React.useState(false)
    const [time, setTime] = React.useState(0)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
        
    }, [dice])

   
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    const bestT = localStorage.getItem('bestTime')
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            if(bestT === null) {localStorage.setItem('bestTime', time)}
            else if(time < bestT) {localStorage.setItem('bestTime', time)}
           
            setTenzies(false)
            setDice(allNewDice())
            setTime(0)
        }
        
        setDiceCount(old => old+1)
        if(tenzies){
            setDiceCount(0)
        }
        if(diceCount === 0) {timeStarted ? '' : setTimeStarted(true)}
    }
    // timer
    
    React.useEffect(()=>{
        let interval = null;

        if (timeStarted) {
        interval = setInterval(() => {
            setTime((prevTime) => prevTime + 10);
        }, 10);
        } else if (!timeStarted) {
        clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [timeStarted])
    
    
    function holdDice(id) {
        timeStarted ? '' : setTimeStarted(true)
        setDice(oldDice => oldDice.map(die => {
            return (die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die)
        }))
    }
    
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    React.useEffect(() => { 
        tenzies ? setTimeStarted(false) : '' 
    }, [time])
    
    let myTime = (wow) => ("0" + Math.floor((wow / 60000) % 60)).slice(-2) + ':' + ("0" + Math.floor((wow /1000) % 60)).slice(-2) + ':' + ("0" + ((wow / 10) % 100)).slice(-2)

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
         
            <p>Dice Count - <span className='count'>{diceCount}</span></p>
            <p>Time - <span className='count'>{myTime(time)}</span></p>
            <p>Best Time - <span className='count'>{myTime(bestT)}</span></p>
            
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
