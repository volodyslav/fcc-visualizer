import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const container = document.querySelector("#container");

const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"


const dataFetch = async () => {
    try{
        const response = await fetch(URL)
        const data = await response.json()
        console.log(data.data)
        barChart(data.data)
    }catch(e){
        console.error(e)
    }
}

dataFetch()

function getQuarter(month){
    switch(month){
        case 0:
            return "Q1"
        case 3:
            return "Q2"
        case 6:
            return "Q3"
        case 9:
            return "Q4"
        default:
            return "Q"
    }
}


function barChart(data){

    data.forEach(d => {
        d[0] = new Date(d[0])
        d[1] = +d[1]
    })
    const width = 800;
    const height = 500;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;
    
    const x = d3.scaleUtc()
        .domain([new Date("1947"), new Date("2016")])
        .range([marginLeft, width - marginRight]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([height - marginBottom, marginTop ]);
    
    const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("background-color", "rgba(34, 34, 56, 0.9)")
        .style("color", "#fff")
        .style("padding", "1rem")
        .style("border-radius", "10px")
        

    svg.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 1 / 2)
        .text("Year")

    svg.append("text")
        .attr("class", "axis-title")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2 )
        .attr("y", marginLeft - 30)
        .text("GDP")


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("width", width / data.length)
        .attr("height", d => height - marginBottom - y(d[1]))
        .style("fill", "rgb(62, 146, 194)")
        .attr("data-date", d => `${d[0].getFullYear()}-${d[0].getDay() < 9 ? "0" + d[0].getDay() : d[0].getDay()}-${d[0].getMonth() < 9 ? "0" + d[0].getMonth() :  d[0].getMonth()}`)
        .attr("data-gdp", d => d[1])

    svg.selectAll(".bar")
        .on("mouseenter", (e, d) => {
            d3.select(this).style("opacity", 0.7);
            
            tooltip.style("opacity", 0.9)
                .html(`<strong>Date:</strong> ${d[0].getFullYear()} ${getQuarter(d[0].getMonth())} <br><strong>GDP:</strong> ${d[1]}`)
                .style("left", (e.pageX + 20) + "px")
                .style("top", (e.pageY - 10) + "px")
                .attr("data-date", d[0].toISOString())
        })

        .on("mouseleave", () => {
            d3.select(this).style("opacity", 1);
            tooltip.style("opacity", 0)
    
        })

    svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .attr("id", "x-axis")
            .attr("class", "tick")
            .call(d3.axisBottom(x));
    
    svg.append("g")
            .attr("id", "y-axis")
            .attr("class", "tick")
            .attr("transform", `translate(${marginLeft }, 0)`)
            .call(d3.axisLeft(y))
    
   
    container.appendChild(svg.node())
}
