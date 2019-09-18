import React, { Component } from 'react';
import './Test.css';

class Test extends Component {
    constructor(props) {
        super(props);
    }

    checkBoxChange =(e)=>{
        console.log(e.target.checked)
    }

    render() {
        return (
            <>
            <div className = "switch">
                <input type="checkbox" id = "checkbox1" onClick={this.checkBoxChange}/>
                <label htmlFor="checkbox1"></label>
            </div>
            </>
        )
    }
}

export default Test;