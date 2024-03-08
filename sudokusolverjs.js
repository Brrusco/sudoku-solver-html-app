let outCreated = false;
let autoMode = false ;
let createMode= false;
let createdPossTable= false; 
let shouldRemovePossTable = true;
let showPossTable = false;
var divA1 = document.getElementById("A1");
var divA2 = document.getElementById("A2");
var divB = document.getElementById("B");
var divC = document.getElementById("C");
var tabella = [], cont = 50;
let ricorsiva = false;

// inizializzazione array tabella sudoku
for(var i=0; i<9; i++) {          
        tabella[i] = new Array(9);
        for(var j=0; j<9; j++) {
            tabella[i][j] = new Array(10);
            tabella[i][j][0] = "";
            for(var l=1;l<10;l++){
                tabella[i][j][l]= "1";
            }
        }
}

// creazione array id delle caselle della tabella
let name = "";
let editorName = [];
for(var y=0; y<9; y++) {
    for(var x=0; x<9; x++) {
        eName="in" + x.toString() + y.toString();
        editorName.push(eName);
    }
}

createInTable();
// ricezione input dalle varie caselle
// (in base all id)
for (const edit of editorName){ 
    document.getElementById(edit).addEventListener("input", function() {
        console.log("input event fired by : " + edit);
        let x,y;
        x = Number(edit.slice(2,3));
        y = Number(edit.slice(3));
        var valore = document.getElementById(edit).value;
        if((Number(valore)>0 && Number(valore)<10) || valore === ""){
            tabella[x][y][0] = valore;
            document.getElementById(edit).setAttribute("style","width: 10px; rgb(217, 243, 251)");
        }else{
            document.getElementById(edit).setAttribute("style","width: 10px; background-color: red;");
        }
        if(valore === ""){
            console.log("null a " + x + " " + y );
            if(autoMode){
                risolvi(tabella,ricorsiva);
            }
            updateCell(x,y,valore);
        }else{
            console.log(valore + " a " + x + " " + y );
        }
        if(Number(valore)>0 && Number(valore)<10){
            if(autoMode){
                risolvi(tabella,ricorsiva);
            }
            updateCell(x,y,valore);
        }
        if(showPossTable){
            updatePsT0(x,y);
        }
    }, false);
   
}

createButtonsTable();
createTable();

// rilevamento click sull intera pagina
// utile per criteri di scomparsa tabelle
function htmlclick(){
    //console.log("htmlclick");
    if(createdPossTable && shouldRemovePossTable){
        var rPossTable = document.getElementById("possTable");
        rPossTable.parentNode.removeChild(rPossTable);
        var rPossTable = document.getElementById("possTableTop");
        rPossTable.parentNode.removeChild(rPossTable);
        createdPossTable = false;
    }else{
        shouldRemovePossTable = true;
    }
}

