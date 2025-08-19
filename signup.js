
var check = JSON.parse(localStorage.getItem('utenti'));
// Se non esiste alcun utente, crea un array vuoto
if (!check) {
    localStorage.setItem('utenti', JSON.stringify([]));
}

//funzione per registrarsi
function Registrati() {
    const username = document.getElementById("Input-Username").value;
    const email = document.getElementById("Input-Email").value;
    const password = document.getElementById("Input-Password").value;

    // Elementi per mostrare gli errori
    const usernameError = document.getElementById("username-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const registrationMessage = document.getElementById("registration-message");
    const accountError = document.getElementById("account-error");

    // Reset delle segnalazioni di errore e dei bordi
    usernameError.textContent = "";
    usernameError.classList.remove('show');
    emailError.textContent = "";
    emailError.classList.remove('show');
    passwordError.textContent = "";
    passwordError.classList.remove('show');
    accountError.style.display = "none"; // Nascondi l'errore account esistente
    registrationMessage.style.display = "none"; // Nascondi eventuali messaggi di successo
    document.getElementById("Input-Username").style.borderColor = "";
    document.getElementById("Input-Email").style.borderColor = "";
    document.getElementById("Input-Password").style.borderColor = "";
    resetPasswordRequirements();

    let isValid = true;

    // Recupero degli utenti dal localStorage
    let utenti = JSON.parse(localStorage.getItem('utenti')) || [];

    // Controllo se l'username è stato inserito
    if (username == "") {
        document.getElementById("Input-Username").style.borderColor = "red";
        usernameError.textContent = "Inserisci l'username";
        usernameError.style.display = "block";
        isValid = false;
        console.log("username non inserito");
        return;
    // Controllo se l'username contiene almeno una lettera
    } else if (!validateUsername_char(username)) {
        document.getElementById("Input-Username").style.borderColor = "red";
        usernameError.textContent = "Username non valida, inserisci almeno una lettera come carattere";
        usernameError.style.display = "block";
        isValid = false;
        console.log("nessuna lettera come carattere");
        return;
    // Controllo se l'username è già stato usato per creare un account
    } else if (utenti.some(utente => utente.username === username)) {
        accountError.textContent = "Questo username è già stato usato per creare un account";
        accountError.style.display = "block"; // Cambia la proprietà display da "none" a "block" per mostrarlo        
        console.log("Username già usato per creare un utente")
        isValid = false;
        return;
    }

    document.getElementById("Input-Username").addEventListener("input", function () {
        document.getElementById("username-error").style.display = "none";
    });

    // Controllo se l'email è stata inserita
    if (email == "") {
        document.getElementById("Input-Email").style.borderColor = "red";
        emailError.textContent = "Inserisci la mail";
        emailError.style.display = "block";
        isValid = false;
        console.log("email non inserita");
        return;
    // Controllo se l'email contiene il carattere @
    } else if (!validateEmail_at(email)) {
        document.getElementById("Input-Email").style.borderColor = "red";
        emailError.textContent = "Email non valida, inserisci la @";
        emailError.style.display = "block";
        isValid = false;
        console.log("carattere @ non presente");
        return;
    // Controllo se l'email contiene un dominio valido
    } else if (!validateEmail_dominio(email)) {
        document.getElementById("Input-Email").style.borderColor = "red";
        emailError.textContent = "Email non valida, inserisci un dominio valido (.com, .it, .org, .net)";
        emailError.style.display = "block";
        isValid = false;
        console.log("dominio non presente");
        return;
    // Controllo se l'email contiene un carattere valido dopo la @
    } else if (!validateEmail_char(email)) {
        document.getElementById("Input-Email").style.borderColor = "red";
        emailError.textContent = "Email non valida, inserisci un carattere valido dopo la @";
        emailError.style.display = "block";
        isValid = false;
        console.log("carattere dopo la @ non valido");
        return;
    } else {
        // Se l'email è valida, nascondi l'errore
        emailError.textContent = "";
        emailError.classList.remove('show');
        document.getElementById("Input-Email").style.borderColor = "";
    }

    var upperCase = 0;
    var lowerCase = 0;
    var digit = 0;

    // Utilizza una variabile booleana per verificare la presenza di caratteri speciali
    let specialCharFound = false;

    // Controllo se la password è stata inserita
    if (password == "") {
        document.getElementById("Input-Password").style.borderColor = "red";
        passwordError.textContent = "Inserisci la password";
        passwordError.style.display = "block";
        isValid = false;
        console.log("password non inserita");
        return;
    }

    // Controllo se la password ha almeno 8 caratteri
    if (password.length < 8) {
        document.getElementById("Input-Password").style.borderColor = "red";
        document.getElementById("NumChar").classList.add("text-error");
        isValid = false;
        console.log("lunghezza password minore di 8");
        return;
    }

    //ciclo per incrementare i contatori per ogni carattere della password
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (char >= 'A' && char <= 'Z') {
            upperCase++;
        }
        if (char >= 'a' && char <= 'z') {
            lowerCase++;
        }
        if (char >= '0' && char <= '9') {
            digit++;
        }
        if (char === '!' || char === '?' || char === '#') {
            specialCharFound = true;
        }
    }

    // Controllo se la password contiene almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale
    if (upperCase < 1) {
        document.getElementById("Input-Password").style.borderColor = "red";
        document.getElementById("UpperChar").classList.add("text-error");
        isValid = false;
        console.log("La password non contiene lettere maiuscole");
        return;
    }

    if (lowerCase < 1) {
        document.getElementById("Input-Password").style.borderColor = "red";
        document.getElementById("LowerChar").classList.add("text-error");
        isValid = false;
        console.log("La password non contiene lettere minuscole");
        return;
    }

    if (digit < 1) {
        document.getElementById("Input-Password").style.borderColor = "red";
        document.getElementById("DigitChar").classList.add("text-error");
        isValid = false;
        console.log("La password non contiene un numero");
        return;
    }

    if (!specialCharFound) {  // Usa la variabile booleana per il controllo
        document.getElementById("Input-Password").style.borderColor = "red";
        document.getElementById("SpecialChar").classList.add("text-error");
        isValid = false;
        console.log("La password non contiene un carattere speciale");
        return;
    }

    //se username, email e password sono validi
    if (isValid) {
        // Recupero degli utenti dal localStorage
        let utenti = JSON.parse(localStorage.getItem('utenti')) || [];

        // Creazione del nuovo utente
        let nuovoUtente = {
            username: username,
            email: email,
            password: password,
            ricettario: [], // Array per le ricette salvate dall'utente
            recensioni: [],
            note_personali: [] // Add a colon after 'note_personali' and initialize it as an empty array
        }


        //La funzione some() è un metodo degli array in JavaScript che accetta come argomento una funzione di callback 
        //e restituisce true se almeno un elemento dell'array soddisfa la condizione specificata nella callback, altrimenti restituisce false.
        if (utenti.some(utente => utente.email === nuovoUtente.email)) {
            accountError.textContent = "Questa mail è già stata usata per creare un account";
            accountError.style.display = "block"; // Cambia la proprietà display da "none" a "block" per mostrarlo        
            console.log("Email già usata per creare un utente")
            return;
        } else {
            utenti.push(nuovoUtente);

            localStorage.setItem('utenti', JSON.stringify(utenti));  // Salva i dati aggiornati su localStorage

            sessionStorage.setItem('isLoggedIn', 'true'); // Salva i dati aggiornati su sessionStorage
            sessionStorage.setItem('email', nuovoUtente.email);
            sessionStorage.setItem('username', nuovoUtente.username);
            sessionStorage.setItem('password', nuovoUtente.password);

            console.log("Registrazione avvenuta con successo", nuovoUtente);

            window.location.href = "benvenuto-page.html";  // Reindirizza alla pagina index.html
        }

        document.getElementById("Input-Email").addEventListener("input", function () {
            document.getElementById("email-error").style.display = "none";
        });
    }
}

