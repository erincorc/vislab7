const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 900 - margin.left - margin.right
const height = 200 - margin.top - margin.bottom

let makePositiveX = function(nodes, i) {
    if (nodes[i].x < 0) { return -1*nodes[i].x}
    else return nodes[i].x
};

let makePositiveY = function(nodes, i) {
    if (nodes[i].y < 0) { return -1*nodes[i].y }
    else return nodes[i].y
};

d3.json('airports.json', d3.autoType).then(data => {
    console.log(data)

    const svg = d3.selectAll('.container').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const circ = d3.scaleLinear()
        .range([0,15])
        .domain(data.nodes.passengers)

    const lineScale = d3.scaleLinear()
        .range([0, width/500])

    const force = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(data.links))
        .force("center", d3.forceCenter().x(width/2).y(height/2))

    let nodes = data.nodes
    let links = data.links
    console.log(links)
    console.log(links[0].source)
    console.log(links[0].source.x)

    console.log(nodes)
    for (let i = 0; i < nodes.length; i ++) {
            console.log(makePositiveX(nodes,i))
            console.log(makePositiveY(nodes,i))
        }

    const circles = svg.selectAll('circle')
        .data(data.nodes)
        .join('circle')
        .attr('r', d => circ(d.nodes))
        .attr('cx', (d,i) => makePositiveX(nodes,i)+50)
        .attr('cy', (d,i) => makePositiveY(nodes,i)+100)
        .style('fill', 'blue')

    console.log(links)

    const lines = svg.selectAll('line')
        .data(data.links)
        .join('line')
        .attr('x1', (d, i) => links[i].source.x)
        .attr('y1', (d, i) => links[i].source.y)
        .attr('x2', (d,i) => links[i].target.x)
        .attr('y2', (d,i) => links[i].target.y)
        .attr('pathLength', 30)
        .attr('stroke', 'black')
        


})