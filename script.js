const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 900 - margin.left - margin.right
const height = 200 - margin.top - margin.bottom

d3.json('airports.json', d3.autoType).then(data => {
    console.log(data)

    const svg = d3.selectAll('.container').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const circ = d3.scaleLinear()
        .range([0,15])

    const force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(data.links))
        .force("center", d3.forceCenter().x(width/2).y(height/2))

    let nodes = data.nodes
    let links = data.links

    const circles = svg.selectAll('circle')
        .data(data.nodes)
        .enter()
        .attr('r', d => circ(d.nodes))

})