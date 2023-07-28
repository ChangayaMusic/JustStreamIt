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
  function fetchMovieDetailsByTitle(movieTitle) {
    const encodedTitle = encodeURIComponent(movieTitle);
    const url = `http://localhost:8000/api/v1/titles/?title_contains=${encodedTitle}`;
  
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.results && data.results.length > 0) {
          // Assuming the first movie in the results is the closest match
          const movieDetails = data.results[0];
          return movieDetails;
        } else {
          throw new Error('Movie not found');
        }
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        throw error; // Rethrow the error to be caught in the calling function
      });
  }

  function openModal(movie) {
  const modal = document.getElementById('movieModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDescription = document.getElementById('modalDescription');

  modalTitle.textContent = movie.title;
  modalImage.src = movie.image_url;

  fetchMovieDetailsByTitle(movie.title)
    .then(movieDetails => {
      console.log('API Response:', movieDetails);

      // Check if the required properties exist in the movieDetails object
      const description = movieDetails.description || 'Description not available';
      const year = movieDetails.year || 'Year not available';
      const genres = movieDetails.genre ? movieDetails.genre.join(', ') : 'Genres not available';
      const votes = movieDetails.votes || 'Votes not available';
      const imdbScore = movieDetails.imdb_score || 'IMDb Score not available';
      const directors = movieDetails.directors ? movieDetails.directors.join(', ') : 'Directors not available';
      const actors = movieDetails.actors ? movieDetails.actors.join(', ') : 'Actors not available';

      modalDescription.innerHTML = `
        <p>Description: ${description}</p>
        <p>Year: ${year}</p>
        <p>Genres: ${genres}</p>
        <p>Votes: ${votes}</p>
        <p>IMDb Score: ${imdbScore}</p>
        <p>Directors: ${directors}</p>
        <p>Actors: ${actors}</p>
      `;

      modal.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching movie details:', error);
      modal.style.display = 'block';
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
  
            // Add the click event listener to open the modal
            imageElement.addEventListener('click', function () {
              openModal(movie);
            });
  
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
