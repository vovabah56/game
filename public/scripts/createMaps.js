import {ApiService} from "./ApiService.js";


function zapCan(array2D){


// Размер ячейки в пикселях
    const cellSize = 1;

// Создаем Canvas
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

// Заполняем Canvas на основе массива
    for (let y = 0; y < array2D.length; y++) {
        for (let x = 0; x < array2D[y].length; x++) {
            const cellValue = array2D[y][x];

            ctx.fillStyle = cellValue == 1 ? 'black' : 'white';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }

    let api = new ApiService();
    let ans = api.getScan()
    ans.then((data)=>{
        loadShips(data.body.scan.myShips, data.body.scan.enemyShips)
    })

}

function loadShips(myShips, enemyShip){
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    for(let ship of myShips){
        ctx.fillStyle = 'red';
        ctx.fillRect(ship.x, ship.y, 5, 5);
    }
    for(let ship of enemyShip){
        ctx.fillStyle = 'blue';
        ctx.fillRect(ship.x, ship.y, 5, 5);
    }

}



function createArr(arr){

    console.log(arr)
    const rows = 2000;
    const cols = 2000;
    let twoDimArray = [];

    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(0);
        }
        twoDimArray.push(row);
    }
    twoDimArray = Array(rows).fill().map(() => Array(cols).fill(0));

    for(let island of arr.islands){
        let x = island.start[0]
        let y = island.start[1];

        for (let yOff = 0; yOff < island.map.length; yOff++) {
            for (let xOff = 0; xOff < island.map[yOff].length; xOff++){
                    twoDimArray[y + yOff][x + xOff] = 1 ;

            }
        }
    }

    zapCan(twoDimArray);
}




function loadArr(){
    const api = new ApiService();
    let ans = api.getMap();
    ans.then((data) =>{
        console.log(data);
        const url = data.body.mapUrl;

        $.getJSON(url, function(data) {
            // Ваш код обработки данных
            createArr(data)
        });
    })
}

loadArr();