// Funzione per eseguire il reset dei requisiti della password
function resetPasswordRequirements() {
    document.getElementById('NumChar').classList.remove('text-error');
    document.getElementById('UpperChar').classList.remove('text-error');
    document.getElementById('LowerChar').classList.remove('text-error');
    document.getElementById('DigitChar').classList.remove('text-error');
    document.getElementById('SpecialChar').classList.remove('text-error');
}

// Funzione per verificare se l'username contiene almeno una lettera
function validateUsername_char(email) {
    for (i = 0; i < email.length; i++) {
        char = email[i];
        if (char >= 'A' && char <= 'Z') {
            return true;
        } else if (char >= 'a' && char <= 'z') {
            return true;
        }
    }
    return false;
}

// Funzione per verificare se l'email contiene il carattere @
function validateEmail_at(email) {
    return email.includes('@');
}

// Funzione per verificare se l'email contiene un dominio valido
function validateEmail_dominio(email) {
    let lastThreeChars = email.slice(-3);
    let lastFourChars = email.slice(-4);
    console.log(lastThreeChars);
    if (lastFourChars === '.com' || lastThreeChars === '.it' || lastFourChars === '.org' || lastFourChars === '.net') {
        return true;
    }
    return false;
}

// Funzione per verificare se l'email contiene un carattere valido dopo la @
function validateEmail_char(email) {
    for (i = 0; i < email.length; i++) {
        if (email[i] === '@' && email[i + 1] === '.') {
            return false;
        }
    }
    return true;
}




