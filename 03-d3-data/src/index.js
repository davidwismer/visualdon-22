import * as d3 from 'd3';
import { json } from 'd3-fetch';

Promise.all([
    json('https://jsonplaceholder.typicode.com/posts'),
    json('https://jsonplaceholder.typicode.com/users')
])
    .then(([postsTab, usersTab]) => {
        //Nb posts par utilisateur
        d3.select('body').append('section').attr('class', 'nbPosts')
        d3.select('.nbPosts').append('h2').text('Nombres de posts par users')
        usersTab.forEach(user => {
            let userDiv = d3.select('.nbPosts').append('div').attr('class', 'user')
            let nbPost = 0

            postsTab.forEach(post => {
                if (post.userId == user.id) {
                    nbPost++
                }
            })
            userDiv.text(user.name + ' a ' + nbPost + ' posts.')
        })

        //User avec texte le plus long
        d3.select('body').append('section').attr('class', 'textLong')
        d3.select('.textLong').append('h2').text('User avec le texte le plus long')
        let userMore = ''
        let textMore = 0
        usersTab.forEach(user => {
            let textLength = 0
            postsTab.forEach(post => {
                if (user.id == post.id) {
                    if (post.body.length > textLength) {
                        textLength = post.body.length
                    }
                }
            })
            if (textLength > textMore) {
                textMore = textLength
                userMore = user.name
            }
            textLength = 0
        })
        d3.select('.textLong').append('div').text(userMore + ' a écrit le texte le plus long.')

        //Dessiner graphique en baton
        d3.select('body').append('h2').text('Graph du nombre de posts par utilisateurs')
        //set les marges pour le svg du graph
        let margin = { top: 30, right: 30, bottom: 80, left: 60 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        let svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        let userName = []
        usersTab.forEach(user => {
            userName.push(user.name)
        })
        //axe des x
        let x = d3.scaleBand()
            .range([0, width])
            .domain(userName)
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        //axe des y
        let y = d3.scaleLinear()
            .domain([0, 15])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));
        // Bars
        let randomColor = Math.floor(Math.random()*16777215).toString(16)
        usersTab.forEach(user => {
            let nbpost = 0
            postsTab.forEach(post => {
                if (post.userId == user.id) {
                    nbpost++
                }
            })
            svg.append("rect")
                .attr("x", x(user.name))
                .attr("y", y(nbpost))
                .attr("width", x.bandwidth())
                .attr("height", height-y(nbpost))
                .attr("fill", `#${randomColor}`)
        })

    }).catch((error) => {
        console.log(error)
    })