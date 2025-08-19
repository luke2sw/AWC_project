// Recupero degli utenti dal localStorage
const utenti = JSON.parse(localStorage.getItem('utenti'));
const ricettaId = new URLSearchParams(window.location.search).get('id_ricetta');

// Trova l'indice dell'utente loggato
let utenteIndex = utenti.findIndex(user =>
    (user.email === sessionStorage.getItem('email') && user.password === sessionStorage.getItem('password')) ||
    (user.username === sessionStorage.getItem('username') && user.password === sessionStorage.getItem('password'))
);

// Se l'utente non esiste, mostra un errore o reindirizza alla pagina di registrazione
if (utenteIndex === -1) {
    console.log("Utente non trovato, reindirizzare alla registrazione perché non ha fatto login.");
} else {
    const userId = utenti[utenteIndex].username; // ID dell'utente loggato
    const ricettaId = new URLSearchParams(window.location.search).get('id_ricetta');  // ID della ricetta corrente
    // Imposta le valutazioni dell'utente al caricamento della pagina
    impostaValutazioniUtente(userId, ricettaId);

    // Event listener per la valutazione del gusto
    document.querySelectorAll('input[name="ratingTaste"]').forEach(star => {
        star.addEventListener('click', function (event) {
            const rating = event.target.value;
            console.log("Hai cliccato la stella con valore: ", rating);
            salvaValutazione(userId, ricettaId, 'gusto', rating);
        });
    });

    // Event listener per la valutazione della difficoltà
    document.querySelectorAll('input[name="ratingDifficulty"]').forEach(star => {
        star.addEventListener('click', function (event) {
            const rating = event.target.value;
            console.log("Hai cliccato la stella con valore: ", rating);
            salvaValutazione(userId, ricettaId, 'difficolta', rating);
        });
    });

    // Event listener per il form di feedback
    document
        .getElementById("feedbackForm")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Evita il ricaricamento della pagina
            var comment = document.getElementById("comment").value;
            console.log("Comment: ", comment);
            if (comment != "" && comment != null) {
                salvaCommento(ricettaId, comment);

            } else {
                console.log('Input vuoto');
            }
        });

    // Event listener per il pulsante "Cancella" del form di feedback
    document.getElementById("feedbackForm_trash")
        .addEventListener("click", function (event) {
            event.preventDefault(); // Evita il ricaricamento della pagina
            rimuoviCommento(ricettaId);
            console.log("Recensione rimossa");
        });

    // Event listener per il form della nota personale
    document
        .getElementById("Nota_personale")
        .addEventListener("submit", function (event) {
            event.preventDefault(); // Evita il ricaricamento della pagina
            var personal_note = document.getElementById("personal_note").value;
            console.log("Personal_note: ", personal_note);
            if (personal_note != "" && personal_note != null) {
                salvaPersonal_note(ricettaId, personal_note);
            } else {
                rimuoviPersonal_note(ricettaId);
                console.log('Input vuoto');
            }
        });

    // Event listener per il pulsante "Cancella" del form della nota personale
    document.getElementById("personal_note_trash")
        .addEventListener("click", function (event) {
            event.preventDefault(); // Evita il ricaricamento della pagina
            rimuoviPersonal_note(ricettaId);
            console.log("Nota personale rimossa");
        });

    // Aggiungi il gestore di eventi al pulsante "Azzera"
    document.getElementById('btnAzzera').addEventListener('click', function () {
        rimuoviratingTaste(ricettaId);
        rimuoviratingDifficolta(ricettaId);
    });


}

// Funzione per salvare le valutazioni in localStorage
function salvaValutazione(userId, ricettaId, tipoValutazione, punteggio) {

    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della recensione per la ricetta specifica
    let recensioneIndex = utente.recensioni.findIndex(r => r.id_ricetta === ricettaId);

    // Se la recensione non esiste, creane una nuova
    if (recensioneIndex === -1) {
        recensioneIndex = utente.recensioni.length; // Indice della nuova recensione
        utente.recensioni.push({
            id_ricetta: ricettaId,
            data_creazione: null,
            valutazione_gusto: {
                punteggio: null,
                ultima_modifica: null
            },
            valutazione_difficolta: {
                punteggio: null,
                ultima_modifica: null
            },
            testo_recensione: {
                testo: '',
                ultima_modifica: null
            }
        });
    }

    // Aggiorna la valutazione appropriata
    let recensione = utente.recensioni[recensioneIndex];

    // Salva valutazione gusto
    if (tipoValutazione === 'gusto') {
        recensione.valutazione_gusto.punteggio = punteggio;
        recensione.valutazione_gusto.ultima_modifica = new Date().toISOString();
    //salva valutazione difficolta
    } else if (tipoValutazione === 'difficolta') {
        recensione.valutazione_difficolta.punteggio = punteggio;
        recensione.valutazione_difficolta.ultima_modifica = new Date().toISOString();
    }

    // Salva nuovamente i dati utente in localStorage
    localStorage.setItem('utenti', JSON.stringify(utenti));
}

