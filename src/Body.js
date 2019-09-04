import React, { Component } from 'react';
import { FaHiking, FaArchway } from "react-icons/fa";
import './Body.css';

class Body extends Component {
    constructor(props) {
        super(props);
        let arr = [];
        for (let i = 0; i < 20; i++) {
            arr[i] = [];
            for (let j = 0; j < 61; j++) {
                arr[i][j] = {};
            }
        }
        this.state = {
            arr: arr,
            startNodei: 10,
            startNodej: 10,
            endNodei: 10,
            endNodej: 50,
            onActionNode: "",
            restrictedSpacei: [],
            restrictedSpacej: []
        }
    }

    componentDidMount() {
        let arr = this.state.arr;
        // arr.forEach((ele, i) => {
        //     ele.forEach((element, j) => {
        //         element.style = { display: "none" }
        //         if (i == 10 && j == 15) {
        //             element.style = { display: "block" }
        //         }
        //     })
        // })

        this.setState({
            arr: arr
        })
    }

    allowDrop = (event,i,j) => {
        if(this.state.restrictedSpacei.indexOf(i)<0){
            event.preventDefault();
        }else{
            if(this.state.restrictedSpacej.indexOf(j)<0){
                event.preventDefault();
            }
        }
    }

    drop = (event, i, j) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("nodeType");
        if(nodeType == "start"){
        this.setState({
            startNodei: i,
            startNodej: j
        })
        }else if(nodeType == "end"){
        this.setState({
            endNodei: i,
            endNodej: j
        })
        }
    }

    dragStart = (event, i, j, nodeType) => {
        event.dataTransfer.setData("nodeType", nodeType);
        this.setState({
            onActionNode: nodeType
        })
        if(nodeType=="start"){
            let arri = [];
            arri.push(this.state.endNodei);
            let arrj = [];
            arrj.push(this.state.endNodej);
            this.setState({
                restrictedSpacei:arri,
                restrictedSpacej:arrj
            })
        }else if(nodeType=="end"){
            let arri = [];
            arri.push(this.state.startNodei);
            let arrj = [];
            arrj.push(this.state.startNodej);
            this.setState({
                restrictedSpacei:arri,
                restrictedSpacej:arrj
            })
        }
    }

    render() {
        const {startNodei,startNodej,endNodei,endNodej,restrictedSpacei,restrictedSpacej} = this.state;
        return (
            <>
                <div>
                </div>
                <div>
                    <table>
                        <tbody>
                            {this.state.arr.map((ele, i) => (
                                <tr key={i}>
                                    {ele.map((ele, j) => (
                                        <td key={j} onDragOver={(event) => this.allowDrop(event,i,j)} onDrop={(event) => this.drop(event, i, j)}>
                                            {i == startNodei && j == startNodej &&
                                                    <div onDragStart={(event) => this.dragStart(event, i, j, "start")} draggable><FaHiking /></div>}
                                            {i == endNodei && j == endNodej &&
                                                    <div onDragStart={(event) => this.dragStart(event, i, j, "end")} draggable><FaArchway /></div>}
                                        </td>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Body;