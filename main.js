document.addEventListener('DOMContentLoaded', function() {
  const videoTitleElement = document.getElementById('video-title');
  const videoImageElement = document.getElementById('video-image');
  const carouselContainer = document.getElementById('carousel-container');
  const actionCarouselContainer = document.getElementById('action-carousel-container');
  const prevButtonRanked = document.getElementById('prev-button-ranked');
  const nextButtonRanked = document.getElementById('next-button-ranked');
  const prevButtonAction = document.getElementById('prev-button-action');
  const nextButtonAction = document.getElementById('next-button-action');
  let slidePositionRanked = 0;
  let slidePositionAction = 0;

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

          container.appendChild(imageElement);
        });

        initCarousel(container);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function initCarousel(container) {
    const prevButton = container.previousElementSibling;
    const nextButton = container.nextElementSibling;
    const imageElements = container.getElementsByTagName('img');

    prevButton.addEventListener('click', function() {
      slidePositionRanked += container.offsetWidth; // Scroll by the width of the container
      updateSlidePosition(container, slidePositionRanked);
    });

    nextButton.addEventListener('click', function() {
      slidePositionRanked -= container.offsetWidth; // Scroll by the width of the container
      updateSlidePosition(container, slidePositionRanked);
    });

    container.style.width = `${imageElements.length * imageElements[0].offsetWidth}px`; // Adjust container width based on the number of images
  }

  function updateSlidePosition(container, slidePosition) {
    container.style.transform = `translateX(${slidePosition}px)`;
    container.style.transition = 'transform 0.3s ease-in-out';
    setTimeout(function() {
      container.style.transition = '';
    }, 300);
  }

  fetchHighestRatedMovie();
  fetchMovies('http://localhost:8000/api/v1/titles/?imdb_score_min=8&sort_by=-imdb_score', carouselContainer);
  fetchMovies('http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score', actionCarouselContainer);

  prevButtonRanked.addEventListener('click', function() {
    slidePositionRanked += carouselContainer.offsetWidth; // Scroll by the width of the container
    updateSlidePosition(carouselContainer, slidePositionRanked);
  });

  nextButtonRanked.addEventListener('click', function() {
    slidePositionRanked -= carouselContainer.offsetWidth; // Scroll by the width of the container
    updateSlidePosition(carouselContainer, slidePositionRanked);
  });

  prevButtonAction.addEventListener('click', function() {
    slidePositionAction += actionCarouselContainer.offsetWidth; // Scroll by the width of the container
    updateSlidePosition(actionCarouselContainer, slidePositionAction);
  });

  nextButtonAction.addEventListener('click', function() {
    slidePositionAction -= actionCarouselContainer.offsetWidth; // Scroll by the width of the container
    updateSlidePosition(actionCarouselContainer, slidePositionAction);
  });
});
