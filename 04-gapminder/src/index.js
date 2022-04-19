import * as d3 from 'd3'

// Pour importer les données
import gdp from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import lifeExpectancy from '../data/life_expectancy_years.csv'
import population from '../data/population_total.csv'
/* import dataCoord from '../data/dataCoord.geojson' */

d3.select('body').append('h1').text('Exercice 4')
/////////////////////////////////////////////////////////////// EXERCICE 1
//TITRE
d3.select('body').append('h3').text('Graphique Statique')

d3.select("body")
    .append("div")
    .attr('id', 'graph')

let margin = { top: 10, right: 20, bottom: 30, left: 50 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Générer une taille d'axe X cohérente
let theBiggestGDP = 0;
gdp.forEach(pays => {
    let gdpAnneeCourante = pays['2021'];
    if (typeof gdpAnneeCourante === 'string') {
        gdpAnneeCourante = strToInt(pays['2021']);
    }
    pays['2021'] = gdpAnneeCourante;

    // Générer une taille d'axe X cohérente
    if (pays['2021'] >= theBiggestGDP) {
        theBiggestGDP = pays['2021'];
    }
});

// Add X axis
let x = d3.scaleLinear()
    .domain([0, theBiggestGDP * 1.05])
    .range([0, width]);
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Générer une taille d'axe Y cohérente
let theBiggestLifeExp = 0;
let theSmallestLifeExp = 0;
lifeExpectancy.forEach(pays => {
    if (pays['2021'] >= theBiggestLifeExp) {
        theBiggestLifeExp = pays['2021'];
    }
    theSmallestLifeExp = theBiggestLifeExp;
    if (pays['2021'] <= theSmallestLifeExp) {
        theSmallestLifeExp = pays['2021'];
    }
    if (pays['2021'] === null && pays['2020'] !== null) {
        pays['2021'] = pays['2020'];
    } else if (pays['2021'] === null && pays['2020'] === null) {
        pays['2021'] = pays['2019'];
    }
})

// Add Y axis
let y = d3.scalePow()
    .exponent(1.5)
    .domain([0, theBiggestLifeExp * 1.1])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));

population.forEach(pays => {
    let popAnneeCourante = pays['2021'];
    if (typeof popAnneeCourante === 'string') {
        popAnneeCourante = strToInt(pays['2021']);
    }
    pays['2021'] = popAnneeCourante;
});

// Add a scale for bubble size
let z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([5, 60]);

// Add dots
svg.append('g')
    .selectAll("dot")
    .data(gdp)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d["2021"]); })
    .attr("r", 10)
    .style("fill", `#${Math.floor(Math.random() * 16777215).toString(16)}`)
    .style("opacity", "0.7")
    .attr("stroke", "black")

svg.selectAll("circle").data(lifeExpectancy).join()
    .attr("cy", function (d) { return y(d["2021"]); })

svg.selectAll("circle").data(population).join()
    .attr("r", function (d) { return z(d["2021"]); })

function strToInt(nb) {
    let multi;
    let number
    if (nb.slice(-1) === 'k') {
        multi = 1000;
        // console.log(gdpAnneeCourante + " ; c'est un k");
        number = nb.split('k')[0];
    } else if (nb.slice(-1) === 'M') {
        multi = 1000000;
        // console.log("c'est un M");
        number = nb.split('M')[0];
    } else if (nb.slice(-1) === 'B') {
        multi = 1000000000;
        // console.log("c'est un M");
        number = nb.split('B')[0];
    } else {
        // console.log('ça beug');
    }
    number = parseInt(number * multi);
    return number;
};

//////////////////////////////////////////////EXERCICE 2
//Carte choroplète
d3.select('body').append('h3').text('Carte Choroplète')

let svgChoro = d3.select('body').append('svg').attr('width', '1000').attr('height', '600'),
    widthChoro = +svgChoro.attr("width"),
    heightChoro = +svgChoro.attr("height");

let projectionChoro = d3.geoMercator()
    .scale(70)
    .center([0, 20])
    .translate([widthChoro / 2, heightChoro / 2]);

// Data and color scale
let colorScaleChoro = d3.scaleThreshold()
    .domain([50, 60, 70, 80, 90, 100])
    .range(randomScheme()[7]);

// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (d) {
    // Draw the map
    svgChoro.append("g")
        .selectAll("path")
        .data(d.features)
        .join("path")
        .attr("fill", function (d) {
            let color = ''
            lifeExpectancy.forEach(pays => {
                if (d.properties.name == 'USA') console.log(d.properties.name)
                if (pays['country'] == d.properties.name) {
                    color = colorScaleChoro(pays['2021'])
                }
            })
            return color
        })
        .attr("d", d3.geoPath()
            .projection(projectionChoro)
        )
})

function randomScheme() {
    switch (Math.floor(Math.random() * 5)) {
        case 0:
            return d3.schemeOranges
        case 1:
            return d3.schemeBlues
        case 2:
            return d3.schemeYlOrRd
        case 3:
            return d3.schemeRdPu
        case 4:
            return d3.schemeReds
    }
}

/////////////////////////////////////////EXERCICE 3
