console.log('character overview');

const BASE_URL = 'https://bymykel.github.io/CSGO-API/api/en';

const WEAPON_URL = BASE_URL + '/skins.json';
const AGENTS_URL = BASE_URL + '/agents.json';

const queryParams = new URLSearchParams(window.location.search);
let selectedTeam = queryParams.get("team");
console.log("Selected team:", selectedTeam);

let agentId = JSON.parse(localStorage.getItem('agent-id'));
let weaponsList = JSON.parse(localStorage.getItem('selectedWeapon'));
let choosenName = JSON.parse(localStorage.getItem('choosenName'));

console.log("agent id", agentId);
console.log("weapons list",weaponsList);
console.log("choosen name", choosenName);

// const agentSpan = document.getElementById('agentSpan');
// agentSpan.innerHTML = String(choosenName).toUpperCase();

let agentDetails;
let weaponDetailsList=[];

let backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', function() {
    const queryParams = new URLSearchParams({
        team: selectedTeam
    });
    window.location.href = `weapon-select.html?${queryParams.toString()}`;
});

fetch(WEAPON_URL)
  .then((response) => response.json())
  .then((data) => {
    // console.log("weapon data",data);
    // weaponDetailsList = data.filter(item => weaponsList.find(element => element.id == item.id));

    weaponDetailsList = filter(data, weaponsList);

    function filter(list1, list2) {
        return list1.map(item1 => {
            const matchingItem = list2.find(item2 => item2.id === item1.id);
            if (matchingItem) {
                return { ...item1, price: matchingItem.price };
            }
        }).filter(Boolean);
    }

    console.log("filtered list", weaponDetailsList);
    
    fetch(AGENTS_URL)
      .then((response) => response.json())
      .then((data) => {
        // console.log("agent data",data);
        if (agentId) {
          agentDetails = data.find((element) => element.id == agentId);

          if(agentDetails && weaponDetailsList){
            displayAgentOverview(weaponDetailsList,agentDetails);
          }
        }
        
      })
      .catch((error) => console.error("Error fetching data:", error));
    
  }).catch((error) => console.error("Error fetching data:", error));


  

  function displayAgentOverview(weaponDetailsList,agentDetails) {
    console.log("weaponDetailsList",weaponDetailsList);
    console.log("agentDetails", agentDetails);
    const grid = document.getElementById('grid');
    const div = document.createElement('div');
    div.innerHTML = `
        <img class="agent-main-image" src="`+agentDetails?.image+`" alt="`+agentDetails?.name+`"><br>
        <h2 class="agent-h2">`+String(choosenName).toUpperCase()+`</h2><br>
    `;
    grid.appendChild(div);

    for(let item of weaponDetailsList){
        const card = document.createElement('div');
        card.classList.add('weapon-card');
        card.innerHTML = `
        <br><img class="agent-image" src="`+item?.image+`" alt="`+item?.name+`"><br>
        <span class="agent-name">`+item?.name+`</span><br>
        `;
        grid.appendChild(card);
    }

    
    }

let nextBtn = document.getElementById('nextBtn');
const teamInput = document.getElementById('teamName');
nextBtn.addEventListener('click', function() {
  const teamName = teamInput.value.trim();

  const teamNameRegex = /^[a-zA-Z]+$/;
  if (!teamNameRegex.test(teamName)) {
    alert("Please Enter a Valid Team Name (only alphabetical characters).");
    return;
  } else{
    localStorage.setItem('teamName', JSON.stringify(teamName));
    localStorage.setItem('agentDetails', JSON.stringify(agentDetails));
    localStorage.setItem('weaponDetailsList', JSON.stringify(weaponDetailsList));
    const queryParams = new URLSearchParams({
        team: selectedTeam,
    });
    window.location.href = `team-overview.html?${queryParams.toString()}`;
  }
  
});