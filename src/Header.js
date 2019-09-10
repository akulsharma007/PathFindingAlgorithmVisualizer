import React, { Component } from 'react';
import { FaAngleDown } from "react-icons/fa";
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAlgorithm:"",
            selectedSpeed:Number
        }
    }

    algorithmSelect = (selectedAlgorithm)=>{
        this.props.algorithmSelect(selectedAlgorithm);
        this.setState({
            selectedAlgorithm
        })
    }

    speedSelect = (selectedSpeed)=>{
        this.setState({
            selectedSpeed
        })
    }

    calculate = () =>{
        if(this.state.selectedAlgorithm!=""){
            this.props.calculate(this.state.selectedAlgorithm,this.state.selectedSpeed);
        }
    }

    render() {
        return (
            <>
                <ul>
                    <li className="dropdown">
                        <button className="dropbtn">Algorithms{" "}<FaAngleDown/></button>
                        <div className="dropdown-content">
                            <button onClick={()=>this.algorithmSelect("dijkstra")}>Dijkstra's Algorithm</button>
                            <button onClick={()=>this.algorithmSelect("A*")}>A* Search Algorithm</button>
                        </div>
                    </li>
                    
                    <li className="dropdown">
                        <button className="dropbtn">Mazes{" "}<FaAngleDown/></button>
                        <div className="dropdown-content">
                        <button>soon</button>
                        </div>
                    </li>

                    <li><button onClick={this.calculate}>Calculate</button></li>
                    <li className="rightFloat"><button onClick={()=>this.props.clearGrid()}>Clear Grid</button></li>
                    <li className="dropdown rightFloat">
                        <button className="dropbtn">Speed{" "}<FaAngleDown/></button>
                        <div className="dropdown-content">
                            <button onClick={()=>this.speedSelect(0)}>Original</button>
                            <button onClick={()=>this.speedSelect(4)}>Fast</button>
                            <button onClick={()=>this.speedSelect(1)}>Medium</button>
                            <button onClick={()=>this.speedSelect(2)}>Slow</button>
                        </div>
                    </li>
                </ul>
            </>
        )
    }
}

export default Header;