// creazione della tabella per visualizzare e modificare le possibilità di numeri in una casella (PossTable)
// funziona solo se attivata tramite pulsante "Possibilità"
function createPossTable(possX,possY){
    if(createdPossTable){
        var rPossTable = document.getElementById("possTable");
        rPossTable.parentNode.removeChild(rPossTable);
        var rPossTable = document.getElementById("possTableTop");
        rPossTable.parentNode.removeChild(rPossTable);
        createdPossTable = false;
    }
    var psTable = document.createElement('table');
    var psTableBody = document.createElement('tbody');
    var psRow = document.createElement('tr');
    var psCell = document.createElement('td');
    psCell.appendChild(document.createTextNode(tabella[possX][possY][0]));
    psCell.setAttribute("style", "height:47px;width:47px;");
    psCell.setAttribute("id","psT0");
    psRow.appendChild(psCell);
    var psCell = document.createElement('td');
    psCell.appendChild(document.createTextNode(possX + " " + possY));
    psCell.setAttribute("style", "height:47px;width:115px;");
    psCell.setAttribute("id","psTCoo");
    psRow.appendChild(psCell);

    psTableBody.appendChild(psRow);
    psTable.appendChild(psTableBody);
    document.body.appendChild(psTable);
    psTable.setAttribute("id","possTableTop");
    psTable.setAttribute("class","possTableTop");
    psTable.setAttribute("onMouseDown","psTabClick()");
    psTable.setAttribute("style","margin-left:81px;");
    divA2.appendChild(psTable);
    var psTable = document.createElement('table');
    var psTableBody = document.createElement('tbody');
    for (let j=1; j<10; j++) {
        if((j-1)%3==0){
            var psRow = document.createElement('tr');
        }
        var psCell = document.createElement('td');
        var psToggle = document.createElement("button");
        psToggle.textContent= tabella[possX][possY][j];
        psToggle.setAttribute("id", ("psT" + j.toString()));
        psToggle.setAttribute("onmousedown", "updatePsT(" + possX + "," + possY + ",\"" + j + "\")");
        if(tabella[possX][possY][j] === "1"){
            psToggle.setAttribute("style", "height:47px;width:47px;background-color:rgb(105, 155, 255);");
        }else{
            psToggle.setAttribute("style", "height:47px;width:47px;background-color:rgb(141, 228, 255);");
        }
        psCell.appendChild(psToggle);
        psRow.appendChild(psCell);
        if((j-1)%3==0){
            psTableBody.appendChild(psRow);
        }
    }
    psTable.appendChild(psTableBody);
    document.body.appendChild(psTable);
    psTable.setAttribute("id","possTable");
    psTable.setAttribute("class","possTable");
    psTable.setAttribute("onMouseDown","psTabClick()");
    psTable.setAttribute("style","margin-left:81px;");
    divA2.appendChild(psTable);


createdPossTable = true;
}

// criterio di rimozione PossTable
function psTabClick(){
    shouldRemovePossTable = false;
}

// rimozione PossTable (se permesso)
function removePossTable(){
    if(createdPossTable){
        var rPossTable = document.getElementById("possTable");
        rPossTable.parentNode.removeChild(rPossTable);
        var rPossTable = document.getElementById("possTableTop");
        rPossTable.parentNode.removeChild(rPossTable);
        createdPossTable = false;
    }
}

// aggiornamento pulsante "Possibilità" responsabile di PossTable
function possibilità(){
    if(!showPossTable){
        console.log("possibilità on");
        document.getElementById("possibilità").textContent = "possibilità : ON";
        document.getElementById("possibilità").setAttribute("style","background-color:rgb(141, 228, 255);");
        showPossTable = true;
    }else{
        console.log("possibilità off");
        document.getElementById("possibilità").textContent = "possibilità : OFF";
        document.getElementById("possibilità").setAttribute("style","background-color:rgb(105, 155, 255);");
        showPossTable = false;
    }
}

// update parte superiore di PossTable
function updatePsT0(psT0X,psT0Y){
    document.getElementById("psT0").textContent = tabella[psT0X][psT0Y][0];
}

// update Parte inferiore diPossTable
function updatePsT(possX, possY, j){
    if(tabella[possX][possY][j] === "1"){
        tabella[possX][possY][j] = "0";
        document.getElementById("psT" + j.toString()).setAttribute("style", "height:47px;width:47px;background-color:rgb(141, 228, 255);");
    }else{
        tabella[possX][possY][j] = "1";
        document.getElementById("psT" + j.toString()).setAttribute("style", "height:47px;width:47px;background-color:rgb(105, 155, 255);");
    }
    document.getElementById("psT" + j.toString()).textContent= tabella[possX][possY][j];
    if(autoMode){
        risolvi(tabella);
        document.getElementById("psT0").textContent= tabella[possX][possY][0];
    }
    shouldRemovePossTable = false;
}

