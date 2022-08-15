let categorySearchValue = "";
//Map view setup
require([
	"esri/config",
	"esri/Map",
	"esri/views/MapView",
	"esri/rest/locator",
	"esri/Graphic",
	"esri/rest/route",
	"esri/rest/support/RouteParameters",
	"esri/rest/support/FeatureSet"
], (esriConfig, Map, MapView, locator, Graphic, route, RouteParameters, FeatureSet) => {

	esriConfig.apiKey = "AAPK2cc14671cd5d44fda5415221fc29213dVhK79LmcF26YEBf7iNaMrQtBb_tqiIkNdYmnKsVx9UDi10YzgPfiJ88pIcZgoEHe";

	const map = new Map({
		basemap: "arcgis-navigation" //Basemap layer services: https://developers.arcgis.com/documentation/mapping-apis-and-services/visualization/basemap-styles/
	});

	const view = new MapView({
		container: "map",
		map: map,
		center: [-122.431297, 37.773972],
		zoom: 13
	});
	//** for the nearby stores to show on the map **//
	view.popup.actions = [];

	view.when(() => {
		findPlaces(view.center);
	});

	//--------------------------------ROUTING STUFF
	const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

	const startNav = document.querySelector("#startNavBtn");
	startNav.addEventListener("click", (e) => {
		startNavigation();
	});

	function startNavigation() {
		view.on("click", function(event) { //click handler for routing 																				
			console.log("inside routing click handler");
			if (view.graphics.length === 0) {
				addGraphic("origin", event.mapPoint);
			} else if (view.graphics.length === 1) {
				addGraphic("destination", event.mapPoint);
				getRoute();
			} else {
				view.graphics.removeAll();
				addGraphic("origin", event.mapPoint);
			}
		});

		function addGraphic(type, point) {

			const graphic = new Graphic({
				symbol: {
					type: "simple-marker",
					color: (type === "origin") ? "white" : "black",
					size: "8px",

				},
				geometry: point

			});
			view.graphics.add(graphic);
		};

		function getRoute() {
			const routeParams = new RouteParameters({
				stops: new FeatureSet({
					features: view.graphics.toArray()
				}),
				returnDirections: true
			});


			route.solve(routeUrl, routeParams).then(function(data) {
				data.routeResults.forEach(function(result) {
					result.route.symbol = {
						type: "simple-line",
						color: [5, 150, 255],
						width: 3
					};
					view.graphics.add(result.route);
				});
				if (data.routeResults.length > 0) {
					const directions = document.createElement("ol");
					directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
					directions.style.marginTop = "0";
					directions.style.padding = "15px 15px 15px 30px";
					const features = data.routeResults[0].directions.features;


					features.forEach(function(result, i) {
						const direction = document.createElement("li");
						direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
						directions.appendChild(direction);
					});

					view.ui.empty("top-right");
					view.ui.add(directions, "top-right");
				}//added

			});

		}//added
	}//added


	//reset map button stuff
	const resetButton = document.querySelector("#endNavBtn");
	resetButton.addEventListener("click", async (e) => {// view.graphics.removeAll();// view.ui.empty("top-right");
		console.log("end nav button clicked");
		window.location.reload();
	});

	//---------------------------end of routing stuff

	//---------------------------CATEGORY SEARCH FUNCTIONS
	//---------------------------find stores 
	function findPlaces(pt) {
		const geocodingServiceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

		const params = {
			categories: [categorySearchValue],
			location: pt,  // Paris (2.34602,48.85880)
			outFields: ["PlaceName", "Place_addr"],
			maxLocations: 10
		};

		locator.addressToLocations(geocodingServiceUrl, params).then((results) => {
			showResults(results);
		});

	};
	//---------------------------show stores function
	function showResults(results) {

		view.popup.close();
		view.graphics.removeAll();

		results.forEach((result) => {
			view.graphics.add(
				new Graphic({
					attributes: result.attributes,
					geometry: result.location,
					symbol: {
						type: "simple-marker",
						color: "red",
						size: "12px",
						outline: {
							color: "#2B2D42",
							width: "2px"
						}
					},
					popupTemplate: {
						title: "{PlaceName}",
						content: "{Place_addr}" + "<br><br>" + result.location.x.toFixed(5) + "," + result.location.y.toFixed(5)
					}
				}));
		});

		if (results.length) {
			const g = view.graphics.getItemAt(0);
			view.popup.open({
				features: [g],
				location: g.geometry
			});
		}
	}

	//---------------------------query selectors
	const dropdownCategory = document.querySelectorAll(".dropdownItem");
	const autoDropdown = document.querySelector("#autoDropdown");
	const activityDropdown = document.querySelector("#activityDropdown");
	const beautyDropdown = document.querySelector("#beautyDropdown");
	const clothesDropdown = document.querySelector("#clothesDropdown");
	const financeDropdown = document.querySelector("#financeDropdown");
	const foodDropdown = document.querySelector("#foodDropdown");
	const medicalDropdown = document.querySelector("#medicalDropdown");
	const homeDropdown = document.querySelector("#homeDropdown");
	const storeDropdown = document.querySelector("#storeDropdown");

	//----------------------dropdown category item event listener
	//----------------------when specific category eg. ATM is chosen->show locations on map
	dropdownCategory.forEach((category) => {
		category.addEventListener("click", async (e) => {
			console.log("button clicked");
			categorySearchValue = category.textContent;
			findPlaces(view.center);
		});
	});

	/* When the user clicks on the button, 
	toggle between hiding and showing the dropdown content */
	autoDropdown.addEventListener("click", (e) => {
		document.getElementById("autoDropdownMenu").classList.toggle("show");
	});
	activityDropdown.addEventListener("click", (e) => {
		document.getElementById("activityDropdownMenu").classList.toggle("show");
	});
	beautyDropdown.addEventListener("click", (e) => {
		document.getElementById("beautyDropdownMenu").classList.toggle("show");
	});
	clothesDropdown.addEventListener("click", (e) => {
		document.getElementById("clothesDropdownMenu").classList.toggle("show");
	});
	financeDropdown.addEventListener("click", (e) => {
		document.getElementById("financeDropdownMenu").classList.toggle("show");
	});
	foodDropdown.addEventListener("click", (e) => {
		document.getElementById("foodDropdownMenu").classList.toggle("show");
	});
	medicalDropdown.addEventListener("click", (e) => {
		document.getElementById("medicalDropdownMenu").classList.toggle("show");
	});
	homeDropdown.addEventListener("click", (e) => {
		document.getElementById("homeDropdownMenu").classList.toggle("show");
	});
	storeDropdown.addEventListener("click", (e) => {
		document.getElementById("storeDropdownMenu").classList.toggle("show");
	});

	// Close the dropdown if the user clicks outside of it
	window.onclick = function(event) {
		if (!event.target.matches('.dropdownTriggerBtn')) {
			var dropdowns = document.getElementsByClassName("dropdownContent");
			var i;
			for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('show')) {
					openDropdown.classList.remove('show');
				}
			}
		}
	}

});

