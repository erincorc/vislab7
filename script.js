//const margin = ({top: 20, right: 35, bottom: 20, left: 40})
const width = 600
const height = 600

let visType = "force"

function drag(simulation){
  
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
        .filter(event => visType === "force");
  }


d3.json('airports.json', d3.autoType).then(airports=>{

	d3.json('world-110m.json').then(worldmap=>{

        function switchLayout() {
            if (visType === "map") {
                  // stop the simulation
                  simulation.stop()
                  // set the positions of links and nodes based on geo-coordinates
                  updateNodes.transition(500).attr('cx', d => d.x = projection([d.longitude, d.latitude])[0])
                    .attr("cy", d=>d.y = projection([d.longitude, d.latitude])[1])
                 // updateNodes.transition(500).attr('cx', d => d.x = projection([d.longitude, d.latitude])[0])
        
                    linkElements.transition(500)
                        .attr("x1", d => d.source.x)
                        .attr("y1", d => d.source.y)
                        .attr("x2", d => d.target.x)
                        .attr("y2", d => d.target.y)
                  // set the map opacity to 1
                  map.transition(500).style("opacity", 1)

              } else { // force layout
                  // restart the simulation
                  simulation.restart()
                  // set the map opacity to 0
                  map.style('opacity', 0)
              }
          }

        console.log(worldmap)
        let worldmapgeo = topojson.feature(worldmap, worldmap.objects.countries)

        const projection = d3.geoMercator().fitExtent([[0,0],[width,height]], worldmapgeo)
        console.log(projection)
        let worldPath = d3.geoPath().projection(projection)

        const svg = d3.selectAll('.chart').append('svg')
            .attr("width", width)
            .attr("height", height )
            .attr("viewBox", [0,0,width,height]) 
            .append("g")
            .attr('transform', `translate(${width/16}, ${height/16})`)

        const map = svg.append("path")
            .datum(worldmapgeo)
            .attr("d", worldPath)
            .style("opacity", 0)
            .attr("fill", "LightSlateGray")
       
        svg.append("path")
            .datum(topojson.mesh(worldmap, worldmap.objects.countries))
            .attr("d", worldPath)
            .attr('fill', 'none')
            .attr('stroke', 'white')
            .attr("class", "subunit-boundary");

        const nodes = airports.nodes
        const links = airports.links
    
        const circ = d3.scaleLinear()
            .domain(d3.extent(nodes, d => d.passengers))
            .range([5,15])
            
        const colors = d3.scaleOrdinal()
            .domain(nodes)
            .range(d3.schemeAccent) 
    
        const simulation = d3.forceSimulation(nodes)
            .force('charge', d3.forceManyBody().strength(-20)) 
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link', d3.forceLink(links).distance(50))
    
        const linkElements = svg.selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            
    
        const updateNodes = svg
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', n => circ(n.passengers))
            .attr('fill', n => colors(n.name))
            .call(drag(simulation))
    

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

            d3.selectAll("input[name=choice]").on("change", event=>{
                visType = event.target.value;// selected button
                switchLayout();
            });

            

	});
});