// creazione tabella che contiene i pulsanti
function createButtonsTable(){
    
    let buttonNames = [
        "risolvi",
        "auto",
        "possibilità",
        "evidenzia"
    ];
    var btTable = document.createElement('table');
    var btTableBody = document.createElement('tbody');
    for (btname of buttonNames) {
        var btRow = document.createElement('tr');
        var btCell = document.createElement('td');
        var button = document.createElement('button');
        if (btname === "risolvi") {
            button.textContent = btname;
            button.setAttribute("onmousedown", "risolviClickDown()");//per il colore
            button.setAttribute("onmouseup", "risolviClickUp()");//per il colore
            button.setAttribute("onclick", btname + "(tabella,ricorsiva)");//via all'algoritmo
        }else {
            button.textContent= btname + " : OFF";
            button.setAttribute("onclick", btname + "()");
        }
        button.setAttribute("class", "button");
        button.setAttribute("id", btname);
        btCell.appendChild(button);
        btRow.appendChild(btCell);
        btTableBody.appendChild(btRow);
    }

    btTable.appendChild(btTableBody);
    document.body.appendChild(btTable);
    btTable.setAttribute("id" , "buttonTb");
    btTable.setAttribute("class", "buttonTb" );
    //btTable.setAttribute("style", "float: left;border:solid black;");
    divB.appendChild(btTable);
    var space = document.createElement('p');
    divB.appendChild(space);
}

// creazione tabella che che contiene i pulsanti per l'evidenziazione dei numeri su outTable (evTab)
// (se permesso)
function evidenzia() {
    if (document.getElementById("evidenzia").textContent === "evidenzia : OFF") {
        document.getElementById("evidenzia").textContent = "evidenzia : ON";
        document.getElementById("evidenzia").setAttribute("style", "background-color:rgb(141, 228, 255);");
        var evTable = document.createElement('table');
        var evTableBody = document.createElement('tbody');
        for (let i = 0; i < 3; i++) {
            var evRow = document.createElement('tr');
            for (let j = 0; j < 3; j++) {
                var evCell = document.createElement('td');
                var evButton = document.createElement('button');
                evButton.textcontent = (i + 1).toString;
                evButton.setAttribute("onclick", "evidenziaNum(" + (((i * 3) + j) + 1) + ")");
                evButton.setAttribute("class", "evButton");
                evButton.setAttribute("id", "evidenzia " + (((i * 3) + j) + 1).toString());
                evButton.textContent = (((i * 3) + j) + 1);
                evButton.setAttribute("style","background-color:rgb(105, 155, 255);")
                evCell.setAttribute("class", "evCell");
                evCell.appendChild(evButton);
                evRow.appendChild(evCell);
            }
            evTableBody.appendChild(evRow);
        }
        evTable.appendChild(evTableBody);
        evTable.setAttribute("id","evTable");
        evTable.setAttribute("class","evTable");
        divB.appendChild(evTable);
    } else if (document.getElementById("evidenzia").textContent === "evidenzia : ON") {
        var rEvTable = document.getElementById("evTable");
        rEvTable.parentNode.removeChild(rEvTable);
        document.getElementById("evidenzia").textContent = "evidenzia : OFF";
        document.getElementById("evidenzia").setAttribute("style", "background-color:rgb(105, 155, 255);");

    }
}

// evidenziazione numeri (in seguito al premere il pulsante corrispondente in evTab)

