console.log('weapon select');

const BASE_URL = 'https://bymykel.github.io/CSGO-API/api/en';

const WEAPON_URL = BASE_URL + '/skins.json';

const queryParams = new URLSearchParams(window.location.search);
let selectedTeam = queryParams.get("team");
console.log("Selected team:", selectedTeam);

const teamSpan = document.getElementById('team-span');
teamSpan.innerHTML = selectedTeam == "terrorists"? "TERRORISTS":"COUNTER TERRORISTS";

let startingBalance = 9000;
const balanceAmt = document.getElementById('balanceAmt');
const balanceLabel = document.createElement('label');
balanceLabel.innerHTML = `BALANCE: $ ` + startingBalance;
balanceAmt.append(balanceLabel);

let backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', function() {
    const queryParams = new URLSearchParams({
        team: selectedTeam
    });
    window.location.href = `character-select.html?${queryParams.toString()}`;
});

fetch(WEAPON_URL)
  .then((response) => response.json())
  .then((data) => {
    console.log("weapon data",data);
    let weaponsList = data;
    const grid = document.getElementById('grid');
    for(let weapon of weaponsList){
        if(weapon?.team?.id == selectedTeam || weapon?.team?.id == "both"){
            let price;
            if(weapon?.category?.name == 'Pistols'){
                price = 500;
            } else if(weapon?.category?.name == 'SMGs'){
                price = 1200;
            } else if(weapon?.category?.name == 'Rifles'){
                price = 2000;
            } else if(weapon?.category?.name == 'Heavy'){
                price = 3000;
            } else if(weapon?.category?.name == 'Knives'){
                price = 300;
            } else if(weapon?.category?.name == 'Gloves'){
                price = 200;
            }
            const agentCard = createWeaponCard(weapon,price);
            grid.appendChild(agentCard);
        }
    }
  }).catch((error) => console.error("Error fetching data:", error));


  function createWeaponCard(weapon,price) {
    const card = document.createElement('div');
    card.classList.add('weapon-card');
    card.innerHTML = `
        <input type="checkbox" id="${weapon.name}" value="${price}" data-id="${weapon?.id}" data-type="${weapon?.team?.id}">
        <label for="${weapon.name}"><img class="agent-image" src="`+weapon?.image+`" alt="`+weapon?.name+`"><br>
        <span class="agent-name">`+weapon?.name+`</span><br>
        <span class="weapon-type">(`+weapon?.team?.name+`)<span><br><br>
        <span class="weapon-type">$ `+price+`<span><label>
    `;
    card.addEventListener('click', function() {
        if(price){
            console.log("bal", startingBalance, price);
            startingBalance = startingBalance - price;
            balanceAmt.innerHTML = "";
            console.log("bal", startingBalance);
            const balanceLabel = document.createElement("label");
            balanceLabel.innerHTML = `BALANCE: $ ` + startingBalance;
            balanceAmt.append(balanceLabel);
        }
    });
    return card;
}

let selectedWeapons = [];
let nextBtn = document.getElementById('nextBtn');
nextBtn.addEventListener('click', function() {
    
    selectedWeapons = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => ({
        id: checkbox?.dataset?.id,
        name: checkbox?.id,
        price: checkbox?.defaultValue,
        type: checkbox?.dataset?.type
    }));

    const weaponTypes = ['both', selectedTeam];
    const selectedWeaponTypes = selectedWeapons.map(weapon => weapon.type);
    const isAllTypes = weaponTypes.every(type => selectedWeaponTypes.includes(type));

    console.log("selected weapons", selectedWeapons,isAllTypes);

    let totalPrice = 0;
    for(let item of selectedWeapons){
        totalPrice = Number(totalPrice) + Number(item.price);
    }

    console.log("total price",totalPrice)
    let available = 9000;

    if (isAllTypes && totalPrice<=available) {
        localStorage.setItem('selectedWeapon', JSON.stringify(selectedWeapons));

        const queryParams = new URLSearchParams({
          team: selectedTeam,
        });
        window.location.href = `character-overview.html?${queryParams.toString()}`;
    } else if(totalPrice > available){
        alert("Your Available Cash Balance: $ 9000. Please adjust your selection");
        return;
    } else {        
        alert("Please Select at least one weapon of each type.");
        return;
    }

});