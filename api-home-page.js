
// Inizializza la funzione al caricamento della pagina
document.addEventListener('DOMContentLoaded', function () {

    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

    const utenti = JSON.parse(localStorage.getItem('utenti'));
    
    // Trova l'indice dell'utente nell'array 'utenti' in base ai valori di memorizzazione della sessione forniti.
    let utenteIndex = utenti.findIndex(user =>
        (user.email === sessionStorage.getItem('email') && user.password === sessionStorage.getItem('password')) ||
        (user.username === sessionStorage.getItem('username') && user.password === sessionStorage.getItem('password'))
    );
    let utente = utenti[utenteIndex];

    const numSlides = 3; // Numero di slide che vuoi avere (2 o 3)
    const itemsPerSlide = 4; // Numero di piatti per slide
    const numCardsRicercati = 16; // Numero di "Piatti ricercati" visualizzati nella home page

    /*
    Ritorna un array di piatti random senza duplicati.  
    meals: L'array di pasti da selezionare.
    count: Il numero di pasti da selezionare.
    usedMeals: L'array degli ID dei pasti utilizzati per evitare duplicati.
    */
    function getRandomMealsWithoutDuplicates(meals, count, usedMeals) {
        let selectedMeals = [];
        while (selectedMeals.length < count) {
            let randomMeal = meals[Math.floor(Math.random() * meals.length)];
            if (!usedMeals.includes(randomMeal.idMeal)) {
                selectedMeals.push(randomMeal);
                usedMeals.push(randomMeal.idMeal);
            }
        }
        return selectedMeals;
    }

    /*
    Gestisce l'evento click su un'icona a forma di cuore.
     
    id: L'ID della ricetta.
    isLiked: Indica se la ricetta è stata aggiunta ai preferiti.
    utenti: L'array di utenti.
    utenteIndex: L'indice dell'utente che ha effettuato l'accesso.
     */
    function handleHeartClick(id, isLiked, utenti, utenteIndex) {
        let utente = utenti[utenteIndex];
        if (utente) {
            if (!utente.ricettario) {
                utente.ricettario = [];
            }
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

    function checkIfRecipeIsLiked(utente, id) {
        if (!utente || !utente.ricettario) {
            return false;
        }
        return utente.ricettario.some(r => r.id_ricetta === id);
    }




    //Recuperare i dati dall'URL specificato e convertire la risposta in formato JSON
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const carouselContentPiattoGiorno = document.getElementById('carouselContent-PiattiGiorno');
            const carouselContentUltimeNovità = document.getElementById('carouselContent-UltimeNovità');
            const ContainerPiattiRicercati = document.getElementById('Container-PiattiRicercati');
            const allMeals = data.meals;

            if (allMeals) {
                let usedMealsPiattoGiorno = [];
                let usedMealsUltimeNovità = [];
                let usedMealsRicercati = [];

                /*Aggiungi prefissi per evitare che il pulsante di like vada in conflitto con le ricette e evito che più ricette siano associate allo stesso pulsante */
                const sectionPrefixPiattoGiorno = 'pg_';
                const sectionPrefixUltimeNovità = 'un_';
                const sectionPrefixRicercati = 'r_';
                
                /*Carousel Piatti del Giorno */
                for (let i = 0; i < numSlides; i++) {
                    const randomMeals = getRandomMealsWithoutDuplicates(allMeals, itemsPerSlide, usedMealsPiattoGiorno);
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('carousel-item');
                    if (i === 0) {
                        itemDiv.classList.add('active');
                    }

                    let rowContent = '<div class="container"><div class="row">';
                    randomMeals.forEach(meal => {
                        const isLiked = checkIfRecipeIsLiked(utente, meal.idMeal);
                        const checkboxId = `${sectionPrefixPiattoGiorno}checkbox_${meal.idMeal}`;

                        rowContent += `
                            <div class="col-md-3">
                                <div class="card">
                                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                    <div class="card-body">
                                        <h5 class="card-title">${meal.strMeal}</h5>
                                        <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
                                        <a href="piatto.html?id_ricetta=${meal.idMeal}" class="btn btn-primary scopri-piu">Scopri di più</a>

                                        <!--ICONA BOTTONE LIKE--->
                                        <div class="class_heart_button">
                                            <input type="checkbox" class="checkbox" id="${checkboxId}" name="liked_button" ${isLiked ? 'checked' : ''}/>
                                            <label for="${checkboxId}" class="heart_button">
                                                <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg" name="liked">
                                                    <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                                                        <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" />
                                                        <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" />
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
                            </div>
                        `;
                    });
                    rowContent += '</div></div>';
                    itemDiv.innerHTML = rowContent;
                    carouselContentPiattoGiorno.appendChild(itemDiv);
                }

                /*Carousel Ultime novità */
                for (let i = 0; i < numSlides; i++) {
                    const randomMeals = getRandomMealsWithoutDuplicates(allMeals, itemsPerSlide, usedMealsUltimeNovità);
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('carousel-item');
                    if (i === 0) {
                        itemDiv.classList.add('active');
                    }

                    let rowContent = '<div class="container"><div class="row">';
                    randomMeals.forEach(meal => {
                        const isLiked = checkIfRecipeIsLiked(utente, meal.idMeal);
                        const checkboxId = `${sectionPrefixUltimeNovità}checkbox_${meal.idMeal}`;

                        rowContent += `
                            <div class="col-md-3">
                                <div class="card">
                                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                    <div class="card-body">
                                        <h5 class="card-title">${meal.strMeal}</h5>
                                        <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
                                        <a href="piatto.html?id_ricetta=${meal.idMeal}" class="btn btn-primary scopri-piu">Scopri di più</a>
                                        <div class="class_heart_button">
                                        
                                            <!--ICONA BOTTONE LIKE--->
                                            <input type="checkbox" class="checkbox" id="${checkboxId}" name="liked_button" ${isLiked ? 'checked' : ''}/>
                                            <label for="${checkboxId}" class="heart_button">    
                                                <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg" name="liked">
                                                    <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                                                        <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" />
                                                        <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" />

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
                            </div>
                        `;
                    });
                    rowContent += '</div></div>';
                    itemDiv.innerHTML = rowContent;
                    carouselContentUltimeNovità.appendChild(itemDiv);
                }

                /*Elenco Piatti Ricercati*/
                let rowContent = ''; // Inizializza come stringa vuota
                for (let i = 0; i < numCardsRicercati; i++) {
                    if (i % 4 === 0) { // Ogni 4 piatti
                        if (i !== 0) { // Chiudi la riga precedente, tranne per la prima iterazione
                            rowContent += '</div>';
                        }
                        rowContent += '<div class="row">'; // Inizia una nuova riga
                    }
                    const randomMeals = getRandomMealsWithoutDuplicates(allMeals, 1, usedMealsRicercati);
                    randomMeals.forEach(meal => {
                        const isLiked = checkIfRecipeIsLiked(utente, meal.idMeal);
                        const checkboxId = `${sectionPrefixRicercati}checkbox_${meal.idMeal}`;

                        rowContent += `
                            <div class="col-md-3">
                                <div class="card">
                                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                    <div class="card-body">
                                        <h5 class="card-title">${meal.strMeal}</h5>
                                        <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
                                        <a href="piatto.html?id_ricetta=${meal.idMeal}" class="btn btn-primary scopri-piu">Scopri di più</a>

                                        <!--ICONA BOTTONE LIKE--->
                                        <div class="class_heart_button">
                                            <input type="checkbox" class="checkbox" id="${checkboxId}" name="liked_button" ${isLiked ? 'checked' : ''}/>
                                            <label for="${checkboxId}" class="heart_button">
                                                <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg" name="liked">
                                                    <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                                                        <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" />
                                                        <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" />
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
                            </div>
                        `;
                    });
                }
                rowContent += '</div>'; // Chiudi l'ultimo row
                ContainerPiattiRicercati.innerHTML = rowContent;


                document.addEventListener('change', function (e) {

                    if (e.target && e.target.matches('.checkbox')) {
                        /*
                        Recupera l'id dall'elemento di destinazione e lo divide per '_' per estrarre il valore id desiderato.
                        
                        e: L'evento change.
                        ritorna il valore id estratto.
                         */
                        const id = e.target.id.split('_')[2];
                        const isLiked = e.target.checked;
                        console.log(`Checkbox ID: ${id}, isLiked: ${isLiked}`);
                        handleHeartClick(id, isLiked, utenti, utenteIndex);

                    }


                });

            }
        })
        .catch(error => console.error('Errore nel recupero dei dati:', error));
});