function evidenziaNum(num) {
    console.log("evidenzia " + num);
    let evButtonState;
    if (document.getElementById("evidenzia " + num.toString()).style.backgroundColor === "rgb(105, 155, 255)") {
        document.getElementById("evidenzia " + num.toString()).setAttribute("style", "background-color:rgb(141, 228, 255);");//ON
        evButtonState = true;

        for (let i = 1; i < 10; i++) {
            if (i !== num) {
            //console.log("evidenzia " + i.toString());
                if (document.getElementById("evidenzia " + i.toString()).style.backgroundColor === "rgb(141, 228, 255)") {
                    console.log("remove on state on " + i);
                    document.getElementById("evidenzia " + i.toString()).setAttribute("style", "background-color:rgb(105, 155, 255);");
                }
            }
        }

    } else if (document.getElementById("evidenzia " + num.toString()).style.backgroundColor === "rgb(141, 228, 255)"){
        document.getElementById("evidenzia " + num.toString()).setAttribute("style", "background-color:rgb(105, 155, 255);");//OFF
        evButtonState = false;
    }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let evNumId = "o" + j.toString() + i.toString();
            if (document.getElementById(evNumId).textContent === num.toString()) {
                if (evButtonState) {
                    document.getElementById(evNumId).setAttribute("style", "background-color:red");
                } else if (!evButtonState) {
                    document.getElementById(evNumId).setAttribute("style", "background-color:rgb(183, 234, 250)");
                }
            } else {
                if (document.getElementById(evNumId).style.backgroundColor === "red") {
                    document.getElementById(evNumId).setAttribute("style", "background-color:rgb(183, 234, 250)");
                }
            }
		}
    }
}

// creazione tabella di input (inTable)
function createInTable(){

    var inTable = document.createElement('table');
    var inTableBody = document.createElement('tbody');
    let inCellY=0;
    let inCellId;

    for(let i=0; i<9; i++){
        var inRow = document.createElement('tr');
        let inCellX=0;

        for (let j=0; j<9; j++) {
            var inCell = document.createElement('td');
            inCell.appendChild(document.createTextNode(""));
            inCellId =inCellX.toString() + inCellY.toString();
            inCell.setAttribute("id",("intd" + inCellId));
            inCell.setAttribute("style","padding: 7px 10px;");
            var input = document.createElement('input');
            input.setAttribute("style","width: 11px;");
            input.setAttribute("type","text");
            input.setAttribute("value",tabella[j][i][0]);
            input.setAttribute("id", ("in" + inCellId));
            input.setAttribute("onclick","inTdClick(" + inCellX + "," + inCellY + ")");
            input.setAttribute("onmousedown","inTdMouseDown(" + inCellX + "," + inCellY + ")");
            input.setAttribute("onblur","inTdBlur(" + inCellX + "," + inCellY + ")");
            inCell.appendChild(input);
            inRow.appendChild(inCell);
            inCellX++;
        }
            inTableBody.appendChild(inRow);
            inCellY++;
    }
    inTable.appendChild(inTableBody);
    document.body.appendChild(inTable);
    inTable.setAttribute("id" , "inTable");
    inTable.setAttribute("class", "sudTable" );
    divA1.appendChild(inTable);
}

// gestione della creazione di PossTable in seguito ad un click su inTable
// (se permesso)
function inTdMouseDown(inMx,inMy){
    //console.log("inTdMouseDown");
    if(createdPossTable){
        var rPossTable = document.getElementById("possTable");
        rPossTable.parentNode.removeChild(rPossTable);
        var rPossTable = document.getElementById("possTableTop");
        rPossTable.parentNode.removeChild(rPossTable);
        createdPossTable = false;
    }
    shouldRemovePossTable = false;
    if(showPossTable){
        createPossTable(inMx,inMy);
        createdPossTable = true;
    }
}

// gestione evidenziazione di colonna e riga (di inTable) in seguito ad un click su inTable
function inTdClick(inCx,inCy){
    //console.log("inTdClick");
    let idx,idy;
    for(let i=0;i<9;i++){
        idx = "intd" + inCx + i;
        idy = "intd" + i + inCy;
        document.getElementById(idx).setAttribute("style","width: 10px;background-color: rgb(192, 213, 255)");
        document.getElementById(idy).setAttribute("style","width: 10px;background-color: rgb(192, 213, 255)");
    }

    shouldRemovePossTable = false;
    //createPossTable(inCx,inCy);
}