// Funzione per caricare la valutazione
function caricaValutazione(userId, ricettaId, tipoValutazione) {
    let utenti = JSON.parse(localStorage.getItem('utenti')) || [];

    let utente = utenti.find(user => user.username === userId);
    if (!utente) return null;

    let recensione = utente.recensioni.find(r => r.id_ricetta === ricettaId);
    if (!recensione) return null;

    if (tipoValutazione === 'gusto') {
        return recensione.valutazione_gusto.punteggio;
    } else if (tipoValutazione === 'difficolta') {
        return recensione.valutazione_difficolta.punteggio;
    } else if (tipoValutazione === 'commento') {
        return recensione.testo_recensione.testo;
    } else if (tipoValutazione === 'data_creazione') {
        return recensione.data_creazione;
    }
    return null;
}

// Funzione per caricare la nota personale
function caricaNotaPersonale(userId, ricettaId) {
    let utenti = JSON.parse(localStorage.getItem('utenti')) || [];

    let utente = utenti.find(user => user.username === userId);
    if (!utente) return null;

    // Trova l'indice della nota personale per la ricetta specifica
    let personal_note = utente.note_personali.find(r => r.id_ricetta === ricettaId);
    if (!personal_note) return null;
    return personal_note.testo_nota_personale.testo;
}

// Funzione per salvare il commento
function salvaCommento(ricettaId, comment) {
    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della recensione per la ricetta specifica
    let recensioneIndex = utente.recensioni.findIndex(r => r.id_ricetta === ricettaId);

    // Se la recensione non esiste, creane una nuova
    if (recensioneIndex === -1) {
        recensioneIndex = utente.recensioni.length; // Indice della nuova recensione
        utente.recensioni.push({
            id_ricetta: ricettaId,
            data_creazione: null,
            valutazione_gusto: {
                punteggio: null,
                ultima_modifica: null
            },
            valutazione_difficolta: {
                punteggio: null,
                ultima_modifica: null
            },
            testo_recensione: {
                testo: '',
                ultima_modifica: null
            }
        });
    }

    // Aggiorna la valutazione appropriata
    let recensione = utente.recensioni[recensioneIndex];

    recensione.testo_recensione.testo = comment;
    recensione.testo_recensione.ultima_modifica = new Date().toISOString();

    // Salva nuovamente i dati utente in localStorage
    localStorage.setItem('utenti', JSON.stringify(utenti));
    location.reload();
}

// Funzione per rimuovere il commento
function rimuoviCommento(ricettaId) {
    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della nota personale per la ricetta specifica
    let recensioneIndex = utente.recensioni.findIndex(r => r.id_ricetta === ricettaId);

    //utente.recensioni.testo_recensione.splice(recensioneIndex, 1);
    utente.recensioni[recensioneIndex].testo_recensione.testo = '';
    if (utente.recensioni[recensioneIndex].valutazione_gusto.punteggio === null &&
        utente.recensioni[recensioneIndex].valutazione_difficolta.punteggio === null &&
        utente.recensioni[recensioneIndex].testo_recensione.testo === '') {

        // Rimuovi la recensione
        utente.recensioni.splice(recensioneIndex, 1);
        console.log('Recensione rimossa');
    }
    console.log('rimosso');
    localStorage.setItem('utenti', JSON.stringify(utenti));
    location.reload();
}


// Funzione per rimuovere la nota personale
function rimuoviPersonal_note(ricettaId) {
    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della nota personale per la ricetta specifica
    let personal_note_Index = utente.note_personali.findIndex(r => r.id_ricetta === ricettaId);

    utente.note_personali.splice(personal_note_Index, 1);

    console.log('rimosso');
    localStorage.setItem('utenti', JSON.stringify(utenti));
    location.reload();
}

// Funzione per salvare la nota personale
function salvaPersonal_note(ricettaId, comment) {
    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della nota personale per la ricetta specifica
    let personal_note_Index = utente.note_personali.findIndex(r => r.id_ricetta === ricettaId);

    // Se la nota personale non esiste, creane una nuova
    if (personal_note_Index === -1) {
        personal_note_Index = utente.note_personali.length; // Indice della nuova recensione
        utente.note_personali.push({
            id_ricetta: ricettaId,
            testo_nota_personale: {
                testo: '',
                ultima_modifica: null
            }
        });
    }

    // Aggiorna la valutazione appropriata
    let personal_note = utente.note_personali[personal_note_Index];

    personal_note.testo_nota_personale.testo = comment;
    personal_note.testo_nota_personale.ultima_modifica = new Date().toISOString();

    // Salva nuovamente i dati utente in localStorage
    localStorage.setItem('utenti', JSON.stringify(utenti));
    location.reload();
}


