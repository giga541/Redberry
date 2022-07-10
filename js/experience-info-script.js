const REDBERRY_URL = "https://chess-tournament-api.devtest.ge";

const radioButtons = document.getElementsByName('radio-group');
const form = document.querySelector('.form');
const backBtn = document.querySelector('.back-btn');

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  

let experienceInfoFormData = {
    experience_level: null,
    already_participated: null,
    character_id: null
}

const experienceInfoLocalStorage = localStorage.getItem('experienceInfoFormData');

if (experienceInfoLocalStorage) {
    experienceInfoFormData = JSON.parse(experienceInfoLocalStorage);
}

if (experienceInfoFormData["already_participated"] != null) {
    if (experienceInfoFormData["already_participated"]) {
        radioButtons[0].checked = true
    } else {
        radioButtons[1].checked = true
    }
}

radioButtons[0].addEventListener('click', () => {
    experienceInfoFormData["already_participated"] = true;
    localStorage.setItem('experienceInfoFormData', JSON.stringify(experienceInfoFormData));
})

radioButtons[1].addEventListener('click', () => {
    experienceInfoFormData["already_participated"] = false;
    localStorage.setItem('experienceInfoFormData', JSON.stringify(experienceInfoFormData));
})


// Add listeners for level select
const levelOptionMenu = document.querySelector(".select-menu.level"),
        levelSelectBtn = levelOptionMenu.querySelector(".select-btn"),
        options = levelOptionMenu.querySelectorAll(".option"),
        levelSBtn_text = levelOptionMenu.querySelector(".sBtn-text"),
        levelArrow = levelOptionMenu.querySelector(".arrow-icon");

levelSelectBtn.addEventListener("click", () => {
    levelOptionMenu.classList.toggle("active")
    levelArrow.classList.toggle("up")
}); 

// We can already add listeners for options
options.forEach(option =>{
    if (experienceInfoFormData['experience_level']) {
        levelSBtn_text.innerText = capitalizeFirstLetter(experienceInfoFormData['experience_level']);
    }
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        levelSBtn_text.innerText = selectedOption;

        levelOptionMenu.classList.remove("active");
        levelArrow.classList.remove("up")

        experienceInfoFormData['experience_level'] = selectedOption.toLowerCase();
        localStorage.setItem('experienceInfoFormData', JSON.stringify(experienceInfoFormData));
    });
});

// Add listeners for character select
const characterOptionMenu = document.querySelector(".select-menu.character");
        const characterOptionsList = characterOptionMenu.querySelector(".options"),
        characterSelectBtn = characterOptionMenu.querySelector(".select-btn"),
        characterSBtn_text = characterOptionMenu.querySelector(".sBtn-text"),
        characterArrow = characterOptionMenu.querySelector(".arrow-icon");

        characterSelectBtn.addEventListener("click", () => {
            characterOptionMenu.classList.toggle("active")
            characterArrow.classList.toggle("up")
        }); 


// We need to fetch API data before adding events
fetch(`${REDBERRY_URL}/api/grandmasters`)
    .then(response => response.json())
    .then(data => {

        data.forEach((d) => {
            const optionListItem = document.createElement('li');
            optionListItem.classList.add('option');
            optionListItem.innerHTML = `<span class="option-text">${d.name}</span>`;
            optionListItem.innerHTML += `<img class="character-img" src="${REDBERRY_URL}${d.image}" />`;

            if (experienceInfoFormData['character_id'] && experienceInfoFormData['character_id'] === d.id) {
                characterSBtn_text.innerText = d.name;
            }

            optionListItem.addEventListener("click", ()=> {
                let selectedOption = optionListItem.querySelector(".option-text").innerText;
                characterSBtn_text.innerText = selectedOption;
    
                characterOptionMenu.classList.remove("active");
                characterArrow.classList.remove("up")

                experienceInfoFormData['character_id'] = d.id;
                localStorage.setItem('experienceInfoFormData', JSON.stringify(experienceInfoFormData));
            })

            characterOptionsList.appendChild(optionListItem)
        })

    });


form.onsubmit = (e) => {

    e.preventDefault();
    let valid = true
    
    if (experienceInfoFormData.experience_level == null) {
        valid = false
        
    }
    if (experienceInfoFormData.character_id == null) {
        valid = false
       
    }
    if (experienceInfoFormData.already_participated == null) {
        valid = false
        
    }

    if (valid) {
        const requestBody = {
            ...experienceInfoFormData,
            ...JSON.parse(localStorage.getItem('personalInfoFormData'))
        }
        fetch(`${REDBERRY_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          }).then(response => {
                console.log(response)
                // Clear the local storage
                localStorage.clear()
                location.href = './onboarding-completed.html'
          })
      
    } 
}

backBtn.addEventListener('click', (e) => {
    location.href = './registration-personal.html'
})