// rimozione evidenziazione di colonna e riga (di inTable) in seguito ad onBlur di inTable e eventuale rimozione di possTable
function inTdBlur(inBx,inBy){
    //console.log("inTdBlur");
    let idx,idy;
    for(let i=0;i<9;i++){
        idx = "intd" + inBx + i;
        idy = "intd" + i + inBy;
        document.getElementById(idx).setAttribute("style","width: 10px;background-color: rgb(231, 249, 255)");
        document.getElementById(idy).setAttribute("style","width: 10px;background-color: rgb(231, 249, 255)");
    }
    
    if(createdPossTable && shouldRemovePossTable){
        removePossTable();
    }

}

// gestione attivazione e spegnimento di autoMode in seguito al click del pulsante "auto"
function auto(){
    if(!autoMode){
        console.log("autoMode on");
        document.getElementById("auto").textContent = "auto : ON";
        document.getElementById("auto").setAttribute("style","background-color:rgb(141, 228, 255);");
        autoMode = true;
    }else{
        console.log("autoMode off");
        document.getElementById("auto").textContent = "auto : OFF";
        document.getElementById("auto").setAttribute("style","background-color:rgb(105, 155, 255);");
        autoMode = false;

    }
}

// aggiornamento caselle di inTable e outTable in caso di input o assegnazione numero da parte dell algoritmo
// gestione evidenziazione numeri su outTable
function updateCell(x,y,valore){
    if(Number(valore)>0 && Number(valore)<10){
        document.getElementById("o" + x.toString() + y.toString()).textContent = valore;
        if (document.getElementById("evidenzia").textContent === "evidenzia : OFF") {
            document.getElementById("o" + x.toString() + y.toString()).setAttribute("style", "background-color: rgb(183, 234, 250);");
        }else if (document.getElementById("evidenzia " + valore).style.backgroundColor === "rgb(141, 228, 255)") {
            document.getElementById("o" + x.toString() + y.toString()).setAttribute("style", "background-color: red;")
        } else {
            document.getElementById("o" + x.toString() + y.toString()).setAttribute("style", "background-color: rgb(183, 234, 250);");
        }
        document.getElementById("in"+x.toString()+y.toString()).value = valore;
    }
    if(valore === ""){
        document.getElementById("o"+x.toString()+y.toString()).textContent = "x";
        document.getElementById("o"+x.toString()+y.toString()).setAttribute("style", "background-color: rgb(192, 213, 255)")
    }
}

// creazione tabella di output (outTable)
function createTable() {
    var tableData = [];
    for(var i=0; i<9; i++) {
        tableData[i] = new Array(9);
    }
    for(var y=0; y<9; y++) {
        for(var x=0; x<9; x++) {
            tableData[x][y] = tabella[y][x][0];
            if(tableData[x][y] === ""){
                tableData[x][y] = "x";
            }
        }
    }

    var table1 = document.createElement('table');
    var tableBody = document.createElement('tbody');
    let cellY=0;
    let cellId;

    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');
        let cellX=0;

        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            cellId = "o" + cellX.toString() + cellY.toString();
            cell.setAttribute("id" , cellId);
            if(cell.textContent === "x"){
                cell.setAttribute("style", "background-color: rgb(192, 213, 255)");
            }
            row.appendChild(cell);
            cellX++;
        });
            tableBody.appendChild(row);
            cellY++;
    });

    table1.appendChild(tableBody);
    document.body.appendChild(table1);
    table1.setAttribute("id" , "outTable");
    table1.setAttribute("class", "outTable" );
    //table1.setAttribute("style", "float: left;");
    divC.appendChild(table1);
    

    outCreated = true;
}

// gestione bottone "Risolvi"
function risolviClickDown(){
    document.getElementById("risolvi").setAttribute("style","background-color: rgb(192, 213, 255);");
}
function risolviClickUp(){
    document.getElementById("risolvi").setAttribute("style","background-color:rgb(105, 155, 255);");
}
let recursiveRis = false;

// algoritmo di risoluzione del sudoku

