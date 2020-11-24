import './App.css';
import React, { Component } from 'react'
import Snake from './Snake'
import Bait from './Bait'

const getRandomBaitPoints = () => {  
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y =  Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      snakeArr: [[0,0],[1,0]],
      baitPosition : getRandomBaitPoints(),
      direction: "RIGHT",
      speed: 90,
      startFlag: false,
      gameOverFlag: false,
      highScore: Number(localStorage.getItem('snakeHighScore')) || 0,
    }
    this.moveSnake = this.moveSnake.bind(this);
    this.checkForBounds = this.checkForBounds.bind(this);  
    this.resetGame = this.resetGame.bind(this);
    this.checkForBaitConsumption = this.checkForBaitConsumption.bind(this);
    this.checkIfCollapse = this.checkIfCollapse.bind(this);
    this.increaseSpeed = this.increaseSpeed.bind(this);
    this.startGame = this.startGame.bind(this);
    this.restartGame = this.restartGame.bind(this);
    this.intervalId = null;
  }

  componentDidMount(){
    document.addEventListener("keydown", this.onKeyDown);
  }
  
  checkForBaitConsumption() {
    let newArr = [...this.state.snakeArr]
    let head = newArr[newArr.length - 1];
    if(head[0] === this.state.baitPosition[0] && head[1] === this.state.baitPosition[1]){
      if(this.state.direction === "RIGHT"){
        const newHead = [head[0] + 1, head[1]];
        newArr.push(newHead);
      }
      else if(this.state.direction === "LEFT"){
        const newHead = [head[0] - 1, head[1]];
        newArr.push(newHead);
      }
      else if(this.state.direction === "UP"){
        const newHead = [head[0], head[1] - 1];
        newArr.push(newHead);
      }
      else if(this.state.direction === "DOWN"){
        const newHead = [head[0], head[1] + 1];
        newArr.push(newHead);
      }
      this.increaseSpeed();
      this.setState({
        snakeArr: newArr,
        baitPosition : getRandomBaitPoints(),
      })
      console.log(this.state.speed);
    }
  }

  increaseSpeed() {
    clearInterval(this.intervalId);
    const curSpeed = Math.max(0, this.state.speed - 10);
    this.intervalId = setInterval(this.moveSnake, curSpeed);
    this.setState({
      speed: curSpeed,
    })
  }
  moveSnake() {
    let newArr = [...this.state.snakeArr]
    let head = newArr[newArr.length - 1];
    if(this.state.direction === "LEFT"){
      head = [head[0] - 1, head[1]];
    }
    else if(this.state.direction === "RIGHT"){
      head = [head[0] + 1, head[1]];
    }
    else if(this.state.direction === "UP"){
      head = [head[0], head[1] - 1];
    }
    else if(this.state.direction === "DOWN"){
      head = [head[0], head[1] + 1];
    }
    newArr.push(head);
    newArr.shift();
    this.setState({
      snakeArr: newArr,
    })
  }

  onKeyDown = (evt) => {
    if(evt.keyCode === 37 && this.state.direction !== "RIGHT"){
      //left
      this.setState({
        direction: "LEFT"
      })
    }
    else if(evt.keyCode === 38 && this.state.direction !== "DOWN"){
      //up
      this.setState({
        direction: "UP"
      })
    }
    else if(evt.keyCode === 39 && this.state.direction !== "LEFT"){
      //right
      this.setState({
        direction: "RIGHT"
      })
    }
    else if(evt.keyCode === 40 && this.state.direction !== "UP"){
      //down
      this.setState({
        direction: "DOWN"
      })
    }
  }

  componentDidUpdate() {
    this.checkForBounds();
    this.checkIfCollapse();
    this.checkForBaitConsumption();
  }

  checkIfCollapse() {
    let newArr = [...this.state.snakeArr]
    let head = newArr[newArr.length - 1];
    newArr.forEach((curCoOrDinates, index) => {
      if(curCoOrDinates[0] === head[0] && curCoOrDinates[1] === head[1] && index !== newArr.length - 1){
        this.resetGame();
      }
    })
  }

  checkForBounds() {
    const head = this.state.snakeArr[this.state.snakeArr.length - 1];
    if(head[0] >= 100 || head[1] >= 100 || head[1] < 0 || head[0] < 0){
      this.resetGame();
    }
  }

  resetGame() {
    const curScore = Math.max(this.state.highScore, this.state.snakeArr.length - 2)
    clearInterval(this.intervalId);
    this.setState({
      snakeArr: [[0,0],[1,0]],
      baitPosition : getRandomBaitPoints(),
      direction: "RIGHT",
      speed: 90,
      startFlag: false,
      gameOverFlag: true,
      highScore: curScore,
    })
  }

  startGame() {
    this.setState({
      startFlag: true,
      gameOverFlag: false,
    }, () =>{ 
      this.intervalId = setInterval(this.moveSnake, 90)
    });
  }

  restartGame() {
    clearInterval(this.intervalId);
    this.setState({
      snakeArr: [[0,0],[1,0]],
      baitPosition : getRandomBaitPoints(),
      direction: "RIGHT",
      speed: 90,
      startFlag: false,
      gameOverFlag: false,
    })
  }

  componentWillUnmount() {
    clearTimeout(this.intervalId)
    window.removeEventListener('keydown', this.onKeyDown)
  }

  render() {
    return (
      <>
        <h1 className="headingClass">
          Poisonous Snake.
        </h1>
        <button onClick={this.startGame} className="startBtnClass"disabled={this.state.startFlag}>Start</button>
        <button onClick={this.restartGame} className="restartBtnClass" >Reset</button>
        <div className="game-canvas">
          {!this.state.gameOverFlag && <Snake snakeArr={this.state.snakeArr}/> }
          {!this.state.gameOverFlag && <Bait baitPosition={this.state.baitPosition}/>}
          {this.state.gameOverFlag && <h1 className="gameOverClass">Game Over. Click start button to restart the game.</h1>}
        </div>
        <h1 className="scoreClass">
          Current Score: {this.state.snakeArr.length - 2}
        </h1>
        <h1 className="scoreClass">
          High Score: {this.state.highScore}
        </h1>
      </>
    )
  }
}

export default App;
