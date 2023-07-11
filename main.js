const apiUrl = 'http://localhost:8000/api/v1/titles/9';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Récupérer le titre et l'URL de l'image du film
    const titreVideo = data.title;
    const urlImage = data.image_url;
    
    // Afficher le titre dans l'élément HTML avec l'ID "titreVideo"
    const titreVideoElement = document.getElementById("titreVideo");
    titreVideoElement.textContent = titreVideo;
    
    // Afficher l'image dans le conteneur vidéo
    const videoContainer = document.querySelector(".video-container");
    const imageElement = document.createElement("img");
    imageElement.src = urlImage;
    videoContainer.appendChild(imageElement);
  })
  .catch(error => {
    console.error(error);
  });
