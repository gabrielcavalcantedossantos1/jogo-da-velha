import React from 'react'

const Square = ({ value, onClick}) => {
  return (
    <button className={`square ${value === "X" ? "x" : value === " O" ? "o" : ''}`} onClick={onClick}>{value}</button>
  )
}

export default Square