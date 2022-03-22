// Created by ChillPill 🌶

function encryp(){
    document.getElementById("result").style.display = "none"
    document.getElementById("canvas").style.display = "block"
}

let {random,floor,ceil,round}=Math;
let canvas,ctx,W,H;
let drops=[];
const columns=55;
let fontSize=10;
let intervalA;
class Drop{
    constructor(){
        this.column=floor(random()*columns);
        this.row=0;
    }
    draw(){
        ctx.fillStyle = "green";
        ctx.fillText(String.fromCharCode(floor(random()*208+48)),this.column*cellSize,this.row*cellSize); 
    }
}
function matrix(){
    canvas=document.getElementById("canvas");
    canvas.width=W=window.innerWidth;
    canvas.height=H=window.innerHeight;
    ctx=canvas.getContext("2d");    
    cellSize =W/columns;    
    ctx.font = `bolder ${cellSize}px monospace`;
    drops.length=0;
    intervalA=setInterval(animate,100);
}
function animate(){
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.fillRect(0,0,W,H);
    for(let i=drops.length-1;i>=0;i--){
        drops[i].draw();
        drops[i].row++;
        if(drops[i].row>80) drops.splice(i,1);//please ask me: why dont we use for of?
    }
}
function spawndrop(){
    drops.push(new Drop());
    setTimeout(spawndrop,0+random()*30);
}

function restart(){
    clearInterval(intervalA);
    drops.length=0;
    ctx.fillStyle="rgba(0,0,0,1)";
    ctx.fillRect(0,0,W,H);
    init();
}

