console.log("team page");

let startBtn = document.getElementById('backBtn');
backBtn.addEventListener('click', function() {
    window.location.href = 'start.html';
});

function selectTeam(team){
    let selectedTeam;
    if(team === "auto-select") {
        const randomIndex = Math.floor(Math.random() * 2);
        selectedTeam = randomIndex === 0 ? "terrorists" : "counter-terrorists";
    } else{
        selectedTeam = team;
    }

    const queryParams = new URLSearchParams({
        team: selectedTeam
    });

    window.location.href = `character-select.html?${queryParams.toString()}`;
}
