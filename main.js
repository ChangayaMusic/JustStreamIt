document.addEventListener('DOMContentLoaded', function() {
  const videoTitleElement = document.getElementById('video-title');
  const videoImageElement = document.getElementById('video-image');
  const topRatedMoviesContainer = document.getElementById('top-rated-movies');
  const carouselContainer = document.getElementById('carousel-container');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  let slidePosition = 0;
  const moviesPerPage = 8;
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

  function fetchAllPages(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;
        const nextUrl = data.next;

        // Exclure le film le mieux noté
        const filteredMovies = movies.slice(1);

        filteredMovies.forEach(movie => {
          const imageUrl = movie.image_url;
          const altText = movie.title;

          const imageElement = document.createElement('img');
          imageElement.src = imageUrl;
          imageElement.alt = altText;

          carouselContainer.appendChild(imageElement);
        });

        if (nextUrl) {
          fetchAllPages(nextUrl);
        } else {
          // Sinon, initialiser le carrousel
          initCarousel();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function fetchActionMovies(url) { 
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;
        const nextUrl = data.next;
  
        
        const filteredMovies = movies
  
        filteredMovies.forEach(movie => {
          const imageUrl = movie.image_url;
          const altText = movie.title;
  
          const imageElement = document.createElement('img');
          imageElement.src = imageUrl;
          imageElement.alt = altText;
  
          actionCarouselContainer.appendChild(imageElement); 
        });
  
        if (nextUrl) {
          fetchActionMovies(nextUrl);
        } else {
        
          initCarousel();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  function initCarousel() {
    function updateSlidePosition() {
      carouselContainer.style.transform = `translateX(${slidePosition}px)`;
    }

    prevButton.addEventListener('click', function() {
      if (slidePosition === 0) {
        slidePosition =
          -imageElement.offsetWidth * carouselContainer.children.length + 
          (carouselContainer.offsetWidth % (carouselContainer.children.length * 25));
      } else {
        slidePosition += imageElement.offsetWidth * moviesPerPage; 
      }
      updateSlidePosition();
    });

    nextButton.addEventListener('click', function() {
      if (
        slidePosition ===
        -imageElement.offsetWidth * carouselContainer.children.length + 
          (carouselContainer.offsetWidth % (carouselContainer.children.length * 25))
      ) {
        slidePosition = 0;
      } else {
        slidePosition -= imageElement.offsetWidth * moviesPerPage; 
      }
      updateSlidePosition();
    });
  }

  fetchAllPages('http://localhost:8000/api/v1/titles/?imdb_score_min=8&sort_by=-imdb_score');
  fetchHighestRatedMovie();
  fetchActionMovies('http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score'); // Change the URL to match your API endpoint and the function name to match
  
  
});