function risolvi(tabella,ricorsiva){
    
    let QuantNum = new Array(9), quantColNum = new Array(9), quantRigaNum = new Array(9);
    let posx = 0, posy = 0, cont = 50, quadx = 0, quady = 0, memx = 0, memy = 0, memx2 = 0, memy2 = 0, memx3 = 0, memy3 = 0, SingPos = 9, memn = 0, memColx = 0, memColy = 0, memRigax = 0, memRigay = 0;
    let foundNumbers = 0;
    let fail = false;
    
    

    while(cont > 0){
        posx = 0;
        posy = 0;
        quadx = 0;
        quady = 0;
        for (posy = 0; posy < 9; posy++){
            quady = Math.floor(posy / 3);
            for(posx = 0; posx < 9; posx++){
                quadx = Math.floor(posx / 3);
                if (tabella[posx][posy][0] !== ""){
                    for(let k = 0; k < 9; k++){
                        tabella[posx][posy][k+1] = "0";
                    }
                    ////////////////////////////////////
                    for(let q=0; q< 3; q++){
                        for(let p=0; p < 3; p++){
                            tabella[p+(quadx*3)][q+(quady*3)][Number(tabella[posx][posy][0])] = "0";
                        }
                    }
                    ////////////////////////////////////
                    for(let k=0; k< 9; k++){
                        tabella[posx][k][Number(tabella[posx][posy][0])] = "0";
                        tabella[k][posy][Number(tabella[posx][posy][0])] = "0";
                    }
                    ////////////////////////////////////
                }
            }
        }
        ////////////////////////////////////////////////
        for (quady = 0; quady < 3; quady++){
            for (quadx = 0; quadx < 3; quadx++){
                for (let k = 0; k < 9; k++){
                    QuantNum[k] = 9;
                }
                for (let k = 0; k < 9; k++){
                    memx = 0;
                    memy = 0;
                    memx2 = 0;
                    memy2 = 0;
                    for (posy = 0; posy < 3; posy++){
                        for (posx = 0; posx < 3; posx++){
                            if (tabella[(quadx * 3)+posx][(quady * 3)+posy][k + 1] === "0"){
                                QuantNum[k]--;
                            }
                            else {
                                memx3 = memx2;
                                memy3 = memy2;
                                memx2 = memx;
                                memy2 = memy;
                                memx = (quadx * 3) + posx;
                                memy = (quady * 3) + posy;
                            }
                        }
                    }
                    if(QuantNum[k] === 1){
                        tabella[memx][memy][0] = (k + 1).toString();
                        if (!ricorsiva) {
                            console.log((k + 1) + " a " + (memx + 1) + " " + (memy + 1));
                            updateCell(memx,memy,(k + 1).toString());
                        }
                    }
                    if(QuantNum[k] === 2){
                        if (memx === memx2){
                            for(let i = 0; i < 9; i++)
                            {
                                if (i!== memy && i!== memy2) { 
                                    tabella[memx][i][k + 1] = "0"; 
                                }
                            }
                        }
                        if (memy === memy2){
                            for (let i = 0; i < 9; i++)
                            {
                                if (i!==memx && i!==memx2) { 
                                    tabella[i][memy][k + 1] = "0"; 
                                }
                            }
                        }                        
                    }
                    if (QuantNum[k] === 3) {
                        if (memx === memx2 && memx2 === memx3) {
                            console.log("si");
                            for (let i = 0; i < 9; i++) {
                                if (i !== memy && i !== memy2 && i !== memy3) {
                                    tabella[memx][i][k + 1] = "0";
                                }
                            }
                        }
                        if (memy === memy2 && memy2 === memx3) {
                            console.log("si");
                            for (let i = 0; i < 9; i++) {
                                if (i !== memx && i !== memx2 && i !== memx3) {
                                    tabella[i][memy][k + 1] = "0";
                                }
                            }
                        }
                    }
                }
            }
        }
        ////////////////////////////////////////////////////////////
        for (posy = 0; posy < 9; posy++) {
            for (let k = 0; k < 9; k++) {
                quantColNum[k] = 9;
                quantRigaNum[k] = 9;
            }
            for (let k = 0; k < 9; k++) {
                memColx = 0;
                memColy = 0;
                memRigax = 0;
                memRigay = 0;
                for (posx = 0; posx < 9; posx++) {
                    if (tabella[posx][posy][k + 1] === "0") {
                        quantRigaNum[k]--;
                    }else {
                        memRigax = posx;
                        memRigay = posy;
                    }
                    if (tabella[posy][posx][k + 1] === "0") {
                        quantColNum[k]--;
                    }
                    else {
                        memColx = posy;
                        memColy = posx;
                    }
                }
                if (quantRigaNum[k] === 1) {
                    tabella[memRigax][memRigay][0] = (k + 1).toString();
                    if (!ricorsiva) {
                        console.log((k + 1) + " a " + (memRigax + 1) + " " + (memRigay + 1));
                        updateCell(memRigax, memRigay, (k + 1).toString());
                        console.log("1");
                    }
                }
                if (quantColNum[k] === 1) {
                    tabella[memColx][memColy][0] = (k + 1).toString();
                    if (!ricorsiva) {
                        updateCell(memColx, memColy, (k + 1).toString());
                        console.log((k + 1) + " a " + (memColx + 1) + " " + (memColy + 1));
                    }                  
                }
            }
        }
        ////////////////////////////////////////
        for(posy = 0; posy < 9; posy++){
            for(posx =0; posx < 9; posx++){
                SingPos = 9;
                for (let k = 0; k < 9; k++)
                {
                    if (tabella[posx][posy][k+1] === "0"){
                        SingPos--;
                    }
                    else{
                        memn = k+1;
                    }
                }
                if (SingPos === 1){
                    tabella[posx][posy][0] = memn.toString();
                    if (!ricorsiva) {
                        updateCell(posx, posy, memn.toString());
                        console.log((memn) + " a " + (posx + 1) + " " + (posy + 1));
                    }  
                }
            }
        }
        cont--;
        /////////////////////////////////////////////////////////
        //area attiva se la funzione è in modalità ricorsiva
        if (ricorsiva) {






            let ricQuantPoss = 9;
            //controllo per fallimenti possibilità
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 0; j++) {                   
                    if (tabella[j][i][0] === 0) {
                        ricQuantPoss = 9;
                        for (var l = 1; l < 10; l++) {
                            if (tabella[j][i][l] === 0) {
                                ricQuantPoss--;
                            }
                        }
                    }
                    if (ricQuantPoss === 0) {
                        return 0;
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////
        //conteggio soluzioni trovate
        foundNumbers = 0;
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(tabella[j][i][0] !== ""){
                    foundNumbers++;
                }
            }
        }
        if(foundNumbers === 81){
            cont = 0;
            console.log("uscita per risoluzione")
        }
        /////////////////////////////////////////////////////////
    }
    if (foundNumbers !== 81) {
        console.log("uscita per limite cicli")
        
        
        ricorsiva = confirm("attivare possibilità ?(premere OK)");
        if (ricorsiva) {
            // inizializzazione array tabella temporanea
            let possTabella = tabella;

        }
            
        
    }
    /*
    if(foundNumbers<81){
        if(!recursiveRis){
            recursiveRis = true;
            let minPosCount = 9,minPosX,minPosY;
            for(let i=0;i<9;i++){
                for(let j=0;j<9;j++){
                    let posCount = [];
                    for(let l=1;l<10;l++){
                        if(tabella[j][i][l] === "1"){
                            posCount.push(tabella[j][i][l]);
                        }
                    }
                    if(posCount.lenght<minPosCount){
                        minPosCount=posCount.length;
                        let poss = posCount;
                        minPosX=j;
                        minPosY=i;
                    }
                }
            }
            tabella[minPosX][minPosY][poss[0]]="0";
            risolvi(tabella);
            if(fail){
                fail = false;
                tabella[minPosX][minPosY][poss[0]]="1";
                tabella[minPosX][minPosY][poss[1]]="0";
                risolvi(tabella);
            }
        }else{
            fail = true;
        }
    }
    */





}