/*funzioni per login*/

function loginUser(mail_or_username, password) {
    const accountError = document.getElementById("account-error");
    accountError.style.display = "none"; // Nascondi l'errore account esistente

    //se l'autenticazione è andata a buon fine
    if (authenticateUser(mail_or_username, password)) {
        accountError.style.display = "none";  // Nasconde eventuali errori precedenti
        sessionStorage.setItem('isLoggedIn', 'true');
        if (mail_or_username.includes('@')) { // Se l'utente ha inserito l' email
            sessionStorage.setItem('email', mail_or_username);
        } else {    // Se l'utente ha inserito l'username
            sessionStorage.setItem('username', mail_or_username);
        }
        sessionStorage.setItem('password', password);
        console.log('Credenziali corrette');
        window.location.href = 'index.html'; // Redirigi alla pagina index se è loggato

    //se l'autenticazione non è andata a buon fine
    } else {
        accountError.textContent = "Credenziali non corrette. Per favore riprova.";
        accountError.style.display = "block"; // Cambia la proprietà display da "none" a "block" per mostrarlo 
    }
}


// check-login
function check_login() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

    // Se l'utente non è loggato, reindirizzalo alla pagina di login
    if (!isLoggedIn) {
        console.log('Tentativo di login effettuato');
        window.location.href = 'profilo-login.html'; // Redirigi alla pagina di login se non è loggato
    }
}


//logoutUser
function logoutUser() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('password');
    console.log('Logout effettuato');
    window.location.href = 'index.html'; //Torna alla Pagina Precedente
}


//funzione per autenticare l'utente
function authenticateUser(mail_or_username, password) {
    const users = JSON.parse(localStorage.getItem('utenti'));
    const user = users.find(user =>
        (user.email === mail_or_username && user.password === password)
        || (user.username === mail_or_username && user.password === password)
    );
    return user !== undefined; // Restituisce true se il login è riuscito, altrimenti false
}


