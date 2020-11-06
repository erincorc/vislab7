//const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 500
const height = 500

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

    const svg = d3.selectAll('.chart').append('svg')
        .attr("width", width)
        .attr("height", height )
        .attr("viewBox", [0,0,width,height]) 
        .append("g")
        .attr('transform', `translate(${width/16}, ${height/16})`)

    let pass = [] // list of passengers
    for (let i = 0; i < data.nodes.length; i++) {
        pass.push(data.nodes[i].passengers)
    }    
   
    const nodes = data.nodes
    const links = data.links
    console.log(links)

    const circ = d3.scaleLinear()
        .domain(d3.extent(nodes, d => d.passengers))
        .range([10,20])
        
    const lineScale = d3.scaleLinear()
        .range([0,width/20])

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-20)) 
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('link', d3.forceLink(links).distance(70))

    const updateNodes = svg //.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', n => circ(n.passengers))
    //    .attr('cx', n => n.x)
    //    .attr('cy', n => n.y)

    const linkElements = svg.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', 1)
        .attr('stroke', 'black')
    /*    .attr('x1', data => data.nodes[data.links.source].x)
        .attr('y1', data => data.nodes[data.links.source].y)
        .attr('x2', data => data.nodes[data.links.target].x)
        .attr('y2', data => data.nodes[data.links.target].y) */
        .attr('stroke-width', 1)

    // TOOLTIP
    let tool = d3.selectAll('circle')
        .on("mouseenter", (event, nodes) => {
            let n = nodes;
            const pos = d3.pointer(event, window)
            d3.select('.tooltip')
                .style('display', 'inline-block')
                .style('position', 'fixed')
                .style('left', pos[0]+10+'px')
                .style('top', pos[1]+5+'px')
                .html(n.name)
        })
        .on("mouseleave", (event, nodes) => {
            d3.select('.tooltip')
                .style('display', 'none')
        })

    console.log('links', links)
    console.log('nodes', nodes)
    simulation.on("tick", function(){
        updateNodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
        linkElements
            .attr('x1', function(links) {return links.source.x})
            .attr('y1', function(links) {return links.source.y})
            .attr('x2', function(links) {return links.target.x})
            .attr('y2', function(links) {return links.target.y})
        }) 
})
