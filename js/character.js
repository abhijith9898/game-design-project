console.log('character select');

const BASE_URL = 'https://bymykel.github.io/CSGO-API/api/en';

const AGENTS_URL = BASE_URL + '/agents.json';

const queryParams = new URLSearchParams(window.location.search);
let selectedTeam = queryParams.get("team");
console.log("Selected team:", selectedTeam);

const teamSpan = document.getElementById('team-span');
teamSpan.innerHTML = selectedTeam == "terrorists"? "TERRORISTS":"COUNTER TERRORISTS";

let startBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', function() {
    window.location.href = 'team-select.html';
});

const agentNameInput = document.getElementById('agent-name');

function createAgentCard(agent) {
    const card = document.createElement('div');
    card.classList.add('agent-card');
    card.innerHTML = `
        <img class="agent-image" src="`+agent?.image+`" alt="`+agent?.name+`">
        <p class="agent-name">`+agent?.name+`</p>
    `;
    card.addEventListener('click', function() {
        const agentName = agentNameInput.value.trim();
        if(!agentName){
            alert("Choose a Name");
        } else if(agentName === "" || agentName.split(" ").length > 2 || agentName.length > 20){
            alert("Please Enter a Valid Name (up to 2 words, maximum 20 characters)")
        } else{
            localStorage.setItem('team', JSON.stringify(selectedTeam));
            localStorage.setItem('agent', JSON.stringify(agent?.name));
            localStorage.setItem('agent-id', JSON.stringify(agent?.id));
            localStorage.setItem('choosenName', JSON.stringify(agentName));

            const queryParams = new URLSearchParams({
                team: selectedTeam
            });
        
            window.location.href = `weapon-select.html?${queryParams.toString()}`;
        }
    });
    return card;
}


fetch(AGENTS_URL)
  .then((response) => response.json())
  .then((data) => {
    console.log("agents data",data);
    const agentGrid = document.getElementById('agentGrid');
    for(let agent of data){
        if(agent?.team?.id == selectedTeam){
            const agentCard = createAgentCard(agent);
            agentGrid.appendChild(agentCard);
        }
    }
  }).catch((error) => console.error("Error fetching data:", error));