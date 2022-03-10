import * as d3 from 'd3';

// Manipuler le DOM
let svg = d3.select('body')
    .append('svg')
    .attr('width', '300')
    .attr('height', '300')

let g1 = svg.append('g')
let c1 = g1.append('circle')
    .attr('class', 'c1')
    .attr('cx', '50')
    .attr('cy', '50')
    .attr('r', '40')

let g2 = svg.append('g')
let c2 = g2.append('circle')
    .attr('class', 'c2')
    .attr('cx', '150')
    .attr('cy', '150')
    .attr('r', '40')

let g3 = svg.append('g')
let c3 = g3.append('circle')
    .attr('class', 'c3')
    .attr('cx', '250')
    .attr('cy', '250')
    .attr('r', '40')

// Attributs
c2.attr('fill', 'red')
c1.attr("transform", "translate(50,0)")
c2.attr("transform", "translate(50,0)")

// Text Append
let t1 = g1.append('text')
    .text('Cercle')
    .attr('transform', 'translate(80,100)')
let t2 = g2.append('text')
    .text('Cercle')
    .attr('transform', 'translate(180,200)')
let t3 = g3.append('text')
    .text('Cercle')
    .attr('transform', 'translate(230,300)')

// Evenements
let clicked = false
c3.on('click', () => {
    if(!clicked){
        g1.transition().attr('transform', 'translate(150,0)')
        g2.transition().attr('transform', 'translate(50,0)')
        clicked = true
    }else{
        g1.transition().attr('transform', 'translate(0,0)')
        g2.transition().attr('transform', 'translate(0,0)')
        clicked = false
    }
    
})

// Données
const data = [20, 5, 25, 8, 15]

let svgData = d3.select('body')
    .append('svg')
    .attr('width', '300')
    .attr('height', '300')

let gData = svgData.append('g')
    .attr('transform', 'translate(30,0)')

gData.selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * 30)
    .attr('y', (d, i) => 300-d)
    .attr('width', 20)
    .attr('height', d => d)
    .attr('fill', 'black')