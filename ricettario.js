// Funzione per visualizzare le ricette preferite dell'utente
function showRicettario() {
    const utenti = JSON.parse(localStorage.getItem('utenti'));
    let utenteIndex = utenti.findIndex(user =>
        (user.email === sessionStorage.getItem('email') && user.password === sessionStorage.getItem('password')) ||
        (user.username === sessionStorage.getItem('username') && user.password === sessionStorage.getItem('password'))
    );
    
    let utente = utenti[utenteIndex];

    const ricettario = document.getElementById('ricettario');

    // Verifica se l'utente ha ricette preferite
    if (!utente.ricettario || utente.ricettario.length === 0) {
        ricettario.innerHTML = '<p>Nessuna ricetta preferita</p>';
        return;
    }

    // Ordina le ricette in base alla data di aggiunta, dalla più recente alla meno recente
    utente.ricettario.sort((a, b) => new Date(b.dataAggiunta) - new Date(a.dataAggiunta));


    let fetchPromises = utente.ricettario.map(ricetta => {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${ricetta.id_ricetta}`;

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.meals) {
                    const meal = data.meals[0];
                    const isLiked = checkIfRecipeIsLiked(utente, ricetta.id_ricetta);

                    // Crea il contenuto HTML per questa ricetta
                    return `
                        <div class="col-md-3">
                            <div class="card">
                                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                <div class="card-body">
                                    <h5 class="card-title">${meal.strMeal}</h5>
                                    <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
                                    <a href="piatto.html?id_ricetta=${meal.idMeal}" class="btn btn-primary scopri-piu">Scopri di più</a>
                                </div>

                                <!-PULSANTE LIKE--->
                                <div class="class_heart_button">
                                    <input type="checkbox" class="checkbox" id="checkbox_${meal.idMeal}" name="liked_button" ${isLiked ? 'checked' : ''}/>
                                    <label for="checkbox_${meal.idMeal}" class="heart_button">
                                        <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg" name="liked">
                                            <!-- SVG content here -->
                                            <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                                                <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" />
                                                <!-- Additional SVG elements for the animated heart -->
                                                <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5"
                                                            cy="29.5" r="1.5" />
                                                        <g id="heartgroup7" opacity="0" transform="translate(7 6)">
                                                            <circle id="heart1" fill="#9CD8C3" cx="2" cy="6" r="2" />
                                                            <circle id="heart2" fill="#8CE8C3" cx="5" cy="2" r="2" />
                                                        </g>
                                                        <g id="heartgroup6" opacity="0" transform="translate(0 28)">
                                                            <circle id="heart1" fill="#CC8EF5" cx="2" cy="7" r="2" />
                                                            <circle id="heart2" fill="#91D2FA" cx="3" cy="2" r="2" />
                                                        </g>
                                                        <g id="heartgroup3" opacity="0" transform="translate(52 28)">
                                                            <circle id="heart2" fill="#9CD8C3" cx="2" cy="7" r="2" />
                                                            <circle id="heart1" fill="#8CE8C3" cx="4" cy="2" r="2" />
                                                        </g>
                                                        <g id="heartgroup2" opacity="0" transform="translate(44 6)">
                                                            <circle id="heart2" fill="#CC8EF5" cx="5" cy="6" r="2" />
                                                            <circle id="heart1" fill="#CC8EF5" cx="2" cy="2" r="2" />
                                                        </g>
                                                        <g id="heartgroup5" opacity="0" transform="translate(14 50)">
                                                            <circle id="heart1" fill="#91D2FA" cx="6" cy="5" r="2" />
                                                            <circle id="heart2" fill="#91D2FA" cx="2" cy="2" r="2" />
                                                        </g>
                                                        <g id="heartgroup4" opacity="0" transform="translate(35 50)">
                                                            <circle id="heart1" fill="#F48EA7" cx="6" cy="5" r="2" />
                                                            <circle id="heart2" fill="#F48EA7" cx="2" cy="2" r="2" />
                                                        </g>
                                                        <g id="heartgroup1" opacity="0" transform="translate(24)">
                                                            <circle id="heart1" fill="#9FC7FA" cx="2.5" cy="3" r="2" />
                                                            <circle id="heart2" fill="#9FC7FA" cx="7.5" cy="2" r="2" />
                                                        </g>
                                            </g>
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    return '';
                }
            })
            .catch(error => {
                console.error('Error fetching meal:', error);
                return '';
            });
    });

    //peremtte di strutturare le ricette in righe di 4 elementi
    Promise.all(fetchPromises).then(contents => {
        let rowContent = '';
        let rows = '';

        for (let i = 0; i < contents.length; i++) {
            rowContent += contents[i];
            if ((i + 1) % 4 === 0) {
                rows += `<div class="row">${rowContent}</div>`;
                rowContent = '';
            }
        }

        if (rowContent) {
            rows += `<div class="row">${rowContent}</div>`;
        }

        ricettario.innerHTML = rows;

        
        // Aggiungi gli event listener per tutti i checkbox creati dinamicamente
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function (event) {

                const checkboxId = event.target.id.split('_')[1];
                handleHeartClick(checkboxId, event.target.checked, utenti, utenteIndex);
            });
        });
        
    });
}

//funzione per gestire il click sul cuore
function handleHeartClick(id, isLiked, utenti, utenteIndex) {
    let utente = utenti[utenteIndex];

    if (utente) {
        let ricettarioIndex = utente.ricettario.findIndex(r => r.id_ricetta === id);

        if (isLiked) {
            if (ricettarioIndex === -1) {
                utente.ricettario.push({
                    id_ricetta: id,
                    dataAggiunta: new Date().toISOString()
                });
            }
        } else {
            if (ricettarioIndex !== -1) {
                utente.ricettario.splice(ricettarioIndex, 1);
            }
        }

        localStorage.setItem('utenti', JSON.stringify(utenti));
        console.log(`Ricetta ${id} aggiornata nel ricettario di ${utente.username}.`);
    }
}

//funzione per controllare se la ricetta è stata messa nel ricettario
function checkIfRecipeIsLiked(utente, id) {
    return utente.ricettario.some(r => r.id_ricetta === id);
}

document.addEventListener('DOMContentLoaded', showRicettario);


