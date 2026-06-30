const SIZE = 10;
let mode = "wall";
let startX=-1;
let startY=-1;
let endX=-1;
let endY=-1;
let visited=[];
let parent=[];
let cancelAnimation=false;
let isMouseDown=false;
let speed;

//using modes to fix start end wall by user
document.addEventListener("mouseup", function(){
      console.log("Mouse Up");
    isMouseDown = false;
});
document.getElementById("startBtn").onclick = function(){
    mode = "start";
    document.getElementById("status").innerText = "Mode: Start";
}

document.getElementById("endBtn").onclick = function(){
    mode = "end";
    document.getElementById("status").innerText = "Mode: End";
}
document.getElementById("speed").onchange=function(){

    speed = Number(this.value);

}
document.getElementById("runBtn").onclick = function(){

    const algorithm =
        document.getElementById("algorithm").value;

    if(algorithm=="bfs"){
        bfs();
    }

    else if(algorithm=="dfs"){
        dfs();
    }

}
document.getElementById("wallBtn").onclick = function(){
    mode = "wall";
    document.getElementById("status").innerText = "Mode: Wall";
}

document.getElementById("resetBtn").onclick = function(){
    cancelAnimation=true;

    for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            if(route[i][j]=='+' || route[i][j]=='*')
                route[i][j]='.';
        }
    }
    renderGrid();
}

document.getElementById("clrBtn").onclick = function(){
    for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            if(route[i][j]=='#' || route[i][j]=='*' || route[i][j]=='+' || route[i][j]=='S' || route[i][j]=='E')
                route[i][j]='.';
        }
    }

    startX=-1;
    startY=-1;
    endX=-1;
    endY=-1;
    visited=[];
    parent=[];
    mode="wall";
    renderGrid();

}

//initializing 2D GRID
let route = [];
for(let i=0;i<SIZE;i++){

    route[i]=[];

    for(let j=0;j<SIZE;j++){
        route[i][j]='.';
    }

}
const grid=document.getElementById("grid");

//functions for wall,start and end
function placeWall(x,y){
    if(route[x][y]=='.')
        route[x][y]='#';
}

function placeStart(x,y){
     if(route[x][y]=='#' || route[x][y]=='E'){
        return;
    }
    if(startX!=-1){
        route[startX][startY]='.';
    }
    route[x][y]='S';
    startX=x;
    startY=y;
}
function placeEnd(x,y){
    if(route[x][y]=='#' || route[x][y]=='S'){
        return;
    }
    if(endX!=-1){
        route[endX][endY]='.';
    }
    route[x][y]='E';
    endX=x;
    endY=y;
}


//adding and displaying cells with the help of HTML and CSS
for(let i=0;i<SIZE;i++){
    for(let j=0;j<SIZE;j++){
        const cell=document.createElement("div");

        cell.addEventListener("click", function(){
            const row=Number(cell.dataset.row);
            const column=Number(cell.dataset.column);
            
            if(mode=="start"){
                placeStart(row,column);
            }
            else if(mode=="end"){
                placeEnd(row,column);
            }

            renderGrid();
        });

      
    cell.addEventListener("mousedown", function () {
        isMouseDown = true;

        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);

        if(mode=="wall"){
            placeWall(row,column);
            renderGrid();
        }
    });

    cell.addEventListener("mouseenter", function(){

        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);

        if(isMouseDown && mode=="wall"){
            placeWall(row,column);
            renderGrid();
        }

    });
        cell.classList.add("cell");
        cell.dataset.row=i;
        cell.dataset.column=j;
        grid.appendChild(cell);

    }

}

//function to detect cells separately
function renderGrid(){
    const cells = document.querySelectorAll(".cell");
    let index=0;

    for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            if(route[i][j]=='.'){
                cells[index].style.backgroundColor = "white";
            }
            else if(route[i][j]=='#'){
                cells[index].style.backgroundColor="black";
            }
            else if(route[i][j]=='S'){
                cells[index].style.backgroundColor="green";
            }
            else if(route[i][j]=='E'){
                cells[index].style.backgroundColor="red";
            }
            else if(route[i][j] == '+'){
                cells[index].style.backgroundColor = "skyblue";
            }
            else if(route[i][j] == '*'){
                cells[index].style.backgroundColor = "orange";
            }
            index++;
        }
    }
    
}

//valid moves
function isvalid(x,y){
    return x>=0 && x<SIZE &&
           y>=0 && y<SIZE &&
           route[x][y]!='#';
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Initializing search algorithms
const dx = [-1, 1, 0, 0];
const dy = [0, 0, -1, 1];

function initializeSearch(){
    cancelAnimation=false;

    for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            if(route[i][j]=='+' || route[i][j]=='*'){
                route[i][j]='.';
            }
        }
    }

    if(startX == -1 || endX == -1){
        alert("Please place Start and End first!");
        return;
    }
    visited=[];
    parent=[];
     for(let i=0;i<SIZE;i++){
        visited[i]=[];
        parent[i]=[];
        for(let j=0;j<SIZE;j++){
            visited[i][j]=false;
            parent[i][j]=null;
    
        }
    }
    visited[startX][startY] = true;
}

//BFS
async function bfs(){
    initializeSearch();

    let queue=[];
    queue.push({
        x:startX,
        y:startY
    });

    while(queue.length>0){
        if(cancelAnimation)
            return;
        const current = queue.shift();
        const x = current.x;
        const y = current.y;

        if(x==endX && y==endY){
            console.log("Destination found");
            await reconstructPath();
            return;
        }

        for(let i=0;i<4;i++){
            const nx=x+dx[i];
            const ny=y+dy[i];
            
            if(isvalid(nx,ny) && !visited[nx][ny]){
                visited[nx][ny] = true;
                parent[nx][ny]={x,y};
                if(route[nx][ny] == '.'){
                    route[nx][ny] = '+';
                }
                queue.push({
                    x:nx,
                    y:ny
                });
                    
                renderGrid();
                await sleep(speed);
            }
        }

    }
    alert("No path found!");
}   

//DFS
async function dfs(){
   initializeSearch();

    let stack=[];
    stack.push({
        x:startX,
        y:startY
    });

    while(stack.length>0){
        if(cancelAnimation)
            return;
        const current = stack.pop();
        const x = current.x;
        const y = current.y;

        if(x==endX && y==endY){
            console.log("Destination found");
            await reconstructPath();
            return;
        }

        for(let i=0;i<4;i++){
            const nx=x+dx[i];
            const ny=y+dy[i];
            
            if(isvalid(nx,ny) && !visited[nx][ny]){
                visited[nx][ny] = true;
                parent[nx][ny]={x,y};
                if(route[nx][ny] == '.'){
                    route[nx][ny] = '+';
                }
                stack.push({
                    x:nx,
                    y:ny
                });
                    
                renderGrid();
                await sleep(speed);
            }
        }

    }
    alert("No path found!");
}   


async function reconstructPath(){
    let x=endX;
    let y=endY;

    while(x!=startX || y!=startY){
        if(cancelAnimation)
            return;

        if(route[x][y]!='E'){
            route[x][y]='*';
            renderGrid();
            await sleep(speed);
        }
        const p=parent[x][y];
        x=p.x,
        y=p.y
        
    }
     route[startX][startY]='S';
     route[endX][endY]='E';

    
    
     
}



renderGrid();