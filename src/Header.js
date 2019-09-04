import React, { Component } from 'react';
import { FaAngleDown } from "react-icons/fa";
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <ul>
                    <li className="dropdown">
                        <button className="dropbtn">Algorithms{" "}<FaAngleDown/></button>
                        <div className="dropdown-content">
                            <button>Link 1</button>
                            <button>Link 2</button>
                            <button>Link 3</button>
                        </div>
                    </li>
                    
                    <li className="dropdown">
                        <button className="dropbtn">Mazes{" "}<FaAngleDown/></button>
                        <div className="dropdown-content">
                            <button>Link 1</button>
                            <button>Link 2</button>
                            <button>Link 3</button>
                        </div>
                    </li>

                    <li><button>Calculate</button></li>
                    <li className="rightFloat"><button>Clear Map</button></li>
                    <li className="rightFloat"><button>Clear Path</button></li>
                    <li className="rightFloat"><button>Clear Walls</button></li>
                </ul>
            </>
        )
    }
}

export default Header;