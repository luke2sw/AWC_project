function cerca() {
    const query = document.getElementById("query").value;  // Ottieni il valore della query
    if (query) {
        // Redirect alla pagina di risultati con la query come parametro
        window.location.href = `page.html?query=${encodeURIComponent(query)}`;
        return false; // Evita il comportamento standard di invio del modulo
    }
    return false; // Evita il comportamento standard di invio del modulo
}
