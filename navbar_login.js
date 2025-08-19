/*Controlla se l'utente è loggato.
 TRUE se l'utente è loggato, FALSE altrimenti.
 */
const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
if (isLoggedIn) {
    //se l'utente è loggato, mostro "ciao" + il suo username
    document.getElementById('login-button').textContent = 'Ciao ' + sessionStorage.getItem('username');
    document.getElementById('dropdownMenuButton').style.display = '';
} else {
    //se l'utente non è loggato, mostro solo il pulsante di login
    document.getElementById('login-button').textContent = 'Login';
    dropdownMenuButton.style.display = 'none';
}

//funzione per il logout
document.getElementById('logout-button').addEventListener('click', function (event) {
    console.log('logout qui');
    event.preventDefault();
    if (isLoggedIn) {
        logoutUser()
    }
});