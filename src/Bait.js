import React from 'react'

function Bait(props) {
    const style = { 
        left: `${props.baitPosition[0]}%`,
        top: `${props.baitPosition[1]}%`,
    }
    return (
        <div className="bait" style={style}>
        </div>
    )
}

export default Bait
