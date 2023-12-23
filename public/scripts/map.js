import {ApiService} from "./ApiService.js";


function loadInfo(){
    const api = new ApiService();
    let ans = api.getScan();
    ans.then((data) =>{
        console.log(data.body)
        console.log(findClosestShips(data.body.scan.myShips, data.body.scan.enemyShips));
        let com = calculateCommands(data.body.scan.myShips, data.body.scan.enemyShips);
        console.log(com);
        $(".postCommands").click(()=>{
            postCommands(com);
        })
    })
}

function postCommands(commands){
    const api = new ApiService();
    let answer = api.postCommands(commands);
    answer.then((data)=>{
        console.log(data)
    })
}



function findClosestShips(myShips, enemyShips) {
    let minDistance = Number.MAX_VALUE;
    let closestMyShip = null;
    let closestEnemyShip = null;

    for (const myShip of myShips) {
        for (const enemyShip of enemyShips) {
            const distance = calculateDistance(myShip.x, myShip.y, enemyShip.x, enemyShip.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestMyShip = myShip;
                closestEnemyShip = enemyShip;
            }
        }
    }

    return {
        myShip: closestMyShip,
        enemyShip: closestEnemyShip,
        minDistance: minDistance
    };
}

function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function calculateCommands(myShips, enemyShips) {
    const commands = {};
    commands['ships'] = [];
    for (const myShip of myShips) {
        const closestEnemyShip = findClosestShips([myShip], enemyShips).enemyShip;

        if (closestEnemyShip) {
            // Пример расчета команд: изменение скорости, поворот, выстрел
            let rotateCommand = 0;
            if(calculateDirection(myShip.x, myShip.y, closestEnemyShip.x, closestEnemyShip.y) !== myShip.direction){
                rotateCommand = calculateTurnAngle(myShip.direction, calculateDirection(myShip.x, myShip.y, closestEnemyShip.x, closestEnemyShip.y));
            }

            let command = {};
            command['id'] = myShip.id;
            if(calculateDistance(myShip.x, myShip.y, closestEnemyShip.x, closestEnemyShip.y) < 20){
                command['cannonShoot'] = { x: closestEnemyShip.x, y: closestEnemyShip.y };
            }
            if(rotateCommand != 0){
                command['rotate'] = rotateCommand;
            }
            command['changeSpeed'] = calculateSpeedCommand(myShip, closestEnemyShip);
            commands['ships'].push(command);
        }
    }

    return commands;
}


function calculateSpeedCommand(myShip, enemyShip) {

    return myShip.speed+myShip.maxChangeSpeed;
}

function calculateDirection(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? "east" : "west";
    } else {
        return deltaY > 0 ? "south" : "north";
    }
}
function calculateTurnAngle(currentDirection, targetDirection) {
    // Преобразуем направления в числа для удобства вычислений
    const directions = { "north": 0, "east": 90, "south": 180, "west": 270 };

    // Вычисляем разницу между текущим и целевым направлениями
    const angleDifference = directions[targetDirection] - directions[currentDirection];

    // Нормализация угла в диапазон [-180, 180]
    const normalizedAngleDifference = (angleDifference + 540) % 360 - 180;

    // Определяем, на какой угол нужно повернуться: 90 или -90
    return Math.abs(normalizedAngleDifference) === 90 ? normalizedAngleDifference : 0;
}



function calculateRotateCommand(currentDirection, targetDirection) {

    // Здесь вы можете реализовать логику для поворота корабля в направлении противника
    // В данном примере возвращается угол поворота между текущим и целевым направлением.
    return targetDirection - currentDirection;
}

function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

loadInfo()