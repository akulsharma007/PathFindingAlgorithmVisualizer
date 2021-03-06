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
                arr[i][j] = { dijkstra: { parenti: -1, parentj: -1, included: false, shortestPath: false }, dfs: { included: false, shortestPath: false } };
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
                arr1[i][j].dfs = { included: false, shortestPath: false };
                arr1[i][j].style = { backgroundColor: "white" };
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

    clearPath = async () => {
        let arr1 = this.state.arr;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 61; j++) {
                arr1[i][j].dijkstra = { parenti: -1, parentj: -1, included: false, shortestPath: false };
                arr1[i][j].dfs = { included: false, shortestPath: false };
                if(arr1[i][j].style.backgroundColor=="yellow"||arr1[i][j].style.backgroundColor=="green"){
                    arr1[i][j].style = { backgroundColor: "white" };
                }
            }
        }
        await this.setState({
            arr: arr1,
            clickedFlag: false,
            mouseDownUpFlag: false
        })
    }

    algorithmSelect = (algorithm) => {
            this.setState({
                selectedAlgorithm : algorithm
            })
    }

    mazeSelect = (maze,speed) => {
        if(maze == "rd"){
            this.recursiveDiv(speed);
        }
    }

    calculate = (algorithm, speed) => {
        if (algorithm == "dijkstra") {
            this.dijkstraCalculate(speed);
        }
        if (algorithm == "A*") {
            this.aStarCalculate(speed);
        }
        if (algorithm == "dfs") {
            this.dfsCalculate(speed);
        }
        if (algorithm == "bfs") {
            this.bfsCalculate(speed);
        }
        if(algorithm == "bestFsearch"){
            this.bestFirstSearchCalculate(speed);
        }
    }

    recursiveDiv = async (speed) => {
        let wall = this.state.wallRestrictedSpace;
        let style = this.state.arr;
        // if(speed==0){
            for(let i=0;i<20;i++){
                style[i][0].style = { backgroundColor: "black" };
                wall.push({i:i,j:0});
                this.setState({
                    arr:style,
                    wallRestrictedSpace:wall
                })
            }
            for(let i=1;i<61;i++){
                style[19][i].style = { backgroundColor: "black" };
                wall.push({i:19,j:i});
                this.setState({
                    arr:style,
                    wallRestrictedSpace:wall
                })
            }
            for(let i=19;i>=0;i--){
                style[i][60].style = { backgroundColor: "black" };
                wall.push({i:i,j:60});
                this.setState({
                    arr:style,
                    wallRestrictedSpace:wall
                })
            }
            for(let i=59;i>=1;i--){
                style[0][i].style = { backgroundColor: "black" };
                wall.push({i:0,j:i});
                this.setState({
                    arr:style,
                    wallRestrictedSpace:wall
                })
            }
            this.recursionOfRecursiveDivision(1,18,1,59);
        // }
    }

    recursionOfRecursiveDivision = async (istart,iend,jstart,jend)=>{
        if(iend<=istart||iend-istart<2||jend<=jstart||jend-jstart<2){
            return;
        }
        let wall = this.state.wallRestrictedSpace;
        let style = this.state.arr;
            if(jend-jstart > iend-istart ){
                let total = jend-jstart;
                let bisectLine = Math.floor(Math.random()*total);
                let skip = iend-istart;
                let skipPoint = Math.floor(Math.random()*skip);
                for(let i=istart;i<=iend;i++){
                    if(i==istart+skipPoint||
                       (this.state.startNodei==i&&this.state.startNodej==jstart+bisectLine)||
                       (this.state.endNodei==i&&this.state.endNodej==jstart+bisectLine)||
                       (style[i][jstart+bisectLine].style.backgroundColor == "black")
                    ){
                        continue;
                    }
                    style[i][jstart+bisectLine].style = { backgroundColor: "black" };
                    wall.push({i:i,j:jstart+bisectLine});
                    this.setState({
                        arr:style,
                        wallRestrictedSpace:wall
                    })
                }
                   this.recursionOfRecursiveDivision(istart,iend,jstart,jstart+bisectLine-2);
                   this.recursionOfRecursiveDivision(istart,iend,jstart+bisectLine+2,jend);
            }else{
                let total = iend-istart;
                let bisectLine = Math.floor(Math.random()*total);
                let skip = jend-jstart;
                let skipPoint = Math.floor(Math.random()*skip);
                for(let i=jstart;i<=jend;i++){
                    if(i==jstart+skipPoint||
                      (this.state.startNodei==istart+bisectLine&&this.state.startNodej==i)||
                      (this.state.endNodei==istart+bisectLine&&this.state.endNodej==i)||
                      (style[istart+bisectLine][i].style.backgroundColor == "black")
                    ){
                        continue;
                    }
                    style[istart+bisectLine][i].style = { backgroundColor: "black" };
                    wall.push({i:istart+bisectLine,j:i});
                    this.setState({
                        arr:style,
                        wallRestrictedSpace:wall
                    })
                }
                this.recursionOfRecursiveDivision(istart,istart+bisectLine-2,jstart,jend);
                this.recursionOfRecursiveDivision(istart+bisectLine+2,iend,jstart,jend);
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

    returnManhattenDistance = (i, j) => {
        return Math.abs(i - this.state.endNodei) + Math.abs(j - this.state.endNodej);
    }

    aStarCalculate = async (speed) => {

        const { arr, startNodei, startNodej } = this.state;
        let sptSet = [];
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                if (i == startNodei && j == startNodej) {
                    sptSet.push({ i, j, distance: 0, fDistance: this.returnManhattenDistance(i, j) })
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
                        sptSet[u - 61].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i - 1, sptSet[u].j);
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
                        sptSet[u + 61].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i + 1, sptSet[u].j);
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
                        sptSet[u - 1].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i, sptSet[u].j - 1);
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
                        sptSet[u + 1].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i, sptSet[u].j + 1);
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
                        sptSet[u - 61].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i - 1, sptSet[u].j);
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
                        sptSet[u + 61].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i + 1, sptSet[u].j);
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
                        sptSet[u - 1].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i, sptSet[u].j - 1);
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
                        sptSet[u + 1].fDistance = sptSet[u].distance + 1 + this.returnManhattenDistance(sptSet[u].i, sptSet[u].j + 1);
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

    bestFirstSearchCalculate = async (speed) => {

        const { arr, startNodei, startNodej } = this.state;
        let sptSet = [];
        arr.forEach((ele, i) => {
            ele.forEach((element, j) => {
                if (i == startNodei && j == startNodej) {
                    sptSet.push({ i, j, fDistance: this.returnManhattenDistance(i, j) })
                } else {
                    sptSet.push({ i, j, fDistance: Number.MAX_SAFE_INTEGER })
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

                    if (sptSet[u].fDistance < sptSet[u - 61].fDistance) {
                        sptSet[u - 61].fDistance = this.returnManhattenDistance(sptSet[u].i - 1, sptSet[u].j);
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

                    if (sptSet[u].fDistance < sptSet[u + 61].fDistance) {
                        sptSet[u + 61].fDistance = this.returnManhattenDistance(sptSet[u].i + 1, sptSet[u].j);
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

                    if (sptSet[u].fDistance < sptSet[u - 1].fDistance) {
                        sptSet[u - 1].fDistance = this.returnManhattenDistance(sptSet[u].i, sptSet[u].j - 1);
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

                    if (sptSet[u].fDistance < sptSet[u + 1].fDistance) {
                        sptSet[u + 1].fDistance = this.returnManhattenDistance(sptSet[u].i, sptSet[u].j + 1);
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
                    if (sptSet[u].fDistance < sptSet[u - 61].fDistance) {
                        sptSet[u - 61].fDistance = this.returnManhattenDistance(sptSet[u].i - 1, sptSet[u].j);
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
                    if (sptSet[u].fDistance < sptSet[u + 61].fDistance) {
                        sptSet[u + 61].fDistance = this.returnManhattenDistance(sptSet[u].i + 1, sptSet[u].j);
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
                    if (sptSet[u].fDistance < sptSet[u - 1].fDistance) {
                        sptSet[u - 1].fDistance = this.returnManhattenDistance(sptSet[u].i, sptSet[u].j - 1);
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
                    if (sptSet[u].fDistance < sptSet[u + 1].fDistance) {
                        sptSet[u + 1].fDistance = this.returnManhattenDistance(sptSet[u].i, sptSet[u].j + 1);
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

    dfsCalculate = async (speed) => {
        const { arr, startNodei, startNodej } = this.state;
        // this.dfsRecursiveCalculate(this.state.startNodei, this.state.startNodej);
        let stack = [];
        stack.push({ i: this.state.startNodei, j: this.state.startNodej });
        let arr1 = arr;
        arr1[stack[stack.length - 1].i][stack[stack.length - 1].j].dijkstra.included = true;
        this.setState({
            arr: arr1
        })
        if (speed == 0) {
            while (stack.length != 0) {
                let adjacent = this.dfsAdjacentNodes(stack[stack.length - 1].i, stack[stack.length - 1].j);
                if (adjacent.i != -1 && adjacent.j != -1) {
                    stack.push({ i: adjacent.i, j: adjacent.j });
                    let arr1 = arr;
                    arr1[stack[stack.length - 1].i][stack[stack.length - 1].j].dijkstra.included = true;
                    this.setState({
                        arr: arr1
                    })
                } else {
                    stack.pop();
                }
                if (stack[stack.length - 1].i == this.state.startNodei && stack[stack.length - 1].j == this.state.startNodej) {
                    break;
                } else if (stack[stack.length - 1].i == this.state.endNodei && stack[stack.length - 1].j == this.state.endNodej) {
                    while (stack.length != 0) {
                        let arr1 = arr;
                        arr1[stack[stack.length - 1].i][stack[stack.length - 1].j].dijkstra.shortestPath = true;
                        this.setState({
                            arr: arr1
                        })
                        stack.pop();
                    }
                    break;
                }
            }
        } else {
            let timerSpeed = Number;
            if (speed == 1) {
                timerSpeed = 200;
            } else if (speed == 2) {
                timerSpeed = 500;
            } else if (speed == 4) {
                timerSpeed = 1;
            }

            let timer = await setInterval(async () => {
                this.setState({
                    disableGridFlag: true
                })
                let adjacent = this.dfsAdjacentNodes(stack[stack.length - 1].i, stack[stack.length - 1].j);
                if (adjacent.i != -1 && adjacent.j != -1) {
                    stack.push({ i: adjacent.i, j: adjacent.j });
                    let arr1 = arr;
                    arr1[stack[stack.length - 1].i][stack[stack.length - 1].j].dijkstra.included = true;
                    this.setState({
                        arr: arr1
                    })
                } else {
                    stack.pop();
                }
                if (stack[stack.length - 1].i == this.state.startNodei && stack[stack.length - 1].j == this.state.startNodej) {
                    clearInterval(timer);
                    this.setState({
                        disableGridFlag: false
                    })
                    return;
                } else if (stack[stack.length - 1].i == this.state.endNodei && stack[stack.length - 1].j == this.state.endNodej) {
                    // while(stack.length!=0){
                    //     let arr1 = arr;
                    //     arr1[stack[stack.length-1].i][stack[stack.length-1].j].dijkstra.shortestPath = true;
                    //     this.setState({
                    //         arr: arr1
                    //     })
                    //     stack.pop();
                    // }
                    this.dfsRegisterPath(stack, timerSpeed);
                    clearInterval(timer);
                }

            }, timerSpeed)
        }
    }

    dfsRegisterPath = async (stack, timerSpeed) => {
        const { arr } = this.state;
        let timer = await setInterval(async () => {
            let arr1 = arr;
            arr1[stack[stack.length - 1].i][stack[stack.length - 1].j].dijkstra.shortestPath = true;
            this.setState({
                arr: arr1
            })
            stack.pop();
            if (stack.length == 1) {
                this.setState({
                    disableGridFlag: false
                })
                clearInterval(timer);
            }
        }, timerSpeed);
    }

    dfsAdjacentNodes = (i, j) => {
        const { arr, startNodei, startNodej } = this.state;
        let tempi = -1;
        let tempj = -1;

        //i-1
        if ((tempi == -1 && tempj == -1) && ((this.state.wallRestrictedSpace.filter(ele => ele.i == i - 1 && ele.j == j)).length == 0)
            && (i - 1 >= 0 && i - 1 < 20)
            && (j >= 0 && j < 61
                && !(arr[i - 1][j].dijkstra.included)
            )
        ) {
            tempi = i - 1;
            tempj = j;
        }

        //j+1
        if ((tempi == -1 && tempj == -1) && ((this.state.wallRestrictedSpace.filter(ele => ele.i == i && ele.j == j + 1)).length == 0)
            && (i >= 0 && i < 20)
            && (j + 1 >= 0 && j + 1 < 61
                && !(arr[i][j + 1].dijkstra.included)
            )
        ) {
            tempi = i;
            tempj = j + 1;
        }

        //i+1
        if ((tempi == -1 && tempj == -1) && ((this.state.wallRestrictedSpace.filter(ele => ele.i == i + 1 && ele.j == j)).length == 0)
            && (i + 1 >= 0 && i + 1 < 20)
            && (j >= 0 && j < 61
                && !(arr[i + 1][j].dijkstra.included)
            )
        ) {
            tempi = i + 1;
            tempj = j;
        }

        //j-1
        if ((tempi == -1 && tempj == -1) && ((this.state.wallRestrictedSpace.filter(ele => ele.i == i && ele.j == j - 1)).length == 0)
            && (i >= 0 && i < 20)
            && (j - 1 >= 0 && j - 1 < 61
                && !(arr[i][j - 1].dijkstra.included)
            )
        ) {
            tempi = i;
            tempj = j - 1;
        }

        return { i: tempi, j: tempj };
    }

    bfsCalculate = async (speed) => {
        const { arr, startNodei, startNodej } = this.state;

        let queue = [];
        queue.push({ i: this.state.startNodei, j: this.state.startNodej });
        let arr1 = arr;
        arr1[queue[0].i][queue[0].j].dijkstra.included = true;
        this.setState({
            arr: arr1
        })
        if (speed == 0) {
            while (queue.length != 0) {
                //i-1
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i - 1 && ele.j == queue[0].j)).length == 0)
                    && (queue[0].i - 1 >= 0 && queue[0].i - 1 < 20)
                    && (queue[0].j >= 0 && queue[0].j < 61
                        && !(arr[queue[0].i - 1][queue[0].j].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i - 1][queue[0].j].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i - 1][queue[0].j].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i - 1, j: queue[0].j });
                    arr2[queue[0].i - 1][queue[0].j].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        break;
                    }
                }

                // i+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i + 1 && ele.j == queue[0].j)).length == 0)
                    && (queue[0].i + 1 >= 0 && queue[0].i + 1 < 20)
                    && (queue[0].j >= 0 && queue[0].j < 61
                        && !(arr[queue[0].i + 1][queue[0].j].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i + 1][queue[0].j].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i + 1][queue[0].j].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i + 1, j: queue[0].j });
                    arr2[queue[0].i + 1][queue[0].j].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        break;
                    }
                }

                // j-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i && ele.j == queue[0].j - 1)).length == 0)
                    && (queue[0].i >= 0 && queue[0].i < 20)
                    && (queue[0].j - 1 >= 0 && queue[0].j - 1 < 61
                        && !(arr[queue[0].i][queue[0].j - 1].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i][queue[0].j - 1].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i][queue[0].j - 1].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i, j: queue[0].j - 1 });
                    arr2[queue[0].i][queue[0].j - 1].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        break;
                    }
                }
                // j+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i && ele.j == queue[0].j + 1)).length == 0)
                    && (queue[0].i >= 0 && queue[0].i < 20)
                    && (queue[0].j + 1 >= 0 && queue[0].j + 1 < 61
                        && !(arr[queue[0].i][queue[0].j + 1].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i][queue[0].j + 1].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i][queue[0].j + 1].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i, j: queue[0].j + 1 });
                    arr2[queue[0].i][queue[0].j + 1].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        break;
                    }
                }
                queue.shift();
            }

            if (arr[this.state.endNodei][this.state.endNodej].dijkstra.parenti != -1 && arr[this.state.endNodei][this.state.endNodej].dijkstra.parentj != -1) {
                let i = this.state.endNodei;
                let j = this.state.endNodej;
                while (i != startNodei || j != startNodej) {
                    let x = arr[i][j].dijkstra.parenti;
                    let y = arr[i][j].dijkstra.parentj;
                    let arr1 = arr;
                    arr1[i][j].dijkstra.shortestPath = true;
                    this.setState({
                        arr: arr1
                    })
                    i = x;
                    j = y;
                }
            }
        } else {
            let timerSpeed = Number;
            if (speed == 1) {
                timerSpeed = 200;
            } else if (speed == 2) {
                timerSpeed = 500;
            } else if (speed == 4) {
                timerSpeed = 1;
            }
            let timer = await setInterval(async () => {
                this.setState({
                    disableGridFlag: true
                })

                if (queue.length == 0) {
                    clearInterval(timer);
                    this.setState({
                        disableGridFlag: false
                    })
                    return;
                }
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i - 1 && ele.j == queue[0].j)).length == 0)
                    && (queue[0].i - 1 >= 0 && queue[0].i - 1 < 20)
                    && (queue[0].j >= 0 && queue[0].j < 61
                        && !(arr[queue[0].i - 1][queue[0].j].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i - 1][queue[0].j].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i - 1][queue[0].j].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i - 1, j: queue[0].j });
                    arr2[queue[0].i - 1][queue[0].j].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        this.bfsRegisterShortest(timerSpeed);
                        clearInterval(timer);
                    }
                }

                // i+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i + 1 && ele.j == queue[0].j)).length == 0)
                    && (queue[0].i + 1 >= 0 && queue[0].i + 1 < 20)
                    && (queue[0].j >= 0 && queue[0].j < 61
                        && !(arr[queue[0].i + 1][queue[0].j].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i + 1][queue[0].j].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i + 1][queue[0].j].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i + 1, j: queue[0].j });
                    arr2[queue[0].i + 1][queue[0].j].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        this.bfsRegisterShortest(timerSpeed);
                        clearInterval(timer);
                    }
                }

                // j-1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i && ele.j == queue[0].j - 1)).length == 0)
                    && (queue[0].i >= 0 && queue[0].i < 20)
                    && (queue[0].j - 1 >= 0 && queue[0].j - 1 < 61
                        && !(arr[queue[0].i][queue[0].j - 1].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i][queue[0].j - 1].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i][queue[0].j - 1].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i, j: queue[0].j - 1 });
                    arr2[queue[0].i][queue[0].j - 1].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        this.bfsRegisterShortest(timerSpeed);
                        clearInterval(timer);
                    }
                }
                // j+1 adjacent
                if (((this.state.wallRestrictedSpace.filter(ele => ele.i == queue[0].i && ele.j == queue[0].j + 1)).length == 0)
                    && (queue[0].i >= 0 && queue[0].i < 20)
                    && (queue[0].j + 1 >= 0 && queue[0].j + 1 < 61
                        && !(arr[queue[0].i][queue[0].j + 1].dijkstra.included)
                    )
                ) {
                    let arr2 = arr;
                    arr2[queue[0].i][queue[0].j + 1].dijkstra.parenti = queue[0].i;
                    arr2[queue[0].i][queue[0].j + 1].dijkstra.parentj = queue[0].j;
                    queue.push({ i: queue[0].i, j: queue[0].j + 1 });
                    arr2[queue[0].i][queue[0].j + 1].dijkstra.included = true;
                    this.setState({
                        arr: arr2
                    })
                    if (queue[queue.length - 1].i == this.state.endNodei && queue[queue.length - 1].j == this.state.endNodej) {
                        this.bfsRegisterShortest(timerSpeed);
                        clearInterval(timer);
                    }
                }
                queue.shift();
            }, timerSpeed);
        }
    }

    bfsRegisterShortest = async (timerSpeed) => {
        const { arr, startNodei, startNodej, endNodei, endNodej } = this.state;
        let i = endNodei;
        let j = endNodej;
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
    }


    render() {
        const { startNodei, startNodej, endNodei, endNodej, arr } = this.state;
        return (
            <div className={this.state.disableGridFlag ? "disableGrid" : "enableGrid"}>
                <div className="headerClass"><Header algorithmSelect={this.algorithmSelect} mazeSelect={this.mazeSelect} calculate={this.calculate} clearGrid={this.clearGrid} clearPath={this.clearPath} /></div>
                <div className="bodyHeader">
                    <ul>
                        <li>Source Node <FaHiking /></li>
                        <li>Destination Node <FaArchway /></li>
                        <li style={{ marginTop: 'auto' }}>Unvisited Node <div className="unvisited"></div></li>
                        <li style={{ marginTop: 'auto' }}>Visited Node <div className="visited"></div></li>
                        <li style={{ marginTop: 'auto' }}>Shortest Path Node <div className="shortestPath"></div></li>
                        <li style={{ marginTop: 'auto' }}>Obstacle Node <div className="obstacle"></div></li>
                    </ul>
                    <div style={this.state.selectedAlgorithm == "" ? { display: "block" } : { display: "none" }} className="alignClass">Select an algorithm to find the path!</div>
                    <div style={this.state.selectedAlgorithm == "dijkstra" ? { display: "block" } : { display: "none" }} className="alignClass">Dijkstra Algorithm is a weighted greedy algorithm which guarantees a shortest path with a time complexity of O(V^2) when represented using adjacency matrix and O(E logV) when represented using adjacency list.</div>
                    <div style={this.state.selectedAlgorithm == "A*" ? { display: "block" } : { display: "none" }} className="alignClass">A* Search Algorithm is a weighted greedy algorithm which is an extension to Dijkshtra's algorithm aiming at optimizing its performance by the use of heuristics, it guarantees a shortest path!</div>
                    <div style={this.state.selectedAlgorithm == "dfs" ? { display: "block" } : { display: "none" }} className="alignClass">Depth-First Search is an unweighted algorithm which starts at the root node and explores as far as possible along each branch before backtracking, it does not guarantee a shortest path!</div>
                    <div style={this.state.selectedAlgorithm == "bfs" ? { display: "block" } : { display: "none" }} className="alignClass">Breadth-First Search is an unweighted algorithm which uses the opposite strategy as depth-first strategy to guarantee a shortest path!</div>
                    <div style={this.state.selectedAlgorithm == "bestFsearch" ? { display: "block" } : { display: "none" }} className="alignClass">Best First Search is a greedy weighted search algorithm that is a pure heuristic search which attempts to find a solution by predicting how close the end of a path is to a solution, it does not guarantee a shortest path!</div>
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