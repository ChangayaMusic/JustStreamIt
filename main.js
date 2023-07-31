document.addEventListener('DOMContentLoaded', function () {
  const videoTitleElement = document.getElementById('video-title');
  const videoImageElement = document.getElementById('video-image');
  const topRatedCarouselContainer = document.getElementById('top-rated-carousel-container');
  const actionCarouselContainer = document.getElementById('action-carousel-container');
  const horrorCarouselContainer = document.getElementById('horror-carousel-container');
  const adventureCarouselContainer = document.getElementById('adventure-carousel-container');

  function fetchHighestRatedMovie() {
    return fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score')
      .then(response => response.json())
      .then(data => {
        const movie = data.results[0];
        const title = movie.title;
        const imageUrl = movie.image_url;

        videoTitleElement.textContent = title;
        videoImageElement.src = imageUrl;

        return movie;
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  }

  function fetchMovieDetailsByTitle(movie) {
    let idImage = movie.id
    const url = `http://localhost:8000/api/v1/titles/${idImage}`;

    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        throw error;
      });
  }

  function openModal(movie) {
    const modal = document.getElementById('movieModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = movie.title;
    modalImage.src = movie.image_url;

    fetchMovieDetailsByTitle(movie)
      .then(movieDetails => {
        console.log('API Response:', movieDetails);

        const description = movieDetails.description || 'Description not available';
        const year = movieDetails.year || 'Year not available';
        const genres = movieDetails.genres ? movieDetails.genres.join(', ') : 'Genres not available';
        const imdbScore = movieDetails.imdb_score || 'IMDb Score not available';
        const directors = movieDetails.directors ? movieDetails.directors.join(', ') : 'Directors not available';
        const actors = movieDetails.actors ? movieDetails.actors.join(', ') : 'Actors not available';
        const worldwideGrossIncome = movieDetails.worldwide_gross_income || 'Worldwide Gross Income not available';
        const countries = movieDetails.countries ? movieDetails.countries.join(', ') : 'Countries not available';
        const duration = movieDetails.duration || 'Duration not available';

        modalDescription.innerHTML = `
          <p>Description: ${description}</p>
          <p>Year: ${year}</p>
          <p>Genres: ${genres}</p>
          <p>IMDb Score: ${imdbScore}</p>
          <p>Directors: ${directors}</p>
          <p>Actors: ${actors}</p>
          <p>Worldwide Gross Income: ${worldwideGrossIncome}</p>
          <p>Countries: ${countries}</p>
          <p>Duration: ${duration} minutes</p>
        `;

        modal.style.display = 'block';
      })
      .catch(error => {
        console.error('Error fetching movie details:', error);
        modal.style.display = 'block';
      });
  }

  function closeModal() {
    console.log("Close modal")
    const modal = document.getElementById('movieModal');
    modal.style.display = 'none';
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
            imageElement.id = `image-${movie.id}`

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

  function initializeCarousels() {
    function moveCarouselPrev(carouselContainer) {
      const carousel = carouselContainer.querySelector('.carousel-container');
      const scrollAmount = carousel.scrollWidth / 2;
      carousel.scrollLeft -= scrollAmount;
    }

    function moveCarouselNext(carouselContainer) {
      const carousel = carouselContainer.querySelector('.carousel-container');
      const scrollAmount = carousel.scrollWidth / 2;
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

    document.getElementById('modalCloseBtn').addEventListener('click', function () {
      closeModal();
    });
  }

  fetchHighestRatedMovie()
    .then(highestRatedMovie => {
      videoImageElement.addEventListener('click', function () {
        openModal(highestRatedMovie);
      });

      // Fetch movie data for all carousels
      fetchMovies('http://localhost:8000/api/v1/titles/?imdb_score_min=8&sort_by=-imdb_score', topRatedCarouselContainer);
      fetchMovies('http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score', actionCarouselContainer);
      fetchMovies('http://localhost:8000/api/v1/titles/?genre=horror&sort_by=-imdb_score', horrorCarouselContainer);
      fetchMovies('http://localhost:8000/api/v1/titles/?genre=adventure&sort_by=-imdb_score', adventureCarouselContainer);

      // Initialize carousel event listeners after loading all the data
      initializeCarousels();
    })
    .catch(error => {
      console.error('Error fetching highest-rated movie:', error);
    });
});
