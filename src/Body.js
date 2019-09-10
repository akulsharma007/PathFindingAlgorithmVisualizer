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
                arr[i][j] = { dijkstra: { parenti: -1, parentj: -1, included: false, shortestPath: false } };
            }
        }
        this.state = {
            arr: arr,
            startNodei: 10,
            startNodej: 10,
            endNodei: 10,
            endNodej: 50,
            wallRestrictedSpace: [],
            clickedFlag: false,
            mouseDownUpFlag: false,
            disableGridFlag: false,
            selectedAlgorithm: ""
        }
    }

    async componentDidMount() {
        let arr = this.state.arr;
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                element.style = { backgroundColor: "white" }
            })
        })

        await this.setState({
            arr: arr
        })
    }

    allowDrop = (event, i, j) => {
        if (!this.allOccupiedPlacesCheck(i, j) && ((this.state.wallRestrictedSpace.filter(ele => ele.i == i && ele.j == j)).length == 0)) {
            event.preventDefault();
        }
    }

    drop = async (event, i, j) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("nodeType");
        if (nodeType == "start") {
            await this.setState({
                startNodei: i,
                startNodej: j
            })
        } else if (nodeType == "end") {
            await this.setState({
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

    doubleClickHandler = async (event, i, j) => {
        await this.setState({
            clickedFlag: false
        })
        let arr = this.state.arr;
        if (!this.allOccupiedPlacesCheck(i, j)) {
            if (arr[i][j].style.backgroundColor != "black") {
                arr[i][j].style = { backgroundColor: "black" };
                let wallArr = this.state.wallRestrictedSpace;
                wallArr.push({ i, j });
                await this.setState({
                    wallRestrictedSpace: wallArr,
                    arr: arr
                })

            } else {
                arr[i][j].style = { backgroundColor: "white" };
                let arrr = this.state.wallRestrictedSpace.filter(ele => ele.i != i || ele.j != j)
                await this.setState({
                    wallRestrictedSpace: arrr,
                    arr: arr
                })
                console.log(arrr);
            }
        }
    }

    clickHandler = async (event, i, j) => {
        await this.setState({
            clickedFlag: !this.state.clickedFlag
        })
    }

    mouseMoveHandler = async (event, i, j) => {
        if (this.state.clickedFlag) {
            let arr = this.state.arr;
            if (!this.allOccupiedPlacesCheck(i, j)) {
                if (arr[i][j].style.backgroundColor != "black") {
                    arr[i][j].style = { backgroundColor: "black" }
                    let wallArr = this.state.wallRestrictedSpace;
                    wallArr.push({ i, j });
                    await this.setState({
                        wallRestrictedSpace: wallArr,
                        arr: arr
                    })
                } else {
                    arr[i][j].style = { backgroundColor: "white" }
                    let arrr = this.state.wallRestrictedSpace.filter(ele => ele.i != i || ele.j != j);
                    await this.setState({
                        wallRestrictedSpace: arrr,
                        arr: arr
                    })
                }
            }
        }
    }

    /***************Algorithms Implementation */
    clearGrid = async () => {
        let arr1 = this.state.arr;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 61; j++) {
                arr1[i][j].dijkstra = { parenti: -1, parentj: -1, included: false, shortestPath: false };
                arr1[i][j].style = { backgroundColor: "white" }
            }
        }
        await this.setState({
            arr: arr1,
            startNodei: 10,
            startNodej: 10,
            endNodei: 10,
            endNodej: 50,
            wallRestrictedSpace: [],
            clickedFlag: false,
            mouseDownUpFlag: false,
            selectedAlgorithm: ""
        })
    }

    algorithmSelect = (algorithm)=>{
        if (algorithm == "dijkstra") {
            this.setState({
                selectedAlgorithm: "dijkstra"
            })
        }
        if(algorithm == "A*"){
            this.setState({
                selectedAlgorithm: "A*"
            })
        }
    }
    
    calculate = (algorithm, speed) => {
        if (algorithm == "dijkstra") {
            this.dijkstraCalculate(speed);
        }
        if (algorithm == "A*"){
            this.aStarCalculate(speed);
        }
    }

    dijkstraCalculate = async (speed) => {

        const { arr, startNodei, startNodej } = this.state;
        let sptSet = [];
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                if (i == startNodei && j == startNodej) {
                    sptSet.push({ i, j, distance: 0 })
                } else {
                    sptSet.push({ i, j, distance: Number.MAX_SAFE_INTEGER })
                }
            })
        })

        let v = 0;

        let timerSpeed = Number;
        if (speed == 1) {
            timerSpeed = 200;
        } else if (speed == 2) {
            timerSpeed = 500;
        } else if (speed == 4) {
            timerSpeed = 1;
        }
        if (speed != 0) {
            let timer = await setInterval(async () => {
                this.setState({
                    disableGridFlag: true
                })
                let u = this.dijkstraMinDistanceNode(sptSet);
                if (u == -1) {
                    clearInterval(timer);
                    this.setState({
                        disableGridFlag: false
                    })
                    return;
                }
                let arr1 = arr;
                arr1[sptSet[u].i][sptSet[u].j].dijkstra.included = true;

                await this.setState({
                    arr: arr1
                })
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i - 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i - 1 >= 0 && sptSet[u].i - 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i - 1][sptSet[u].j].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u - 61].distance) {
                        sptSet[u - 61].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                // i+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i + 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i + 1 >= 0 && sptSet[u].i + 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i + 1][sptSet[u].j].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u + 61].distance) {
                        sptSet[u + 61].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                // j-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j - 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j - 1 >= 0 && sptSet[u].j - 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j - 1].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u - 1].distance) {
                        sptSet[u - 1].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                // j+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j + 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j + 1 >= 0 && sptSet[u].j + 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j + 1].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u + 1].distance) {
                        sptSet[u + 1].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                if ((sptSet[u].i == this.state.endNodei && sptSet[u].j == this.state.endNodej)) {
                    this.dijkstraRegisterShortest(speed);
                    clearInterval(timer);
                }
                v++;

            }, timerSpeed);
        } else {
            for (let i = 0; i < sptSet.length; i++) {
                let u = this.dijkstraMinDistanceNode(sptSet);
                if (u == -1) {
                    this.setState({
                        disableGridFlag: false
                    })
                    break;
                }
                let arr1 = arr;
                arr1[sptSet[u].i][sptSet[u].j].dijkstra.included = true;

                this.setState({
                    arr: arr1
                })

                //i-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i - 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i - 1 >= 0 && sptSet[u].i - 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i - 1][sptSet[u].j].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u - 61].distance) {
                        sptSet[u - 61].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                // i+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i + 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i + 1 >= 0 && sptSet[u].i + 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i + 1][sptSet[u].j].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u + 61].distance) {
                        sptSet[u + 61].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                // j-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j - 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j - 1 >= 0 && sptSet[u].j - 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j - 1].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u - 1].distance) {
                        sptSet[u - 1].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                // j+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j + 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j + 1 >= 0 && sptSet[u].j + 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j + 1].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u + 1].distance) {
                        sptSet[u + 1].distance = sptSet[u].distance + 1;
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                if (sptSet[u].i == this.state.endNodei && sptSet[u].j == this.state.endNodej) {
                    this.dijkstraRegisterShortest(0);
                    break;
                }
            }
        }
    }

    dijkstraRegisterShortest = async (speed) => {
        const { arr, startNodei, startNodej, endNodei, endNodej } = this.state;
        if (arr[endNodei][endNodej].dijkstra.parenti != -1 && arr[endNodei][endNodej].dijkstra.parentj != -1) {
            let i = endNodei;
            let j = endNodej;
            let timerSpeed = Number;
            if (speed == 1) {
                timerSpeed = 200;
            } else if (speed == 2) {
                timerSpeed = 500;
            } else if (speed == 4) {
                timerSpeed = 1
            }
            if (speed != 0) {
                let timer = await setInterval(async () => {
                    let x = arr[i][j].dijkstra.parenti;
                    let y = arr[i][j].dijkstra.parentj;
                    let arr1 = arr;
                    arr1[i][j].dijkstra.shortestPath = true;
                    await this.setState({
                        arr: arr1
                    })
                    i = x;
                    j = y;
                    if (i == startNodei && j == startNodej) {
                        this.setState({
                            disableGridFlag: false
                        })
                        clearInterval(timer);
                    }
                }, timerSpeed);
            } else {
                while (i != startNodei || j != startNodej) {
                    let x = arr[i][j].dijkstra.parenti;
                    let y = arr[i][j].dijkstra.parentj;
                    let arr1 = arr;
                    arr1[i][j].dijkstra.shortestPath = true;
                    await this.setState({
                        arr: arr1
                    })
                    i = x;
                    j = y;
                }
                await this.setState({
                    disableGridFlag: false
                })
            }
        }
    }

    dijkstraMinDistanceNode = (sptSet) => {
        let min = Number.MAX_SAFE_INTEGER;
        let minInd = -1;

        for (let i = 0; i < sptSet.length; i++) {
            if (this.state.arr[sptSet[i].i][sptSet[i].j].dijkstra.included == false
                && ((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[i].i && ele.j == sptSet[i].j)).length == 0)
                && sptSet[i].distance < min
            ) {

                min = sptSet[i].distance;
                minInd = i;
            }
        }
        return minInd;
    }

    returnManhattenDistance = (i,j) =>{
        return Math.abs(i-this.state.endNodei)+Math.abs(j-this.state.endNodej);
    }

    aStarCalculate = async (speed) => {

        const { arr, startNodei, startNodej } = this.state;
        let sptSet = [];
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                if (i == startNodei && j == startNodej) {
                    sptSet.push({ i, j, distance: 0, fDistance: this.returnManhattenDistance(i,j) })
                } else {
                    sptSet.push({ i, j, distance: Number.MAX_SAFE_INTEGER, fDistance: Number.MAX_SAFE_INTEGER })
                }
            })
        })

        let v = 0;

        let timerSpeed = Number;
        if (speed == 1) {
            timerSpeed = 200;
        } else if (speed == 2) {
            timerSpeed = 500;
        } else if (speed == 4) {
            timerSpeed = 1;
        }
        if (speed != 0) {
            let timer = await setInterval(async () => {
                this.setState({
                    disableGridFlag: true
                })
                let u = this.aStarMinDistanceNode(sptSet);
                if (u == -1) {
                    clearInterval(timer);
                    this.setState({
                        disableGridFlag: false
                    })
                    return;
                }
                let arr1 = arr;
                arr1[sptSet[u].i][sptSet[u].j].dijkstra.included = true;

                await this.setState({
                    arr: arr1
                })
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i - 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i - 1 >= 0 && sptSet[u].i - 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i - 1][sptSet[u].j].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u - 61].distance) {
                        sptSet[u - 61].distance = sptSet[u].distance + 1;
                        sptSet[u - 61].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i-1,sptSet[u].j);
                        let arr2 = arr;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                // i+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i + 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i + 1 >= 0 && sptSet[u].i + 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i + 1][sptSet[u].j].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u + 61].distance) {
                        sptSet[u + 61].distance = sptSet[u].distance + 1;
                        sptSet[u + 61].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i+1,sptSet[u].j);
                        let arr2 = arr;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                // j-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j - 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j - 1 >= 0 && sptSet[u].j - 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j - 1].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u - 1].distance) {
                        sptSet[u - 1].distance = sptSet[u].distance + 1;
                        sptSet[u - 1].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i,sptSet[u].j-1);
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                // j+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j + 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j + 1 >= 0 && sptSet[u].j + 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j + 1].dijkstra.included)
                    )
                ) {

                    if (sptSet[u].distance + 1 < sptSet[u + 1].distance) {
                        sptSet[u + 1].distance = sptSet[u].distance + 1;
                        sptSet[u + 1].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i,sptSet[u].j+1);
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parentj = sptSet[u].j;
                        await this.setState({
                            arr: arr2
                        })

                    }
                }

                if ((sptSet[u].i == this.state.endNodei && sptSet[u].j == this.state.endNodej)) {
                    this.dijkstraRegisterShortest(speed);
                    clearInterval(timer);
                }
                v++;

            }, timerSpeed);
        } else {
            for (let i = 0; i < sptSet.length; i++) {
                let u = this.aStarMinDistanceNode(sptSet);
                if (u == -1) {
                    this.setState({
                        disableGridFlag: false
                    })
                    break;
                }
                let arr1 = arr;
                arr1[sptSet[u].i][sptSet[u].j].dijkstra.included = true;

                this.setState({
                    arr: arr1
                })

                //i-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i - 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i - 1 >= 0 && sptSet[u].i - 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i - 1][sptSet[u].j].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u - 61].distance) {
                        sptSet[u - 61].distance = sptSet[u].distance + 1;
                        sptSet[u - 61].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i-1,sptSet[u].j);
                        let arr2 = arr;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i - 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                // i+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i + 1 && ele.j == sptSet[u].j)).length == 0)
                    && (sptSet[u].i + 1 >= 0 && sptSet[u].i + 1 < 20)
                    && (sptSet[u].j >= 0 && sptSet[u].j < 61
                        && !(arr1[sptSet[u].i + 1][sptSet[u].j].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u + 61].distance) {
                        sptSet[u + 61].distance = sptSet[u].distance + 1;
                        sptSet[u + 61].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i+1,sptSet[u].j);
                        let arr2 = arr;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i + 1][sptSet[u].j].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                // j-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j - 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j - 1 >= 0 && sptSet[u].j - 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j - 1].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u - 1].distance) {
                        sptSet[u - 1].distance = sptSet[u].distance + 1;
                        sptSet[u - 1].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i,sptSet[u].j-1);
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j - 1].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                // j+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[u].i && ele.j == sptSet[u].j + 1)).length == 0)
                    && (sptSet[u].i >= 0 && sptSet[u].i < 20)
                    && (sptSet[u].j + 1 >= 0 && sptSet[u].j + 1 < 61
                        && !(arr1[sptSet[u].i][sptSet[u].j + 1].dijkstra.included)
                    )
                ) {
                    if (sptSet[u].distance + 1 < sptSet[u + 1].distance) {
                        sptSet[u + 1].distance = sptSet[u].distance + 1;
                        sptSet[u + 1].fDistance = sptSet[u].distance + 1+this.returnManhattenDistance(sptSet[u].i,sptSet[u].j+1);
                        let arr2 = arr;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parenti = sptSet[u].i;
                        arr2[sptSet[u].i][sptSet[u].j + 1].dijkstra.parentj = sptSet[u].j;
                        this.setState({
                            arr: arr2
                        })
                    }
                }

                if (sptSet[u].i == this.state.endNodei && sptSet[u].j == this.state.endNodej) {
                    this.dijkstraRegisterShortest(0);
                    break;
                }
            }
        }
    }

    
    aStarMinDistanceNode = (sptSet) => {
        let min = Number.MAX_SAFE_INTEGER;
        let minInd = -1;

        for (let i = 0; i < sptSet.length; i++) {
            if (this.state.arr[sptSet[i].i][sptSet[i].j].dijkstra.included == false
                && ((this.state.wallRestrictedSpace.filter(ele => ele.i == sptSet[i].i && ele.j == sptSet[i].j)).length == 0)
                && sptSet[i].fDistance < min
            ) {

                min = sptSet[i].fDistance;
                minInd = i;
            }
        }
        return minInd;
    }

    render() {
        const { startNodei, startNodej, endNodei, endNodej, arr } = this.state;
        return (
            <div className={this.state.disableGridFlag ? "disableGrid" : "enableGrid"}>
                <div className="headerClass"><Header algorithmSelect={this.algorithmSelect} calculate={this.calculate} clearGrid={this.clearGrid} /></div>
                <div className="bodyHeader">
                    <ul>
                        <li>Source Node <FaHiking /></li>
                        <li>Destination Node <FaArchway /></li>
                        <li style={{ marginTop: 'auto' }}>Unvisited Node <div className="unvisited"></div></li>
                        <li style={{ marginTop: 'auto' }}>Visited Node <div className="visited"></div></li>
                        <li style={{ marginTop: 'auto' }}>Shortest Path Node <div className="shortestPath"></div></li>
                        <li style={{ marginTop: 'auto' }}>Obstacle Node <div className="obstacle"></div></li>
                    </ul>
                        <div style={this.state.selectedAlgorithm == "" ?{display:"block"}:{display:"none"}} className="alignClass">Select an algorithm to find the shortest path!</div>
                        <div style={this.state.selectedAlgorithm == "dijkstra" ?{display:"block"}:{display:"none"}} className="alignClass">Dijkstra Algorithm is a weighted greedy algorithm which guarantees a shortest path with a time complexity of O(V^2) when represented using adjacency matrix and O(E logV) when represented using adjacency list.</div>
                        <div style={this.state.selectedAlgorithm == "A*" ?{display:"block"}:{display:"none"}} className="alignClass">A* Search Algorithm is a weighted greedy algorithm which is an extension to Dijkshtra's algorithm aiming at optimizing its performance by the use of heuristics.</div>
                    <table>
                        <tbody>
                            {arr.map((ele, i) => (
                                <tr key={i}>
                                    {ele.map((ele, j) => (
                                        <td
                                            key={j}
                                            onDragOver={(event) => this.allowDrop(event, i, j)}
                                            onDrop={(event) => this.drop(event, i, j)}
                                            onDoubleClick={(event) => this.doubleClickHandler(event, i, j)}
                                            onClick={(event) => this.clickHandler(event, i, j)}
                                            onMouseEnter={(event) => this.mouseMoveHandler(event, i, j)}
                                            style={arr[i][j].dijkstra.included ? (arr[i][j].dijkstra.shortestPath ? { backgroundColor: "green" } : { backgroundColor: "yellow" }) : ele.style}
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
            </div>
        )
    }
}

export default Body;