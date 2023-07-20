document.addEventListener('DOMContentLoaded', function () {
  const videoTitleElement = document.getElementById('video-title');
  const videoImageElement = document.getElementById('video-image');
  const topRatedCarouselContainer = document.getElementById('top-rated-carousel-container');
  const actionCarouselContainer = document.getElementById('action-carousel-container');

  function fetchHighestRatedMovie() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
      .then(response => response.json())
      .then(data => {
        const movie = data.results[0];
        const title = movie.title;
        const imageUrl = movie.image_url;

        videoTitleElement.textContent = title;
        videoImageElement.src = imageUrl;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function fetchMovies(url, container) {
    function fetchPage(url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const movies = data.results;
  
          movies.forEach(movie => {
            const imageUrl = movie.image_url;
            const altText = movie.title;
  
            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;
            imageElement.alt = altText;
  
            // Add the onerror event handler to handle image loading errors
            imageElement.onerror = function () {
              // Remove the image element from the DOM
              imageElement.remove();
            };
  
            const mediaElement = document.createElement('div');
            mediaElement.className = 'media-element';
            mediaElement.appendChild(imageElement);
  
            container.appendChild(mediaElement);
          });
  
          // Check if there are more pages and fetch them recursively
          if (data.next) {
            fetchPage(data.next);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    fetchPage(url);
  }
  
  
  

  fetchHighestRatedMovie();
  fetchMovies('http://localhost:8000/api/v1/titles/?imdb_score_min=8&sort_by=-imdb_score', topRatedCarouselContainer);
  fetchMovies('http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score', actionCarouselContainer);

  // Add carousel navigation event listeners
  addCarouselNavigation('top-rated-carousel');
  addCarouselNavigation('action-carousel');
});
