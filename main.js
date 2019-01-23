class TheMovieDB {
	constructor(apiKey, language) {
		this.apiBase = 'http://api.themoviedb.org/3';

		this.apiKey = apiKey;
		this.language = language;
	}

	apiRequest(path, query) {
		const response = $.getJSON( `${this.apiBase}${path}?api_key=${this.apiKey}&language=${this.language}&query=${query}`);
		return response;
	}

	_apiRequest(path) {
		return this.apiRequest(path, "");
	}

	// API Endpoints

	getDetails(movie_id) {
		const GET_MOVIE_DETAILS = `/movie/${movie_id}`;
		const response = this._apiRequest(GET_MOVIE_DETAILS);
		return response;
	}
	
	getSimilar(movie_id) {
		const GET_MOVIE_SIMILAR = `/movie/${movie_id}/similar`;
		const response = this._apiRequest(GET_MOVIE_SIMILAR);
		return response;
	}

	getSearch(query) {
		const GET_SEARCH = `/search/movie`;
		const response = this.apiRequest(GET_SEARCH, query);
		return response;
	}

	getNowPlaying() {
		const GET_MOVIE_NOW_PLAYING = `/movie/now_playing`;
		const response = this._apiRequest(GET_MOVIE_NOW_PLAYING);
		return response;
	}

	getPopular() {
		const GET_MOVIE_POPULAR = `/movie/popular`;
		const response = this._apiRequest(GET_MOVIE_POPULAR);
		return response;
	}

	getTopRated() {
		const GET_MOVIE_TOP_RATED = `/movie/top_rated`;
		const response = this._apiRequest(GET_MOVIE_TOP_RATED);
		return response;
	}

	getUpcoming() {
		const GET_MOVIE_UPCOMING = `/movie/upcoming`;
		const response = this._apiRequest(GET_MOVIE_UPCOMING);
		return response;
	}

	getTrending(day = false) {
		const GET_MOVIE_UPCOMING = `/trending/movie/${day ? "day" : "week"}`;
		const response = this._apiRequest(GET_MOVIE_UPCOMING);
		return response;
	}
}

