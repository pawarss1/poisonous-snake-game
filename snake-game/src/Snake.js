import React from 'react'

function Snake(props) {
    return (
        <div>
           {
            props.snakeArr.map((curSnake, index) => {
                const style = {
                    left: `${curSnake[0]}%`,
                    top: `${curSnake[1]}%`,
                }
               return (
                <div className="snake" key={index} style={style}></div>
               )
           })} 
        </div>
    )
}

export default Snake
