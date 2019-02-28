(function(){

	////////////////////////////// loader ////////////////////////////////////////////////////

	// Setup loader to make D3 SVG layer being rendered by designed order through cross browsers

	var loader = {
	    queue: [],
	    push: function(fn, scope, params) {
	        this.queue.push(function() {
	            fn.apply(scope || window, params || []);
	        });
	    },
	    run: function() {
	        if (this.queue.length) this.queue.shift().call();
	    }
	};


	//url /path for data
	const nb_url = 'https://data.eindhoven.nl/api/records/1.0/search/?dataset=buurten&rows=116&facet=buurtcode&facet=buurtnaam&facet=wijkcode&facet=wijknaam';
	//const nb_url_off = '/assets/data/nb.json'; for off line
	const sport_path = '/assets/data/Sport2017.json';

	// const urls = ['url', 'url', ...];

	// Control the order of fetching data and return them as a json
	const apiRequest1 = fetch(nb_url).then(function(response){ 
	    return response.json()
	});
	const apiRequest2 = fetch(sport_path).then(function(response){
	         return response.json()
	});

	Promise.all([apiRequest1,apiRequest2]).then(function(data){
    //console.log(data[0]); // 
    //console.log(data[1]);
    //.
    //.
    //.

    // Leave notes for the methods to fetch all url at once (didn't work for this particular case)
	// Promise.all(urls.map(url =>
	// 	fetch(nb_url).then(response => {
	// 		//request failed
 // 			if (response.status !== 200) {
 // 				console.log('There was a problem. Status Code: ' +
 // 				response.status);
 // 					return;
 // 			}

 // 			// success
 //    		return response.json().then(data => {
 //        		console.log(JSON.stringify(data));
 //        		//do something here
 //        	})
 //    		// error
 //        	.catch(err => {
 //   				console.log('Fetch Error :-S', err);
 //  			})
 //  		});
 //  	});	


        let nbData = data[0].records; // Retrieve data covering to geojson from neighborhood polygon data of Eindhoven   
        //console.log(JSON.stringify(data[0].records));
        
        let spData = data[1]; //Sports participation data (percent) of each neighborhood in Eindhoven
        
        let dataLength =  nbData.length; // Define array length for loop 
        //console.log(dataLength); // Check data length (numbers of neighborhoods)

        let nbGeojson = {}; // Create container for making geojson 
			nbGeojson['type'] = 'FeatureCollection';
			nbGeojson['features'] = [];

		//console.log(JSON.stringify(nbData[0].fields.geo_shape.coordinates)); // Check if this point to the property of coordinates for polygon 

		// Create geojson 
    	for (let i = 0; i < dataLength; i++) { // 116 > data.lenght

			let newFeature = {
		    	"type": "Feature",
		    	"geometry": {
		        	"type": "Polygon",
		        	"coordinates": nbData[i].fields.geo_shape.coordinates // Adding lon/lat coordinates
		    	},
		    	"properties": {
		        	"neighborhood": nbData[i].fields.buurtnaam // adding neighborhood names 
		    	}
			};
			nbGeojson['features'].push(newFeature); //Push each object to geojson's features' property
    	}
	    
	    let properties_sp = []; // create empty array to push the loop output
    	
		for (let i = 0; i < nbGeojson.features.length; i++) {
			let id = nbGeojson.features[i].properties;
		    	id = id.neighborhood.replace(', ', ','); // remove the space after comma for matching purpose
		    	//console.log(id);
		    
		    // This enables filtering matched sports data with nbGeojson data, which is returned by order of matching (the neighborhood order in nbGeojson)
		    const sp_filter = spData.filter(function(value) {
		    	// return single array by the 
		    	return value.Buurten ==  id;
			});
		   	properties_sp.push(sp_filter[0]); //push the content of array
		};

		//Add sports participation data to nbGeojson
		for (let i = 0; i < nbGeojson.features.length; i++) {
			const spdata = nbGeojson.features[i].properties['sports'] = properties_sp[i]['doet aan sport 2017'];
			//console.log(spdata)
		}

		const vitalityData = {
			dataViz: function(){
				
				//const sportsMap = function() {
				function sportsMap(){

					// confirm if nbGeojson is updated with containing sports participation data
					console.log(nbGeojson.features);

					//Initiate map using Leaflet 
			    	let map = new L.Map('sp-map').setView([51.46, 5.450], 11); //*Leaflet uses lat long / original set:[51.4400, 5.4750]
					L.esri.basemapLayer("Gray").addTo(map);

					// Adjust coordinate system to Leaflet
					function projectPoint(x, y) {
		            	let point = map.latLngToLayerPoint(new L.LatLng(y, x));
		            	this.stream.point(point.x, point.y);
		    		};
		    		// Transform positions
		    		let transform = d3.geoTransform({point: projectPoint}),
			        	path = d3.geoPath().projection(transform);

					let svg = d3.select(map.getPanes().overlayPane).append("svg");
		            let g = svg.append("g").attr("class", "leaflet-zoom-hide");
		            					
		            let feature = g.selectAll("path")
		                    		.data(nbGeojson.features)
		                    		.enter()
		                    		.append("path");

		            map.on("moveend", reset);
		            reset();

		            // Reposition the SVG to cover the features.
		            function reset() {
		                let bounds = path.bounds(nbGeojson),
		                    topLeft = bounds[0],
		                    bottomRight = bounds[1];

			            svg.attr("width", bottomRight[0] - topLeft[0])
			               .attr("height", bottomRight[1] - topLeft[1])
			               .style("left", topLeft[0] + "px")
			               .style("top", topLeft[1] + "px");

			            g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

			            feature.attr("d", path)
			                   .style("stroke", "rgb(187,187,187)") //#bbbbbb
			                   .style("stroke-width", "1px")
			                   .style("fill", function(d, i) {
			                   		if (d.properties.sports >= 70 & d.properties.sports < 80) { 
			                            return "rgb(215,48,31)"
			                        } else if (d.properties.sports >= 60 & d.properties.sports < 70) { 
			                            return "rgb(252,141,89)"
			                 		} else if (d.properties.sports >= 50 & d.properties.sports < 60) { 
			                            return "rgb(253,204,138)"
			                        } else if (d.properties.sports >= 40 & d.properties.sports < 50) { 
			                            return "rgb(254,240,217)"
			                        } else {
			                            return "rgb(212,212,212)" //#d4d4d4
			                        }
			                    })
			                  	.attr("class", "pointer-release") // Release leaflet's css pointer-event:none
			                  	.on("mouseover", function(d){
			                  		d3.select(this)
                            			.style("cursor", "pointer")
                            			.transition()
                           				.style("opacity", 0.5)
                           				.duration(200);

                           				let info;
                           				if (d.properties.sports != null) {
                           					info = '<span class="sp-tooltip_neighbor">' + d.properties.neighborhood + '</span><span "sp-tooltip_value">' + d.properties.sports + "%</span>";
                           				} else {
                           					info = '<span class="sp-tooltip_neighbor">' + d.properties.neighborhood + '</span><span "sp-tooltip_value">' + d.properties.sports + "</span>";
                           				}

                           				$("#sp-tooltip").html(info)
                           								.attr("aria-hidden","false")
                           								.attr("width", "auto")
                           								.css("left", (d3.event.pageX - 36) + "px")		
						            					.css("top", (d3.event.pageY - 220) + "px");	
			                  	})
           						.on("mouseout", function(d){
           							d3.select(this)
           								.transition()
                           				.style("opacity", 1)
                           				.duration(200);
                           				//let text = "<span><strong>" + d.properties.neighborhood + "</strong></span><br/><span>" + d.properties.sports + "</span>";
                           				$("#sp-tooltip").attr("aria-hidden","true");
           						});
			                   	
			               //     	function handleMouseOver(d) {  // Add interactivity
						            // // Use D3 to select element, change color and size
						            // d3.select(this)
						            //   .style("cursor", "pointer")
                  //           		  .style("opacity", 0.5);

                  //           		let text = "<span><strong>" + d.properties.neighborhood + "</strong></span><br/><span>" + d.properties.sports + "</span>";
                  //     //       		$("#sp-tooltip").show()
                  //     //       			.transition()		
						            //     // .duration(200)		
						                

						            // $("#sp-tooltip").html(text)
						            // 	.style("opacity", .9);	
						            //     // .style("left", (d3.event.pageX) + "px")		
						            //     // .style("top", (d3.event.pageY - 28) + "px");	
						            // };
            // Specify where to put label of text
          //   svg.append("text").attr({
          //      id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
          //       x: function() { return xScale(d.x) - 30; },
          //       y: function() { return yScale(d.y) - 15; }
          //   })
          //   .text(function() {
          //     return [d.x, d.y];  // Value of the text
          //   });
          // }
			             

						

                 	}// function reset
				} sportsMap();//function sportsMap
            } //function dataViz
		};
		$(document).ready(function () {
          	vitalityData.dataViz();　　
      	});
    	
    }); //Close function data (Promise all)  
	
})(); // Execute untitled function (Immediately Invoked Function Expression)