$(
	(function() {
		let themoviedb = new TheMovieDB('6fe353596ca6d944bde6ec4bb978590e', "en-US");

		let last_movie = "";

		//displayMovie(218);
		showPopular();

		$('#popular').click(function() {
			updateActive($(this));
			showPopular();
		});

		$('#nowplaying').click(function() {
			updateActive($(this));
			showNowPlaying();
		});

		$('#toprated').click(function() {
			updateActive($(this));
			showTopRated();
		});

		$('#upcoming').click(function() {
			updateActive($(this));
			showUpcoming();
		});

		$('#trending').click(function() {
			updateActive($(this));
			showTrending();
		});

		$('#watched').click(function() {
			showWatched();
		});

		$('#watching').click(function() {
			showToWatch();
		});

		$('#wishlist').click(function() {
			showWishlist();
		});

		$("#search-input").on("input", function(e) {
			var input = $(this);
			var val = input.val();

			if (input.data("lastval") != val) {
				input.data("lastval", val);

				if (val == ""){
					showPopular();
				}
				else
				{
					showSearch(val);
				}
			}

		});

		$("#showcase").on("click", ".show-movie" , function(){
			movie_id = $(this).parent().data('movie-id');
			displayMovie(movie_id);
		});

		$("#showcase").on("click", ".remove-movie" , function(){
			movie_id = $(this).parent().data('movie-id');

			$('#removeDialog').attr('data-movie-id', movie_id);
			$('#removeDialog').modal();
		});

		$("#removeDialog").on("click", ".delete-movie" , function(){
			movie_id = $('#removeDialog').attr('data-movie-id');

			switch ($(".active").children("a").attr("id")) {
				case 'watched':
					setWatched(getWatched().filter(movie => movie.id != movie_id));

					if (getWatched().length > 0){
						showWatched();
					}
					else
					{
						location.reload();
					}
					break;

				case 'watching':
					setToWatch(getToWatch().filter(movie => movie.id != movie_id));
					
					if (getToWatch().length > 0){
						showToWatch();
					}
					else
					{
						location.reload();
					}
					break;

				case 'wishlist':
					setWishlist(getWishlist().filter(movie => movie.id != movie_id));
					
					if (getWishlist().length > 0){
						showWishlist();
					}
					else
					{
						location.reload();
					}
					break;
			
				default:
					break;
			}
		});

		$("#moviedetails").on("click", ".watched" , function(){
			let watched = getWatched().filter(movie => movie.id !== last_movie.id);

			watched.unshift(last_movie);
			setWatched(watched);
		});

		$("#moviedetails").on("click", ".watching" , function(){
			let towatch = getToWatch().filter(movie => movie.id !== last_movie.id);

			towatch.unshift(last_movie);
			setToWatch(towatch);
		});

		$("#moviedetails").on("click", ".wishlist" , function(){
			let wishlist = getWishlist().filter(movie => movie.id !== last_movie.id);

			wishlist.unshift(last_movie);
			setWishlist(wishlist);
		});

		function getWatched(){
			let watched = JSON.parse(localStorage.getItem("watched"));

			if (watched == null){
				watched = [];
			}

			return watched;
		}

		function setWatched(watched){
			localStorage.setItem("watched", JSON.stringify(watched));
		}

		function getToWatch(){
			let towatch = JSON.parse(localStorage.getItem("watching"));

			if (towatch == null){
				towatch = [];
			}

			return towatch;
		}

		function setToWatch(towatch){
			localStorage.setItem("watching", JSON.stringify(towatch));
		}

		function getWishlist(){
			let wishlist = JSON.parse(localStorage.getItem("wishlist"));

			if (wishlist == null){
				wishlist = [];
			}

			return wishlist;
		}

		function setWishlist(wishlist){
			localStorage.setItem("wishlist", JSON.stringify(wishlist));
		}

		function updateActive(element){
			$('body').find('.active').removeClass();
			element.parent().addClass("active");
		}

		function showPopular(){
			themoviedb.getPopular().then(function(results){
				$('#search-input').val("");
				displayMovies(results.results);
			});
		}

		function showNowPlaying(){
			themoviedb.getNowPlaying().then(function(results){
				$('#search-input').val("");
				displayMovies(results.results);
			});
		}

		function showTopRated(){
			themoviedb.getTopRated().then(function(results){
				$('#search-input').val("");
				displayMovies(results.results);
			});
		}

		function showUpcoming(){
			themoviedb.getUpcoming().then(function(results){
				$('#search-input').val("");
				displayMovies(results.results);
			});
		}

		function showTrending(){
			themoviedb.getTrending().then(function(results){
				$('#search-input').val("");
				displayMovies(results.results);
			});
		}

		function showSearch(query){
			themoviedb.getSearch(query).then(function(results){
				displayMovies(results.results);
			});
		}

		function showWatched() {
			let watched = getWatched();
			if (watched.length > 0){
				displayMovies(watched, removeBTN = true);
				updateActive($('#watched'));
				$('#search-input').val("");
			}else{
				$('#emptyDialog').find('.modal-alert').text("Watched");
				$('#emptyDialog').modal();
			}
		}

		function showToWatch() {
			let towatch = getToWatch();
			if (towatch.length > 0){
				displayMovies(towatch, removeBTN = true);
				updateActive($('#watching'));
				$('#search-input').val("");
			}else{
				$('#emptyDialog').find('.modal-alert').text("Watching");
				$('#emptyDialog').modal();
			}
		}

		function showWishlist() {
			let wishlist = getWishlist();
			if (wishlist.length > 0){
				displayMovies(wishlist, removeBTN = true);
				updateActive($('#wishlist'));
				$('#search-input').val("");
			}else{
				$('#emptyDialog').find('.modal-alert').text("Wishlist");
				$('#emptyDialog').modal();
			}
		}

		// old btn
		// <button class="btn btn-primary show-movie">View <i class="fa fa-search"></i></button>
		function displayMovies(movies, removeBTN = false){
			$('#showcase').empty();
			$('#moviedetails').empty();

			movies.forEach(movie => {
				if (movie.poster_path != null){
					$('#showcase').append(	`<div class="showcase-item col-6 col-sm-4 col-md-3 col-xl-2 mb-3">
												<div class="card thumbnail" data-movie-id="${ movie.id }">
													<img class="card-img-top show-movie" src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}" alt="${movie.title}">
													<h5 class="card-title show-movie">${movie.title} ${ movie.release_date == "" ? "" : `(${movie.release_date.substring(0, 4)})` }</h5>
													${ removeBTN ? `<button class="btn btn-danger remove-movie">Remove <i class="fa fa-trash"></i></button>` : "" }
												</div>
											</div>`);
				}
			});
		}

		function displayMovie(movie_id){
			themoviedb.getSimilar(movie_id).then(function(results){
				displayMovies(results.results);
				themoviedb.getDetails(movie_id).then(function(movie){
					last_movie = movie;
					genres = "";
					movie.genres.forEach(genre => {
						genres += genre.name + ", ";
					});

					genres = genres.substring(0, genres.length - 2);
						
					$('#moviedetails').append(	`<div class="row justify-content-lg-between align-items-lg-center pb-5">
													<div class="col-lg-4">
														<img src="https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}" class="d-block mx-auto d-lg-block img-fluid img-thumbnail" alt="${movie.title}">
													</div>
													<div class="col-lg-8" data-movie-id="${ movie.id }">
														<h1 class="display-4">${movie.title} <small class="text-muted">${ movie.release_date == "" ? "" : `(${movie.release_date.substring(0, 4)})` }</small></h1>
														<h3>${ genres }</h3>
														<h5 class="mb-5">${ movie.vote_average }/10 <i class="fa fa-star mr-4"></i> ${ movie.vote_count } <i class="fa fa-thumbs-o-up mr-4"></i> ${ movie.runtime == null ? "" : `${ movie.runtime } <i class="fa fa-clock-o"></i>` }</h5>
														<p class="lead mb-4">${ movie.overview }</p>
														<button class="btn btn-pill btn-primary watched">Watched</button>
														<button class="btn btn-pill btn-primary watching">Watching</button>
														<button class="btn btn-pill btn-primary wishlist">Wishlist</button>
														<a href="https://www8.mrpiracy.xyz/filme.php?imdb=${ movie.imdb_id }">Mr.Piracy</a>
														<a href="https://www.netflix.com/search?q=${ movie.title }">Netflix</a>
														
													</div>
												</div>`);
				});
			});
		}
	})()
);