
//FRESH GAME DATA
var freshData = {
    debris: 27.3,
    debrisPer: 1,
    ice:12.8,
    icePer: 1,
    cell: 0,
    cellPer: 0,
    cellCultivationCost: 30,
    cellSeen: 0,   
    gravityRitualCost: 5,
    clock: 0
}

//GAME DATA(PROFILE)
var gameData = freshData

//FORMATTING
function format(number, type) {
	let exponent = Math.floor(Math.log10(number))
	let mantissa = number / Math.pow(10, exponent)
	if (exponent < 3) return number.toFixed(1)
	if (type == "scientific") return mantissa.toFixed(2) + "e" + exponent
	if (type == "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + (Math.floor(exponent / 3) * 3)
}

//INCREASE DEBRIS
function gatherDebris() {
    gameData.debris += gameData.debrisPer
    document.getElementById("debrisGathered").innerHTML = format(gameData.debris, "scientific")
}

//INCREASE ICE
function gatherIce() {
    gameData.ice += gameData.icePer
    document.getElementById("iceGathered").innerHTML = format(gameData.ice, "scientific")
}

//INCREASE CELL
function gatherCell() {
    gameData.cell += gameData.cellPer
    document.getElementById("cellGathered").innerHTML = format(gameData.cell, "scientific")
}

//INCREASE GOLD PER CLICK
function performGravityRitual() {
    if (gameData.debris >= gameData.gravityRitualCost) {
        gameData.debris -= gameData.gravityRitualCost
        gameData.debrisPer += 1
        gameData.icePer += 0.5
        gameData.gravityRitualCost *= 1.1
        document.getElementById("debrisGathered").innerHTML = format(gameData.debris, "scientific")
        document.getElementById("gravityRitualCost").innerHTML = format(gameData.gravityRitualCost, "scientific")
        document.getElementById("debrisPer").innerHTML = "Gather " + format(gameData.debrisPer, "scientific") + " debris"
        document.getElementById("debrisPerAMT").innerHTML = format(gameData.debrisPer, "scientific") + "<br>"
        document.getElementById("icePerAMT").innerHTML = format(gameData.icePer) + "<br>"
    }
}

//increase cell production
function performCellCultivation() {
    if (gameData.debris >= (0.2*gameData.cellCultivationCost)) {
        if (gameData.ice >= (0.8*gameData.cellCultivationCost)){
            gameData.debris -= 0.2*gameData.cellCultivationCost
            gameData.ice -= 0.8*gameData.cellCultivationCost
            gameData.cellPer += 0.1
            gameData.cellCultivationCost *= 1.5
            document.getElementById("debrisGathered").innerHTML = format(gameData.debris, "scientific")
            document.getElementById("iceGathered").innerHTML = format(gameData.ice, "scientific")
            document.getElementById("cellPerAMT").innerHTML = format(gameData.cellPer, "scientific") + "<br>"
            document.getElementById("cellCultivationCost_Debris").innerHTML = format(0.2*gameData.cellCultivationCost, "scientific")
            document.getElementById("cellCultivationCost_Ice").innerHTML = format(0.8*gameData.cellCultivationCost, "scientific")
            //SHOWS CELLS
            if(gameData.cellSeen == 0) {
                document.getElementById("cellLabel").style.display="inline-block"
                document.getElementById("cellGathered").style.display="inline-block"
                document.getElementById("cellPerAMT").style.display="inline-block"
                gameData.cellSeen = 1
            }

        }
    }
}

//DELETE CONF
function confirmDelete(){
    document.getElementById("deleteButton1").style.display = "none"
    document.getElementById("deleteButton2").style.display = "inline-block"
}

//DELETE PROFILE
function deleteSave(){
    localStorage.removeItem("goldMinerSave")
    location.reload()

}
//SAVE PROFILE
function forceSave(){
    localStorage.setItem("goldMinerSave", JSON.stringify(gameData))
}

//STARTUP

//HIDE DELETE CONFIRMATION
document.getElementById("deleteButton2").style.display = "none"

//LOAD EXISTING PROFILE GAME
var savegame = JSON.parse(localStorage.getItem("goldMinerSave"))
if (savegame !== null) {
    gameData = savegame
}
//DISPLAY CORRECT PRICES
document.getElementById("debrisGathered").innerHTML = format(gameData.debris, "scientific")
document.getElementById("debrisPer").innerHTML = "Gather " + format(gameData.debrisPer, "scientific") + " debris"
document.getElementById("debrisPerAMT").innerHTML = format(gameData.debrisPer, "scientific") + "<br>"
document.getElementById("gravityRitualCost").innerHTML = "Debris cost: " + format(gameData.gravityRitualCost, "scientific")
document.getElementById("iceGathered").innerHTML = format(gameData.ice, "scientific")
document.getElementById("icePerAMT").innerHTML = format(gameData.icePer, "scientific") + "<br>"
document.getElementById("cellCultivationCost_Debris").innerHTML = 0.2*format(gameData.cellCultivationCost, "scientific")
document.getElementById("cellCultivationCost_Ice").innerHTML = 0.8*format(gameData.cellCultivationCost, "scientific")
if(gameData.cellSeen == 1) {
    document.getElementById("cellLabel").style.display= "inline-block"
    document.getElementById("cellGathered").style.display= "inline-block"
    document.getElementById("cellGathered").innerHTML= format(gameData.cell, "scientific")
    document.getElementById("cellPerAMT").style.display= "inline-block"
    document.getElementById("cellPerAMT").innerHTML= format(gameData.cellPer, "scientific")

}


//AUTOSAVE
var saveGameLoop = window.setInterval(function() {
    forceSave()
}, 10000)

//GAME LOOP (1 SECOND INTERVAL)
var mainGameLoop = window.setInterval(function(){
    gatherDebris()
    gatherIce()
    gatherCell()

}, 1000)