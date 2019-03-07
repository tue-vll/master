"use strict";!function(){const t=fetch("https://data.eindhoven.nl/api/records/1.0/search/?dataset=buurten&rows=116&facet=buurtcode&facet=buurtnaam&facet=wijkcode&facet=wijknaam").then(t=>t.json()),e=fetch("https://raw.githubusercontent.com/tue-vll/data/master/Sport2017.json").then(t=>t.json()),s=fetch("https://raw.githubusercontent.com/tue-vll/data/master/Sport2006-2017.json").then(t=>t.json());Promise.all([t,e,s]).then(t=>{let e=t[0].records,s=t[1],a=t[2],r=e.length,n={type:"FeatureCollection",features:[]};for(let t=0;t<r;t++){let s={type:"Feature",geometry:{type:"Polygon",coordinates:e[t].fields.geo_shape.coordinates},properties:{neighborhood:e[t].fields.buurtnaam}};n.features.push(s)}let o=[];for(let t=0;t<n.features.length;t++){let e=n.features[t].properties;e=e.neighborhood.replace(", ",",");const a=s.filter(t=>t.Buurten==e);o.push(a[0])}for(let t=0;t<n.features.length;t++)n.features[t].properties.sports=o[t]["doet aan sport 2017"];const l=()=>{!function(){let t=new L.Map("sp-map").setView([51.46,5.45],11);L.esri.basemapLayer("Gray").addTo(t);let e=d3.geoTransform({point:function(e,s){let a=t.latLngToLayerPoint(new L.LatLng(s,e));this.stream.point(a.x,a.y)}}),s=d3.geoPath().projection(e),a=d3.select(t.getPanes().overlayPane).append("svg"),r=a.append("g").attr("class","leaflet-zoom-hide"),o=r.selectAll("path").data(n.features).enter().append("path");function l(){let t=s.bounds(n),e=t[0],l=t[1];a.attr("width",l[0]-e[0]).attr("height",l[1]-e[1]).style("left",e[0]+"px").style("top",e[1]+"px"),r.attr("transform","translate("+-e[0]+","+-e[1]+")"),o.attr("d",s).style("stroke","rgb(187,187,187)").style("stroke-width","1px").style("fill",t=>t.properties.sports>=70&t.properties.sports<80?"rgb(215,48,31)":t.properties.sports>=60&t.properties.sports<70?"rgb(252,141,89)":t.properties.sports>=50&t.properties.sports<60?"rgb(253,204,138)":t.properties.sports>=40&t.properties.sports<50?"rgb(254,240,217)":"rgb(212,212,212)").attr("class","pointer-release").style("cursor","pointer").on("mouseover",function(t){let e;d3.select(this).transition().style("opacity",.5).duration(200),e=null!==t.properties.sports?'<span class="sp-tooltip_neighbor">'+t.properties.neighborhood+'</span><span "sp-tooltip_value">'+t.properties.sports+"%</span>":'<span class="sp-tooltip_neighbor">'+t.properties.neighborhood+'</span><span "sp-tooltip_value">'+t.properties.sports+"</span>",$("#sp-tooltip").html(e).attr("aria-hidden","false").attr("width","auto").css("left",d3.event.pageX-36+"px").css("top",d3.event.pageY-220+"px")}).on("mouseout",function(){d3.select(this).transition().style("opacity",1).duration(200),$("#sp-tooltip").attr("aria-hidden","true")}),$(".datavizGrid_item_loader").attr("aria-hidden","true")}t.on("moveend",l),l()}(),function(){let t=Object.keys(a[0]).length,e=[];for(let s=0;s<a.length;s++){let r={values:[]};for(let e=0;e<t-1;e++){let t=null!==a[s][2006]&&0!==a[s][2006],n=null!==a[s][2007]&&0!==a[s][2007],o=null!==a[s][2008]&&0!==a[s][2008],l=null!==a[s][2009]&&0!==a[s][2009],p=null!==a[s][2010]&&0!==a[s][2010],i=null!==a[s][2011]&&0!==a[s][2011],d=null!==a[s][2012]&&0!==a[s][2012],c=null!==a[s][2013]&&0!==a[s][2013],u=null!==a[s][2014]&&0!==a[s][2014],h=null!==a[s][2015]&&0!==a[s][2015],g=null!==a[s][2016]&&0!==a[s][2016],f=null!==a[s][2017]&&0!==a[s][2017];t&&n&&o&&l&&p&&i&&d&&c&&u&&h&&g&&f&&(r.name="",r.name=a[s].Buurten,r.values[e]={year:Object.keys(a[s])[e],percent:a[s][Object.keys(a[s])[e]]})}void 0!==r.name&&e.push(r)}function s(t){var e=d3.select(t.node().parentNode),s=parseInt(t.style("width")),a=parseInt(t.style("height")),r=s/a;function n(){var s=parseInt(e.style("width"));t.attr("width",s),t.attr("height",Math.round(s/r))}t.attr("viewBox","0 0 "+s+" "+a).attr("perserveAspectRatio","xMinYMid").call(n),d3.select(window).on("resize."+e.attr("id"),n)}!function(){let t=e,a=30,r=26,n=80,o=40,l=parseInt(d3.select("#sp-line").style("width"))-o-r,p=parseInt(d3.select("#sp-line").style("height"))-a-n,i=parseInt(d3.select("#sp-line").style("width")),d=parseInt(d3.select("#sp-line").style("height"))-40,c=d3.timeParse("%Y");t.forEach(t=>{t.values.forEach(t=>{t.year=c(t.year),t.percent=+t.percent})});let u=d3.scaleTime().range([0,l]),h=d3.scaleLinear().range([p,0]);u.domain(d3.extent(t[0].values,function(t){return t.year})),h.domain([30,90]);let g=d3.axisBottom(u),f=d3.axisLeft(h).ticks(7).tickSize(4),m=d3.axisLeft().tickFormat("").tickSize(-l).scale(h),y=d3.select("#sp-line").append("svg").attr("height",d).attr("width",i).style("cursor","pointer").on("mouseenter",()=>{$(".spLine-group").addClass("in-active")}).on("mouseleave",()=>{$(".spLine-group").removeClass("in-active")}).call(s).attr("transform","translate(0,40)").append("g").attr("width",l).attr("height",p).attr("transform","translate("+o+","+a+")");y.append("g").attr("class","grid").call(m);let v=d3.line().x(t=>u(t.year)).y(t=>h(t.percent));y.append("g").attr("class","spLines").selectAll(".spline-group").data(t).enter().append("g").attr("class","spLine-group").append("path").attr("class","line").attr("d",t=>v(t.values)).on("mouseover",function(t){this.parentNode.appendChild(this),d3.select(this).classed("active",!0);let e='<span class="spL-tooltip_neighbor">'+t.name+"</span>";$("#spL-tooltip").html(e).attr("aria-hidden",!1).attr("width","auto").attr("height","100px").css("left",d3.event.pageX-470+"px").css("top",d3.event.pageY-200+"px")}).on("mouseout",function(){d3.select(this).classed("active",!1),$("#spL-tooltip").attr("aria-hidden",!0).attr("width","auto").attr("height","auto").css("left",d3.event.pageX-460+"px").css("top",d3.event.pageY-240+"px")}),y.append("g").attr("class","spL-xAxis").attr("transform","translate(0,"+p+")").call(g),y.append("g").attr("class","spL-yAxis").call(f).call(t=>t.select(".domain").remove()),y.append("text").attr("y",-20).attr("x",0).attr("dy","1em").style("text-anchor","middle").text("percent").style("font-size","10px").style("font-weight","bold")}()}()};$(document).ready(()=>{l()})})}();