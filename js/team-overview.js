console.log('character overview');

const BASE_URL = 'https://bymykel.github.io/CSGO-API/api/en';
const RANDON_USERS_URL = 'https://randomuser.me/';
const AGENTS_URL = BASE_URL + '/agents.json';

const GENERATE_3_USERS = RANDON_USERS_URL + '/api?results=3';
const WEAPON_URL = BASE_URL + '/skins.json';

const queryParams = new URLSearchParams(window.location.search);
let selectedTeam = queryParams.get("team");
console.log("Selected team:", selectedTeam);

let teamName = JSON.parse(localStorage.getItem('teamName'));
let agentDetails = JSON.parse(localStorage.getItem('agentDetails'));
let weaponDetailsList = JSON.parse(localStorage.getItem('weaponDetailsList'));
let choosenName = JSON.parse(localStorage.getItem('choosenName'));

console.log("teamName", teamName);
console.log("weaponDetailsList list",weaponDetailsList);
console.log("agentDetails", agentDetails);

const agentSpan = document.getElementById('teamSpan');
agentSpan.innerHTML = String(teamName).toUpperCase();

let backBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', function() {
    const queryParams = new URLSearchParams({
        team: selectedTeam
    });
    window.location.href = `character-overview.html?${queryParams.toString()}`;
});

let agentsList= [];
fetch(AGENTS_URL)
  .then((response) => response.json())
  .then((data) => {
    console.log("agents data",data);
    agentsList = data;
    
  }).catch((error) => console.error("Error fetching data:", error));


fetch(GENERATE_3_USERS)
  .then((response) => response.json())
  .then((data) => {
    const teamMembers = data.results.map((result) => ({
      name: `${result.name.first} ${result.name.last}`,
      weapons: [],
      totalBalance: 0,
      character:{}
    }));
      

    
    fetch(WEAPON_URL)
      .then((response) => response.json())
      .then((weaponsData) => {
        const availableWeapons = weaponsData.filter((weapon) =>
            weapon?.team?.id == "both"
        );

        // console.log("available weapons", availableWeapons)

        for(let weapon of availableWeapons){
            // if(weapon?.team?.id == selectedTeam || weapon?.team?.id == "both"){
                // let price;
                if(weapon?.category?.name == 'Pistols'){
                    weapon.price = 500;
                } else if(weapon?.category?.name == 'SMGs'){
                    weapon.price = 1200;
                } else if(weapon?.category?.name == 'Rifles'){
                    weapon.price = 2000;
                } else if(weapon?.category?.name == 'Heavy'){
                    weapon.price = 3000;
                } else if(weapon?.category?.name == 'Knives'){
                    weapon.price = 300;
                } else if(weapon?.category?.name == 'Gloves'){
                    weapon.price = 200;
                }
            // }
        }

        console.log("available wepon with price", availableWeapons[0]);
        console.log('team members 1',teamMembers);
        

        for(let member of teamMembers){
            while(member.totalBalance <9000){
                let index = Math.floor(Math.random() * availableWeapons.length);
                let randomWeapon = availableWeapons[index];
                member.weapons.push(randomWeapon);
                member.totalBalance = member.totalBalance + randomWeapon.price;
            }

            let index = Math.floor(Math.random() * agentsList.length);
            member.character = agentsList[index];
        }

        console.log('team members 2',teamMembers);
        let obj = {
            name: choosenName,
            weapons: weaponDetailsList,
            totalBalance:0,
            character:agentDetails
        }
        teamMembers.push(obj);
        console.log('team members 3',teamMembers);



        for (let member of teamMembers) {
            const grid = document.getElementById('grid');
            const teamMemberContainer = document.createElement('div');
            teamMemberContainer.classList.add('team-member-container');
            const characterImage = document.createElement('img');
            characterImage.classList.add('team-main-image');
            characterImage.src = member.character.image;
            characterImage.alt = member.character.name;
        
            const characterName = document.createElement('h2');
            characterName.classList.add('team-h2');
            characterName.textContent = member.name.toUpperCase();
        
            
            teamMemberContainer.appendChild(characterImage);
            teamMemberContainer.appendChild(characterName);
        
            
            for (let item of member.weapons) {
                
                const weaponCard = document.createElement('div');
                weaponCard.classList.add('team-weapon-card');
        
                
                const weaponImage = document.createElement('img');
                weaponImage.classList.add('agent-image');
                weaponImage.src = item.image;
                weaponImage.alt = item.name;
        
                const weaponName = document.createElement('span');
                weaponName.classList.add('agent-name');
                weaponName.textContent = item.name;
        
                
                weaponCard.appendChild(weaponImage);
                weaponCard.appendChild(weaponName);
        
                
                teamMemberContainer.appendChild(weaponCard);
            }        
            
            grid.appendChild(teamMemberContainer);
        }
        
      }).catch((error) => console.error("Error fetching weapons:", error));
  })
  .catch((error) => console.error("Error fetching team member names:", error));