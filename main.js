// console.log("live... ;)");
var width = 500;
var height = 520;


// var svg = d3.select('svg'),
// 	width = +svg.attr("width"),
//     height = +svg.attr("height");

d3.csv('movies.csv', function(csv){
	// one bar chart with movies per year
	// picharts
	// several scatter plots connected with brushing + linking
	// an info hub present at all times in center
	//	number of likes with Duration
	// imbd score with duration

	movies = csv;
	// console.log(movies);

	var filteredMovies = d3.nest()
	.key(function(d) {
		//console.log(d.Control);
		if (d.cast_total_facebook_likes < 105000){
			return d;
		};
	})
	.entries(csv);
	// console.log("filtered: ", filteredMovies)

	var cleanedMovies = filteredMovies[0].values;



	for (var i=0; i<cleanedMovies.length; ++i) {
		cleanedMovies[i].director_name = cleanedMovies[i].director_name;
		cleanedMovies[i].num_critic_for_reviews = Number(cleanedMovies[i].num_critic_for_reviews);
		cleanedMovies[i].duration = Number(cleanedMovies[i].duration);
		cleanedMovies[i].gross = Number(cleanedMovies[i].gross);
		cleanedMovies[i].movie_title = cleanedMovies[i].movie_title
		cleanedMovies[i].language = cleanedMovies[i].language;
		cleanedMovies[i].country = cleanedMovies[i].country;
		cleanedMovies[i].title_year = Number(cleanedMovies[i].title_year);
		cleanedMovies[i].imdb_score = Number(cleanedMovies[i].imdb_score);
		cleanedMovies[i].movie_facebook_likes = Number(cleanedMovies[i].movie_facebook_likes);

	}
	//	Creating brushing and linked scatterplots
	var durationExtent = d3.extent(cleanedMovies, function(row) { return row.duration; });
	var likesExtent = d3.extent(cleanedMovies, function(row) { return row.movie_facebook_likes; });
	var imdbExtent = d3.extent(cleanedMovies,  function(row) { return row.imdb_score;  });
	var castLikesExtent = d3.extent(cleanedMovies, function(row) { return row.cast_total_facebook_likes; });

	var xScale = d3.scaleLinear().domain(durationExtent).range([50, 470]);
	var yScale = d3.scaleLinear().domain(imdbExtent).range([470, 50]);

	var xAxis = d3.axisBottom().scale(xScale);
	var yAxis = d3.axisLeft().scale(yScale);

	var chart1 = d3.select("#chart1")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height)

	var chart2 = d3.select("#chart2")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height)

	var chart3 = d3.select("#chart3")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height)

	var brushContainer1 = chart1.append('g')

	var brushContainer2 = chart2.append('g')


	var temp1= chart1.selectAll("circle")
		.data(cleanedMovies)
		.enter()
		.append("circle")
		.attr("id",function(d,i) {return i;} )
		.attr("fill", function(d) {
			// console.log("d....:", d)
			if (d.imdb_score > 0 && d.imdb_score < 2) {
				return "#b5d7e5";
			} if (d.imdb_score >= 2 && d.imdb_score < 4) {
				return "#9db5d6";
			} if (d.imdb_score >= 4 && d.imdb_score < 6) {
				return "#6e6eb4";
			} if (d.imdb_score >= 6 && d.imdb_score < 8) {
				return "#372D93";
			} if (d.imdb_score >=8) {
				return "#000858";
			}
		})
		.style("stroke", "black")
		.style("opacity", .75)
		.attr("cx", function(d) {
			if (d.movie_title != "Treachery" || d.movie_title != "Hardflip" || d.movie_title != "kickboxer: vengeance") {
				return xScale(d.duration);
			}
		})
		.attr("cy", function(d) { return yScale(d.imdb_score); })
		.attr("r", function(d) {
			return d.director_facebook_likes / 1000 + 5;
		})
		.on("click", function(d,i){
			// select the clicked circle
			d3.selectAll("circle")
			.classed('selected', false);
			d3.select(this)
			.classed('selected', true);
			chart2.selectAll("circle")
			// .classed('selected', false)
			.filter(function(f) {
				return f === d;
			})
			.classed('selected', true);

			//	updates information in chart 3 on click
			document.getElementById("title").innerHTML = d.movie_title;
			document.getElementById("movie_choice").value = d.movie_title;
			document.getElementById("imdb").innerHTML = d.imdb_score;
			document.getElementById("movie_likes").innerHTML = d.movie_facebook_likes;
			document.getElementById("cast_likes").innerHTML = d.cast_total_facebook_likes;
			if (d.director_name != "No Director") {
				document.getElementById("director").innerHTML = d.director_name;
			} else {
				document.getElementById("director").innerHTML = "Unknown";
			}
			if (d.title_year !== 0) {
				document.getElementById("year").innerHTML = d.title_year;
			} else {
				document.getElementById("year").innerHTML = "Unknown";
			}
			if (d.gross != 0) {
				document.getElementById("gross").innerHTML = "$" + d.gross;
			} else {
				document.getElementById("gross").innerHTML = "Unknown";
			}
			if (d.budget != 0) {
				document.getElementById("budget").innerHTML = "$" + d.budget;
			} else {
				document.getElementById("budget").innerHTML = "Unknown";
			}
		});

	chart1.append("text")
		.attr("x", width - 300)
		.attr("y", height - 5)
		.text("Duration (Minutes)");

	chart1.append("text")
		.attr("y", 0)
		.attr("x", -300)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("IMDB Score");


	chart1
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width - 20)+ ")")
		.call(xAxis) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Duration of Film");

	chart1
		.append("g") // create a group node
		.attr("transform", "translate(30, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("x", -15)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("IMDb Score (Out Of 10)");

	// make chart two (IMDB vs POPULARITY)

	var xScale2 = d3.scaleLinear().domain([0, 105000]).range([50, 470]);
	var yScale2 = d3.scaleLinear().domain(imdbExtent).range([470, 50]);

	var xAxis2 = d3.axisBottom().scale(xScale2);
	var yAxis2 = d3.axisLeft().scale(yScale2);

	// console.log("castextent: ", castLikesExtent);

	var temp2= chart2.selectAll("circle")
		.data(cleanedMovies)
		.enter()
		.append("circle")
		.attr("id",function(d,i) {return i;} )
		.attr("fill", function(d) {
			// console.log("d....:", d)
			if (d.imdb_score > 0 && d.imdb_score < 2) {
				return "#b5d7e5";
			} if (d.imdb_score >= 2 && d.imdb_score < 4) {
				return "#9db5d6";
			} if (d.imdb_score >= 4 && d.imdb_score < 6) {
				return "#6e6eb4";
			} if (d.imdb_score >= 6 && d.imdb_score < 8) {
				return "#372D93";
			} if (d.imdb_score >=8) {
				return "#000858";
			}
		})
		.style("stroke", "black")
		.style("opacity", .75)
		.attr("cx", function(d) {
			if (d.movie_title != "Treachery" || d.movie_title != "Hardflip" || d.movie_title != "kickboxer: vengeance") {
				return xScale2(d.cast_total_facebook_likes);
			}
		})
		.attr("cy", function(d) { return yScale2(d.imdb_score); })
		.attr("r", function(d) {
			return d.director_facebook_likes/ 1000 + 5;
		})
		.on("click", function(d,i){
			// select the clicked circle
			d3.selectAll("circle")
			.classed('selected', false);
			d3.select(this)
			.classed('selected', true);
			chart1.selectAll("circle")
			// .classed('selected', false)
			.filter(function(f) {
				return f === d;
			})
			.classed('selected', true);

			//	updates information in chart 3 on click
			document.getElementById("title").innerHTML = d.movie_title;
			document.getElementById("movie_choice").value = d.movie_title;
			document.getElementById("imdb").innerHTML = d.imdb_score;
			document.getElementById("movie_likes").innerHTML = d.movie_facebook_likes;
			document.getElementById("cast_likes").innerHTML = d.cast_total_facebook_likes;
			if (d.director_name != "No Director") {
				document.getElementById("director").innerHTML = d.director_name;
			} else {
				document.getElementById("director").innerHTML = "Unknown";
			}
			if (d.title_year !== 0) {
				document.getElementById("year").innerHTML = d.title_year;
			} else {
				document.getElementById("year").innerHTML = "Unknown";
			}
			if (d.gross != 0) {
				document.getElementById("gross").innerHTML = "$" + d.gross;
			} else {
				document.getElementById("gross").innerHTML = "Unknown";
			}
			if (d.budget != 0) {
				document.getElementById("budget").innerHTML = "$" + d.budget;
			} else {
				document.getElementById("budget").innerHTML = "Unknown";
			}
		});

	chart2.append("text")
		.attr("x", width - 350)
		.attr("y", height - 5)
		.text("Cast Popularity (Total Facebook Likes)");

	chart2.append("text")
		.attr("y", 0)
		.attr("x", -300)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("IMDB Score");

	chart2
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -20)+ ")")
		.call(xAxis2) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("Cast Popularity (Total Facebook Likes)");

	chart2
		.append("g") // create a group node
		.attr("transform", "translate(30, 0)")
		.call(yAxis2)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("x", -15)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("IMDb Score (Out Of 10)");

	var brush1 = d3.brush()
		.on('start', brushStart1)
		.on('brush', brushMoving)
		.on('end', brushEnd);

	brushContainer1.call(brush1);

	var brush2 = d3.brush()
		.on('start', brushStart2)
		.on('brush', brushMoving2)
		.on('end', brushEnd);


	brushContainer2.call(brush2);
	function brushStart1() {
		brushContainer2.call(brush1.move, null);
	}
	function brushStart2() {
		brushContainer1.call(brush2.move, null);
	}
	function brushMoving() {
		var selection = d3.event.selection;
		if (!selection) {
			return;
		}
		var [[left, top], [right, bottom]] = selection;
		chart2.selectAll("circle")
		.classed('selected2', function(d, i) {
			var cx = xScale(d.duration);
			var cy = yScale(d.imdb_score);
			return left <= cx && cx <= right && top <= cy && cy <= bottom;
		})
	}


	function brushMoving2() {
		var selection = d3.event.selection;
		if (!selection) {
			return;
		}
		var [[left, top], [right, bottom]] = selection;
		chart1.selectAll("circle")
			.classed('selected2', function(d, i) {
				var cx = xScale2(d.cast_total_facebook_likes);
				var cy = yScale2(d.imdb_score);
				return left <= cx && cx <= right && top <= cy && cy <= bottom;
			})
	}

	function brushEnd() {
		if (!d3.event.selection) {
			d3.selectAll("circle").classed('selected2', false);
		}
	}

	//	brushing finished

	var imdbs = d3.nest()
		.rollup(function(v) { return d3.sum(v, function(d) { return d.imdb_score; }); })
		.object(cleanedMovies);
		// console.log("imdbs....", imdbs);


	//	make bar chart
	chart3.attr("width", width + 50)
		.attr("height", height + 70)
		.append("g")

	var xScale3 = d3.scaleLinear().domain([0, 10]).range([0, width]);
	var yScale3 = d3.scaleLinear().domain([600, 0]).range([height, 0]);
	var yScaleAxis3 = d3.scaleLinear().domain([0, 600]).range([height, 0]);

	var xAxis3 = d3.axisBottom().scale(xScale3);
	var yAxis3 = d3.axisLeft().scale(yScaleAxis3);

	var imdbs = {
		0: 3, 2: 6, 3: 31, 4: 80, 5: 200, 6: 478, 7: 540, 8: 223, 9: 26, 10: 1
	};

	var colors = ["#b5d7e5", "#a9c2de", "#91abd1", "#748cc2", "#646db4",
					"#5457a4", "#4a4494", "#3f3583"]

	chart3
		.selectAll(".bar")
		.data(cleanedMovies)
		.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("fill", function(d, i) {
			if (Math.round(d.imdb_score) === 2) {
				return colors[0];
			}
			if (Math.round(d.imdb_score) === 3) {
				return colors[1];
			}
			if (Math.round(d.imdb_score) === 4) {
				return colors[2];
			}
			if (Math.round(d.imdb_score) === 5) {
				return colors[3];
			}
			if (Math.round(d.imdb_score) === 6) {
				return colors[4];
			}
			if (Math.round(d.imdb_score) === 7) {
				return colors[5];
			}
			if (Math.round(d.imdb_score) === 8) {
				return colors[6];
			}
			if (Math.round(d.imdb_score) === 9) {
				return colors[7];
			}
		})
		.attr("x", function(d) { return xScale3(Math.round(d.imdb_score)); })
		.attr("y", function(d) { return height - yScale3(imdbs[Math.round(d.imdb_score)])})
		.attr("height", function(d) { return yScale3(imdbs[Math.round(d.imdb_score)]);})
		.attr("width", 40)
		.attr("transform", "translate(0, 10)");

	chart3.append("g")
		.attr("transform", "translate(70,"+ (width + 30)+ ")")
		.attr("class","axis")
		.call(xAxis3);

	chart3.append("g")
		.append("g") // create a group node
		.attr("transform", "translate(50, 10)")
		.call(yAxis3)
		.append("text")
		.attr("class", "label")
		.attr("y", 6)
		.attr("x", -15)
		.attr("dy", ".71em")
		.style("text-anchor", "end")


	chart3.append("text")
		.attr("y", 0)
		.attr("x", -300)
		.attr("dy", ".75em")
		.attr("transform", "rotate(-90)")
		.text("Number of Movies");

	// chart3.append("text")
	// 	.text("Frequency of IMDB Scores")
	// 	.attr("transform", "translate(150,  535)")
	// 	.attr("class", "chart3text")
	// 	.style("font", "27px Helvetica Neue")

	chart3.append("text")
		.attr("x", width - 250)
		.attr("y", height + 50)
		.text("IMDB Scores (0-10)");


	// selector for Movies
	var select = d3.select("#movie_choice")
	var title_choice = "3";
	select
		.data(cleanedMovies)
		.on("change", function(d) {
			console.log(d)
			title_choice = document.getElementById("movie_choice").value;
			// document.getElementById("title").innerHTML = title_choice
			var choice = cleanedMovies.filter(function(d) {
				if (d.movie_title === title_choice) {
					// console.log("d", d)
					d3.selectAll("circle")
					.classed('selected', false);
					d3.selectAll("circle")
					// .classed('selected', false)
					.filter(function(f) {
						return f === d;
					})
					.classed("selected", true)
					document.getElementById("title").innerHTML = d.movie_title;
					document.getElementById("imdb").innerHTML = d.imdb_score;
					document.getElementById("movie_likes").innerHTML = d.movie_facebook_likes;
					document.getElementById("cast_likes").innerHTML = d.cast_total_facebook_likes;
					if (d.director_name != "No Director") {
						document.getElementById("director").innerHTML = d.director_name;
					} else {
						document.getElementById("director").innerHTML = "Unknown";
					}
					if (d.title_year !== 0) {
						document.getElementById("year").innerHTML = d.title_year;
					} else {
						document.getElementById("year").innerHTML = "Unknown";
					}
					if (d.gross != 0) {
						document.getElementById("gross").innerHTML = "$" + d.gross;
					} else {
						document.getElementById("gross").innerHTML = "Unknown";
					}
					if (d.budget != 0) {
						document.getElementById("budget").innerHTML = "$" + d.budget;
					} else {
						document.getElementById("budget").innerHTML = "Unknown";
					}
				}});
			});

		//	populate select with movie titles
		select.selectAll("option")
			.data(csv)
			.enter()
			.append("option")
			.attr("value", function(d) {
				// title1 = d.movie_title;
				return d.movie_title;
			})
			.text(function(d) { return d.movie_title; })

			//NVM ignore international movies go against Hollywood theme
		//	make piecharts
	// languageCount = {'German': 2,
	// 'English': 1463,'Mandarin': 9,'French': 24,'Persian': 2,'Chinese': 3,'Russian': 6,
	// 'Hindi': 11,'Spanish': 15,'Telugu': 1,'Kannada': 1,'Hebrew': 3,'Polish': 4,
	// 'Swedish': 2,'Portuguese': 3,'Japanese': 6,'Italian': 3,'Norwegian': 2,'Bosnian': 1,
	// 'Cantonese': 3,'Slovenian': 1,'Urdu': 1,'Icelandic': 2,'Panjabi': 1,'Swahili': 1,
	// 'Indonesian': 2,'Arabic': 2,'Danish': 1,'Korean': 1,'Romanian': 1,'Tamil': 1};
	// console.log(languageCount)

	});

	d3.csv('languages.csv', function(csv) {
		language = csv;
		var langs = language.filter(function(d) { return d.count })
		var data = [];
		var languages = [];
		for(var i = 0; i < langs.length; i++) {
			data[i] = langs[i].count;
			languages[i] = langs[i].language;
		}
		// console.log("count: ", languages);

	});

	d3.csv('popularity.csv', function(csv) {
		popularity = csv;
		//	filter the dataset based on genres
		var actions = popularity.filter(function(d) { return d.genre === "Action"; });
		var comedies = popularity.filter(function(d) { return d.genre === "Comedy"; });
		var dramas = popularity.filter(function(d) { return d.genre === "Drama"; });
		var horrors = popularity.filter(function(d) { return d.genre === "Horror"; });


		// console.log("actions: ", actions);

		// set the dimensions and margins of the graph
		var margin = {top: 20, right: 20, bottom: 30, left: 70},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

		// parse the date / time
		var parseTime = d3.timeParse("%Y");
		csv.forEach(function(d) {
			d.year = parseTime(d.year);
			d.likes = +d.likes;
		});

		// set the ranges
		var x = d3.scaleTime().range([0, width]);
		var y = d3.scaleLinear().domain([0,3200000]).range([height, 0]);
		var i = 0;
		// define the 1st line
		var valueline = d3.line()
			.x(function(d) { return x(d.year); })
			.y(function(d) { return y(d.likes); })
			.curve(d3.curveNatural);

		var svg = d3.select("p1").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

		x.domain(d3.extent(csv, function(d) { return d.year; }));

		var line_tooltip = d3.select("p1")
			.append("div")
			.attr("class", "tooltip")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden");

		// x grid
		function x_grid() {
			return d3.axisBottom(x)
			.ticks(5)
		}

		// y grid
		function y_grid() {
			return d3.axisLeft(y)
			.ticks(5)
		}

		svg.append("g")
			.attr("class", "grid")
			.attr("transform", "translate(0," + height + ")")
			.style("opacity", .1)
			.call(x_grid()
				.tickSize(-height)
				.tickFormat(""));
		svg.append("g")
			.attr("class", "grid")
			.style("opacity", .1)
			.call(y_grid()
				.tickSize(-width)
				.tickFormat(""));

		// Add the valueline path for action.
		svg.append("path")
			.data([actions])
			.attr("class", "line")
			.attr("id", "action")
			.attr("d", valueline)
			.style("stroke", "#6e6eb4")
			.on("mouseover", function(d) { return line_tooltip.style("visibility", "visible").text(d[0].genre); })
			.on("mousemove", function(){return line_tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return line_tooltip.style("visibility", "hidden");});

		// Add the valueline path for comedy.
		svg.append("path")
			.data([comedies])
			.attr("class", "line")
			.attr("id", "comedy")
			.attr("d", valueline)
			.style("stroke", "#9db5d6")
			.on("mouseover", function(d) { return line_tooltip.style("visibility", "visible").text(d[0].genre); })
			.on("mousemove", function(){return line_tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return line_tooltip.style("visibility", "hidden");});
		// Add the valueline path for drama.
		svg.append("path")
			.data([dramas])
			.attr("class", "line")
			.attr("id", "drama")
			.attr("d", valueline)
			.style("stroke", "#372D93")
			.on("mouseover", function(d) { return line_tooltip.style("visibility", "visible").text(d[0].genre); })
			.on("mousemove", function(){return line_tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return line_tooltip.style("visibility", "hidden");});

		// Add the valueline path for horror.
		svg.append("path")
			.data([horrors])
			.attr("class", "line")
			.attr("id", "horror")
			.attr("d", valueline)
			.style("stroke", "#b5d7e5")
			.on("mouseover", function(d) { return line_tooltip.style("visibility", "visible").text(d[0].genre); })
			.on("mousemove", function(){return line_tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			.on("mouseout", function(){return line_tooltip.style("visibility", "hidden");});

		// Add the X Axis
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// Add the Y Axis
		svg.append("g")
		// .attr("transform", "translate(1,0)")
			.call(d3.axisLeft(y));


		svg.append("text")
			.attr("x", width - 520)
			.attr("y", height + 30)
			.text("Year");

		svg.append("text")
			.attr("y", -70)
			.attr("x", -300)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text("Popularity (Facebook Likes)");




		// svg.append("text")
		// 	.text("Popularity of Certain Genres Over the Years")
		// 	.attr("transform", "translate(130,  0 )")
		// 	.style("font", "27px Helvetica Neue")

		var genres = ["Action", "Comedy", "Drama", "Horror"];
		var reset_button = d3.select("p1")
			.append("button")
			.attr("class", "button")
			.text("Reset")
			.on("click", function(d) {
				d3.selectAll("path").style("opacity", 1);
			})




		// Add selector
		var select2 = d3.select("p1")
			.append("select")
			.attr("class", "select")
			.attr("id", "genre_selector")
			.on("change", function(d) {
				d3.selectAll("path").style("opacity", 1);
				if (document.getElementById("genre_selector").value === "Action") {
					d3.select("#horror").style("opacity", .05);
					d3.select("#drama").style("opacity", .05);
					d3.select("#comedy").style("opacity", .05);
				}
				if (document.getElementById("genre_selector").value === "Comedy") {
					d3.select("#horror").style("opacity", .05);
					d3.select("#drama").style("opacity", .05);
					d3.select("#action").style("opacity", .05);
				}
				if (document.getElementById("genre_selector").value === "Drama") {
					d3.select("#horror").style("opacity", .05);
					d3.select("#comedy").style("opacity", .05);
					d3.select("#action").style("opacity", .05);
				}
				if (document.getElementById("genre_selector").value === "Horror") {
					d3.select("#drama").style("opacity", .05);
					d3.select("#comedy").style("opacity", .05);
					d3.select("#action").style("opacity", .05);
				}
			})

		var options = select2
			.selectAll("option")
			.data(genres)
			.enter()
			.append("option")
			.attr("id", function(d) { return d; })
			.attr("value", function(d) { return d; })
			.text(function(d) { return d; });
			// console.log(document.getElementById("genre_selector").value)

	});
