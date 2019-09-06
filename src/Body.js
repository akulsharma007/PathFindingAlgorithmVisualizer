import React, { Component } from 'react';
import { FaHiking, FaArchway } from "react-icons/fa";
import Header from './Header';
import './Body.css';

class Body extends Component {
    constructor(props) {
        super(props);
        let arr = [];
        for (let i = 0; i < 20; i++) {
            arr[i] = [];
            for (let j = 0; j < 61; j++) {
                arr[i][j] = { dijikstra: { parenti: 0, parentj: 0, included: false } };
            }
        }
        this.state = {
            arr: arr,
            startNodei: 10,
            startNodej: 10,
            endNodei: 10,
            endNodej: 50,
            restrictedSpacei: [],
            restrictedSpacej: [],
            wallRestrictedSpace: [],
            clickedFlag: false,
            mouseDownUpFlag: false
        }
    }

    componentDidMount() {
        let arr = this.state.arr;
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                element.style = { backgroundColor: "white", borderStyle: "solid" }
            })
        })

        this.setState({
            arr: arr
        })
    }

    allowDrop = (event, i, j) => {
        if (!this.allOccupiedPlacesCheck(i, j) && ((this.state.wallRestrictedSpace.filter(ele => ele.i == i && ele.j == j)).length == 0)) {
            event.preventDefault();
        }
    }

    drop = (event, i, j) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("nodeType");
        if (nodeType == "start") {
            this.setState({
                startNodei: i,
                startNodej: j
            })
        } else if (nodeType == "end") {
            this.setState({
                endNodei: i,
                endNodej: j
            })
        }
    }

    dragStart = (event, i, j, nodeType) => {
        event.dataTransfer.setData("nodeType", nodeType);
    }

    allOccupiedPlacesCheck = (i, j) => {
        const { startNodei, startNodej, endNodei, endNodej } = this.state;

        if ((i == startNodei && j == startNodej) || (i == endNodei && j == endNodej)) {
            return true;
        } else {
            return false;
        }
    }

    doubleClickHandler = (event, i, j) => {
        this.setState({
            clickedFlag: false
        })
        let arr = this.state.arr;
        if (!this.allOccupiedPlacesCheck(i, j)) {
            if (arr[i][j].style.backgroundColor != "black") {
                arr[i][j].style = { backgroundColor: "black", borderStyle: "none" };
                let wallArr = this.state.wallRestrictedSpace;
                wallArr.push({ i, j });
                this.setState({
                    wallRestrictedSpace: wallArr,
                    arr: arr
                })
            } else {
                arr[i][j].style = { backgroundColor: "white", borderStyle: "solid" };
                this.setState({
                    wallRestrictedSpace: this.state.wallRestrictedSpace.filter(ele => ele.i != i && ele.j != j),
                    arr: arr
                })
            }
        }
    }

    clickHandler = (event, i, j) => {
        this.setState({
            clickedFlag: !this.state.clickedFlag
        })
    }

    mouseMoveHandler = (event, i, j) => {
        if (this.state.clickedFlag) {
            let arr = this.state.arr;
            if (!this.allOccupiedPlacesCheck(i, j)) {
                if (arr[i][j].style.backgroundColor != "black") {
                    arr[i][j].style = { backgroundColor: "black", borderStyle: "none" }
                    let wallArr = this.state.wallRestrictedSpace;
                    wallArr.push({ i, j });
                    this.setState({
                        wallRestrictedSpace: wallArr,
                        arr: arr
                    })
                } else {
                    arr[i][j].style = { backgroundColor: "white", borderStyle: "solid" }
                    this.setState({
                        wallRestrictedSpace: this.state.wallRestrictedSpace.filter(ele => ele.i != i && ele.j != j),
                        arr: arr
                    })
                }
            }
        }
    }

    // mouseDownHandler=(event)=>{
    //     console.log('yeah');
    //     this.setState({
    //         mouseDownUpFlag:true
    //     })
    // }

    // mouseUpHandler=(event)=>{
    //     console.log('neah');
    //     this.setState({
    //         mouseDownUpFlag:false,
    //         clickedFlag:false
    //     })
    // }

    /***************Algorithms Implementation */
    calculate = (algorithm) => {
        if (algorithm == "dijikstra") {
            this.dijikstraCalculate();
        }
    }

    dijikstraCalculate = () => {
        const { arr , startNodei , startNodej } = this.state;
        let sptSet = [];
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                if(i==startNodei&&j==startNodej){
                    sptSet.push({i,j,distance:0})
                }else{
                    sptSet.push({i,j,distance:Number.MAX_SAFE_INTEGER})
                }
            })
        })
        console.log(sptSet);

        for(let i=0;i<sptSet.length;i++){
            let u = this.dijikstraMinDistanceNode(sptSet);

            let arr1=arr;
            arr1[sptSet[u].i][sptSet[u].j].dijikstra.included = true;
            this.setState({
                arr:arr1
            })
            console.log(arr1);
            
        }
    }

    dijikstraMinDistanceNode=(sptSet)=>{
        let min = Number.MAX_SAFE_INTEGER;
        let minInd = -1;

        for(let i=0;i<sptSet.length;i++){
            if(this.state.arr[sptSet[i].i][sptSet[i].j].dijikstra.included == false && sptSet[i].distance<=min){
                min = sptSet[i].distance;
                minInd = i;
            }
        }
        return minInd;
    }

    render() {
        const { startNodei, startNodej, endNodei, endNodej } = this.state;
        return (
            <>
                <div className="headerClass"><Header calculate={this.calculate} /></div>
                <div>
                </div>
                <div>
                    <table>
                        <tbody>
                            {this.state.arr.map((ele, i) => (
                                <tr key={i}>
                                    {ele.map((ele, j) => (
                                        <td
                                            key={j}
                                            style={ele.style}
                                            onDragOver={(event) => this.allowDrop(event, i, j)}
                                            onDrop={(event) => this.drop(event, i, j)}
                                            onDoubleClick={(event) => this.doubleClickHandler(event, i, j)}
                                            onClick={(event) => this.clickHandler(event, i, j)}
                                            onMouseEnter={(event) => this.mouseMoveHandler(event, i, j)}
                                        // onMouseDown={(event)=>this.mouseDownHandler(event)} 
                                        // onMouseUp={(event)=>this.mouseUpHandler(event)}
                                        >
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