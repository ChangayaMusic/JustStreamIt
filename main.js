document.addEventListener('DOMContentLoaded', function () {
  const videoTitleElement = document.getElementById('video-title');
  const videoImageElement = document.getElementById('video-image');
  const topRatedCarouselContainer = document.getElementById('top-rated-carousel-container');
  const actionCarouselContainer = document.getElementById('action-carousel-container');
  const horrorCarouselContainer = document.getElementById('horror-carousel-container');
  const adventureCarouselContainer = document.getElementById('adventure-carousel-container');

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
  fetchMovies('http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=horror&genre_contains=&sort_by=&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=', horrorCarouselContainer);
  fetchMovies('http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=adventure&genre_contains=&sort_by=&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=', adventureCarouselContainer);
});
// Helper function to move the carousel left (previous)
function moveCarouselPrev(carouselContainer) {
  const carousel = carouselContainer.querySelector('.carousel-container');
  const scrollAmount = carousel.scrollWidth / 3;
  carousel.scrollLeft -= scrollAmount;
}

// Helper function to move the carousel right (next)
function moveCarouselNext(carouselContainer) {
  const carousel = carouselContainer.querySelector('.carousel-container');
  const scrollAmount = carousel.scrollWidth / 3;
  carousel.scrollLeft += scrollAmount;
}

// Add event listeners for the "Prev" and "Next" buttons
document.querySelector('.top-rated-carousel .glider-prev').addEventListener('click', function () {
  moveCarouselPrev(document.querySelector('.top-rated-carousel'));
});

document.querySelector('.top-rated-carousel .glider-next').addEventListener('click', function () {
  moveCarouselNext(document.querySelector('.top-rated-carousel'));
});

document.querySelector('.action-carousel .glider-prev').addEventListener('click', function () {
  moveCarouselPrev(document.querySelector('.action-carousel'));
});

document.querySelector('.action-carousel .glider-next').addEventListener('click', function () {
  moveCarouselNext(document.querySelector('.action-carousel'));
});

document.querySelector('.horror-carousel .glider-prev').addEventListener('click', function () {
  moveCarouselPrev(document.querySelector('.horror-carousel'));
});

document.querySelector('.horror-carousel .glider-next').addEventListener('click', function () {
  moveCarouselNext(document.querySelector('.horror-carousel'));
});

document.querySelector('.adventure-carousel .glider-prev').addEventListener('click', function () {
  moveCarouselPrev(document.querySelector('.adventure-carousel'));
});

document.querySelector('.adventure-carousel .glider-next').addEventListener('click', function () {
  moveCarouselNext(document.querySelector('.adventure-carousel'));
});