// Funzione per recuperare le valutazioni al login o al caricamento della pagina
function impostaValutazioniUtente(userId, ricettaId) {
    const gustoRating = caricaValutazione(userId, ricettaId, 'gusto');
    const difficoltaRating = caricaValutazione(userId, ricettaId, 'difficolta');
    const commento = caricaValutazione(userId, ricettaId, 'commento');
    const personal_note = caricaNotaPersonale(userId, ricettaId);
    const data_creazione = caricaValutazione(userId, ricettaId, 'data_creazione');

    if (gustoRating !== null) {
        document.querySelector(`input[name="ratingTaste"][value="${gustoRating}"]`).checked = true;
    }

    if (difficoltaRating !== null) {
        document.querySelector(`input[name="ratingDifficulty"][value="${difficoltaRating}"]`).checked = true;
    }

    if (commento !== null) {
        // Nel caso della textarea, non devo cercare un elemento con un valore specifico (come si fa per gli input radio), 
        //ma piuttosto devo impostare il contenuto della textarea direttamente.
        document.querySelector('textarea[name="comment"]').value = commento;
    }

    if (personal_note !== null) {
        document.querySelector('textarea[name="personal_note"]').value = personal_note;
    }

    if (data_creazione !== null) {
        document.querySelector('input[name="dateStandard"]').value = data_creazione;
    }
}


function showRecensione() {

}


// Funzione per rimuovere le valutazioni di gusto
function rimuoviratingTaste(ricettaId) {
    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della nota personale per la ricetta specifica
    let recensioneIndex = utente.recensioni.findIndex(r => r.id_ricetta === ricettaId);


    utente.recensioni[recensioneIndex].valutazione_gusto.punteggio = null;
    if (utente.recensioni[recensioneIndex].valutazione_gusto.punteggio === null &&
        utente.recensioni[recensioneIndex].valutazione_difficolta.punteggio === null &&
        utente.recensioni[recensioneIndex].testo_recensione.testo === '') {

        // Rimuovi la recensione
        utente.recensioni.splice(recensioneIndex, 1);
        console.log('Recensione rimossa');
    }
    console.log('rimosso');
    localStorage.setItem('utenti', JSON.stringify(utenti));
    location.reload();

}

// Funzione per rimuovere le valutazioni di difficoltà
function rimuoviratingDifficolta(ricettaId) {

    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della nota personale per la ricetta specifica
    let recensioneIndex = utente.recensioni.findIndex(r => r.id_ricetta === ricettaId);


    utente.recensioni[recensioneIndex].valutazione_difficolta.punteggio = null;
    if (utente.recensioni[recensioneIndex].valutazione_gusto.punteggio === null &&
        utente.recensioni[recensioneIndex].valutazione_difficolta.punteggio === null &&
        utente.recensioni[recensioneIndex].testo_recensione.testo === '') {

        // Rimuovi la recensione
        utente.recensioni.splice(recensioneIndex, 1);
        console.log('Recensione rimossa');
    }
    console.log('rimosso');
    localStorage.setItem('utenti', JSON.stringify(utenti));
    location.reload();

}

// Funzione per controllare se la recensione è vuota
function check_if_empty(ricettaId) {
    // Trova l'utente attuale
    let utente = utenti[utenteIndex];

    // Trova l'indice della recensione per la ricetta specifica
    let recensioneIndex = utente.recensioni.findIndex(r => r.id_ricetta === ricettaId);

    // Verifica se la recensione esiste
    if (recensioneIndex !== -1) {
        let recensione = utente.recensioni[recensioneIndex];

        // Controlla se la recensione è vuota
        if (recensione.valutazione_gusto.punteggio === null &&
            recensione.valutazione_difficolta.punteggio === null &&
            recensione.testo_recensione.testo === '') {

            // Rimuovi la recensione
            utente.recensioni.splice(recensioneIndex, 1);
            console.log('Recensione rimossa');
        }

        // Salva nuovamente i dati utente in localStorage
        localStorage.setItem('utenti', JSON.stringify(utenti));
    } else {
        console.log('Recensione non trovata');
    }
}



document.addEventListener('DOMContentLoaded', check_if_empty(ricettaId));
