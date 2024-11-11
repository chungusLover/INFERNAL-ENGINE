
//FRESH GAME DATA
var freshData = {
    debris: 10000,
    debrisPer: 1,
    ice: 10000,
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
//Current purchase amount
var purchaseAMT = 1

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

//INCREASE DEBRIS PER
function performGravityRitual(quantity) {

    const multiplier = 1.1;

    let maxAffordable = calculateMaxAffordable(gameData.gravityRitualCost, multiplier, gameData.debris);
    quantity = quantity === "max" ? maxAffordable : Math.min(quantity, maxAffordable);

    let totalCost = calculateTotalCost(gameData.gravityRitualCost, multiplier, quantity);

    if (gameData.debris >= totalCost) {
        gameData.debris -= totalCost
        gameData.debrisPer += quantity
        gameData.icePer += 0.5*quantity
        gameData.gravityRitualCost *= Math.pow(multiplier, quantity)

        document.getElementById("debrisGathered").innerHTML = format(gameData.debris, "scientific")
        document.getElementById("gravityRitualCost").innerHTML = format(gameData.gravityRitualCost, "scientific")
        document.getElementById("debrisPer").innerHTML = "Gather " + format(gameData.debrisPer, "scientific") + " debris"
        document.getElementById("debrisPerAMT").innerHTML = format(gameData.debrisPer, "scientific") + "<br>"
        document.getElementById("icePerAMT").innerHTML = format(gameData.icePer) + "<br>"
    }
}

//increase cell production
function performCellCultivation(quantity) {
    //GENERIC COST MULTIPLIER FOR EACH RESOURCE
    const multiplier = 1.5
    //FIND MAX AMOUNT ABLE TO BE AFFORDED
    let maxAffordableDebris = calculateMaxAffordable(0.2*gameData.cellCultivationCost, multiplier, gameData.debris)
    let maxAffordableIce = calculateMaxAffordable(0.8*gameData.cellCultivationCost, multiplier, gameData.ice)
    //GET A QUANTITY FOR EACH  RESOURCE INDIVIDUALLY
    quantityDebris = quantity === "max" ? maxAffordableDebris : Math.min(quantity, maxAffordableDebris)
    quantityIce = quantity === "max" ? maxAffordableIce : Math.min(quantity, maxAffordableIce)
    //FIND THE SMALLEST DENOMINATOR
    let quantityLCD = Math.min(quantityDebris, quantityIce)
    //SET EACH COST WITH RESPECT TO THE SMALLEST
    let totalCostDebris = calculateTotalCost(0.2*gameData.cellCultivationCost, multiplier, quantityLCD)
    let totalCostIce = calculateTotalCost(0.8*gameData.cellCultivationCost, multiplier, quantityLCD)
    //ACTUAL ACTION OF PURCHASE
    if (gameData.debris >= totalCostDebris) {
        if (gameData.ice >= totalCostIce){
            //PAYING FOR UPGRADE
            gameData.debris -= totalCostDebris
            gameData.ice -= totalCostIce
            //APPLYING UPGRADE
            gameData.cellPer += 0.1*quantityLCD
            //MAKING FUTURE UPGRADES MORE EXPENSIVE
            gameData.cellCultivationCost *= Math.pow(multiplier, quantityLCD)
            //UPDATE GUI
            document.getElementById("debrisGathered").innerHTML = format(gameData.debris, "scientific")
            document.getElementById("iceGathered").innerHTML = format(gameData.ice, "scientific")
            document.getElementById("cellPerAMT").innerHTML = format(gameData.cellPer, "scientific") + "<br>"
            document.getElementById("cellCultivationCost_Debris").innerHTML = format(0.2*gameData.cellCultivationCost, "scientific")
            document.getElementById("cellCultivationCost_Ice").innerHTML = format(0.8*gameData.cellCultivationCost, "scientific")
            //SHOWS CELLS AND REVEALS INFO
            if(gameData.cellSeen == 0) {
                document.getElementById("cellLabel").style.display="inline-block"
                document.getElementById("cellGathered").style.display="inline-block"
                document.getElementById("cellPerAMT").style.display="inline-block"
                gameData.cellSeen = 1
            }

        }
    }
}
//PURCHASE MULTIPLIER
document.querySelector("div.checkBox").addEventListener("click", function(evt){
    if(evt.target.type === "radio"){
        if (evt.target.value == "oneX"){
            purchaseAMT = 1
        } 
        if (evt.target.value == "fiveX") {
            purchaseAMT = 5
        }
        if (evt.target.value == "maxX") {
            purchaseAMT = "max"
        }
        document.getElementById("results").innerHTML = purchaseAMT;
    }
})
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("input[name='purchaseAmount'][value='oneX']").checked = true;
});
//CALC TOTAL COST
function calculateTotalCost(baseCost, multiplier, quantity) {
    return baseCost * ((Math.pow(multiplier, quantity) - 1) / (multiplier - 1));
}
//CALC MAX AFFORDABLE
function calculateMaxAffordable(baseCost, multiplier, currentResources) {
    let quantity = 0;
    let totalCost = 0;

    while (true) {
        let nextCost = calculateTotalCost(baseCost, multiplier, quantity + 1) - totalCost;
        if (totalCost + nextCost > currentResources) break;

        quantity++;
        totalCost += nextCost;
    }
    return quantity;
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
document.getElementById("cellCultivationCost_Debris").innerHTML = format(0.2*gameData.cellCultivationCost, "scientific")
document.getElementById("cellCultivationCost_Ice").innerHTML = format(0.8*gameData.cellCultivationCost, "scientific")
if(gameData.cellSeen == 1) {
    document.getElementById("cellLabel").style.display= "inline"
    document.getElementById("cellGathered").style.display= "inline"
    document.getElementById("cellGathered").innerHTML= format(gameData.cell, "scientific")
    document.getElementById("cellPerAMT").style.display= "inline"
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