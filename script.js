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
        .attr("transform", `translate(${width/16}, ${width/16})`)

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

    const simulation = d3.forceSimulation()
        .force('charge', d3.forceManyBody().strength(-20)) 
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('link', d3.forceLink()
            .id(link => link.id)
            .strength(link => link.strength))

    const updateNodes = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', nodes => circ(nodes.passengers))

    const linkElements = svg.append('g')
        .selectAll('line')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', data => data.nodes[data.links.source].x)
        .attr('y1', data => data.nodes[data.links.source].y)
        .attr('x2', data => data.nodes[data.links.target].x)
        .attr('y2', data => data.nodes[data.links.target].y)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)


    simulation.nodes(nodes).on('tick', () => {
        updateNodes
            .attr("cx", node => node.x)
            .attr("cy", node => node.y)
        })

    console.log(links)
    console.log(nodes.map(n => n.x))

    // TOOLTIP

    let tool = d3.selectAll('circle')
        .on("mouseenter", (event, nodes) => {
            let n = nodes;
            const pos = d3.pointer(event, window)
            d3.select('.tooltip')
                .style('display', 'inline-block')
                .style('position', 'fixed')
                .style('left', pos[0]+5+'px')
                .style('top', pos[1]+5+'px')
                .html(n.name)
        })
        .on("mouseleave", (event, nodes) => {
            d3.select('.tooltip')
                .style('display', 'none')
        })

    

 /*   const lines = svg.selectAll('line')
        .data(data.links)
        .join('line')
        .attr('x1', (d, i) => links[i].source.x)
        .attr('y1', (d, i) => links[i].source.y)
        .attr('x2', (d,i) => links[i].target.x)
        .attr('y2', (d,i) => links[i].target.y)
        .attr('pathLength', 30)
        .attr('stroke', 'black') */
        


})