function cambia_pass() {
    const mail_or_username = document.getElementById("InputEmail_or_Username").value;
    const old_password = document.getElementById("InputPasswordVecchia").value;
    const new_password = document.getElementById("InputPasswordNuova").value;

    // Elementi per mostrare gli errori
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");
    // Reset delle segnalazioni di errore e dei bordi
    usernameError.style.display = "none"; // Nascondi l'errore account esistente
    usernameError.textContent = "";
    passwordError.textContent = "";

    const accountError = document.getElementById("account-error");
    accountError.style.display = "none"; // Nascondi l'errore account esistente

    const users = JSON.parse(localStorage.getItem('utenti'));

    const user = users.find(user =>
        (user.email === mail_or_username && user.password === old_password)
        || (user.username === mail_or_username && user.password === old_password)
    );
    resetPasswordRequirements();

    // Controllo se l'utente è loggato
    if (sessionStorage.getItem('isLoggedIn', 'true')) {
        // Controllo se l'utente ha inserito la mail o l'username
        if(mail_or_username == "") {
            usernameError.textContent = "Inserisci la mail o l'username";
            usernameError.style.display = "block";
            return;
        }
        // Controllo se l'utente ha inserito la password vecchia
        if(old_password == "") {
            passwordError.textContent = "Inserisci la password";
            passwordError.style.display = "block";
            return;
        }

        // Controllo se l'utente esiste
        if (user !== undefined) {
            accountError.style.display = "none";  // Nasconde eventuali errori precedenti
            let isValid = true;
            var upperCase = 0;
            var lowerCase = 0;
            var digit = 0;
            // Utilizza una variabile booleana per verificare la presenza di caratteri speciali
            let specialCharFound = false;

            // Controllo se la nuova password è uguale a quella vecchia
            if (new_password === old_password) {
                passwordError.textContent = "Nuova password uguale a quella vecchia";
                passwordError.style.display = "block";
                return;
            }

            // Controllo se la nuova password è stata inserita
            if (new_password == "") {
                document.getElementById("InputPasswordNuova").style.borderColor = "red";
                passwordError.textContent = "Inserisci la password";
                passwordError.style.display = "block";
                isValid = false;
                console.log("password non inserita");
                return;
            }

            // Controllo se la nuova password ha almeno 8 caratteri
            if (new_password.length < 8) {
                document.getElementById("InputPasswordNuova").style.borderColor = "red";
                document.getElementById("NumChar").classList.add("text-error");
                isValid = false;
                console.log("lunghezza password minore di 8");
                return;
            }

            //ciclo per incrementare i contatori per ogni carattere della password
            for (let i = 0; i < new_password.length; i++) {
                let char = new_password[i];
                if (char >= 'A' && char <= 'Z') {
                    upperCase++;
                }
                if (char >= 'a' && char <= 'z') {
                    lowerCase++;
                }
                if (char >= '0' && char <= '9') {
                    digit++;
                }
                if (char === '!' || char === '?' || char === '#') {
                    specialCharFound = true;
                }
            }

            // Controllo se la nuova password contiene almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale
            if (upperCase < 1) {
                document.getElementById("InputPasswordNuova").style.borderColor = "red";
                document.getElementById("UpperChar").classList.add("text-error");
                isValid = false;
                console.log("La password non contiene lettere maiuscole");
                return;
            }

            if (lowerCase < 1) {
                document.getElementById("InputPasswordNuova").style.borderColor = "red";
                document.getElementById("LowerChar").classList.add("text-error");
                isValid = false;
                console.log("La password non contiene lettere minuscole");
                return;
            }

            if (digit < 1) {
                document.getElementById("InputPasswordNuova").style.borderColor = "red";
                document.getElementById("DigitChar").classList.add("text-error");
                isValid = false;
                console.log("La password non contiene un numero");
                return;
            }

            if (!specialCharFound) {  // Usa la variabile booleana per il controllo
                document.getElementById("InputPasswordNuova").style.borderColor = "red";
                document.getElementById("SpecialChar").classList.add("text-error");
                isValid = false;
                console.log("La password non contiene un carattere speciale");
                return;
            }

            if (isValid) {
                // Aggiorna la password
                user.password = new_password;

                // Salva i dati aggiornati su localStorage 
                localStorage.setItem('utenti', JSON.stringify(users));
                sessionStorage.setItem('password', new_password);
                console.log('Password cambiata con successo');
                window.location.href = 'ricettario.html'; // Redirigi alla pagina profilo
            } 
            
        }else{
            console.log(user)
            console.log(users)
            accountError.textContent = "Credenziali non corrette. Per favore riprova.";
            accountError.style.display = "block"; // Cambia la proprietà display da "none" a "block" per mostrarlo 
        }

    //se l'utente non è loggato
    } else {
        console.log('Devi loggarti');
        accountError.textContent = "Devi fare il login per poter cambiare la password";
        accountError.style.display = "block"; // Cambia la proprietà display da "none" a "block" per mostrarlo 
    }
}

//funzione per eliminare l'account
function elimina_account() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const accountError = document.getElementById("account-error");
    accountError.style.display = "none"; // Nascondi l'errore account esistente

    // se l'utente è loggato
    if(isLoggedIn){
        const users = JSON.parse(localStorage.getItem('utenti'));

        const user = users.find(user =>
            (user.email === mail_or_username && user.password === old_password)
            || (user.username === mail_or_username && user.password === old_password)
        );

        users.splice(users.indexOf(user), 1);

    // se l'utente non è loggato
    }else{
        console.log('Devi loggarti');
        accountError.textContent = "Devi fare il login per poter eliminare il tuo account";
        accountError.style.display = "block"; // Cambia la proprietà display da "none" a "block" per mostrarlo 
    }
}