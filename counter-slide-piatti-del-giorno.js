document.addEventListener('DOMContentLoaded', function () {
    var carouselElement = document.querySelector('#PiattidelGiorno-Carousel');
    var currentSlideIndex = 0;

    // Inizializza il contatore con la slide corrente (opzionale)
    updateSlideNumber(currentSlideIndex);

    // "Ascolta" l'evento 'slid.bs.carousel'
    carouselElement.addEventListener('slid.bs.carousel', function (event) {
        currentSlideIndex = event.to; // Ottiene l'indice della slide corrente
        updateSlideNumber(currentSlideIndex);
    });

    // Funzione per aggiornare il numero della slide corrente
    function updateSlideNumber(index) {
        //console.log("Slide corrente: " + (index + 1));
        document.getElementById('slideNumberDisplay-PiattidelGiorno').textContent = (index + 1) + "/3";
    }
});
