let KickstarterPledgesUrl = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
let MovieSalesUrl = " https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
let VideoGameSalesUrl = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip");

// get video game data and display treemap
function videoGameData() {
    showTree(VideoGameSalesUrl, "Video Games Sales", "Top 100 Most Sold Video Games Grouped by Platform");
}
// get movie data and display treemap
function movieData() {
    showTree(MovieSalesUrl, "Movie Sales", "Top 100 Highest Grossing Movies Grouped By Genre");
}
// get kick statrt data and display treemap
function kickstarterData() {
    showTree(KickstarterPledgesUrl, "Kickstarter Pledges", "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category");
}

// get data from given url and display treemap with a title and descrition
function showTree(url, treeTitle, description) {
    var width = 960,
        height = 570;

    d3.json(url, function (data) {

        // console.log(data);
        d3.select("#title").text(treeTitle);
        d3.select("#description").text(description);

        // remove any previous map generated
        d3.selectAll("#myTreemap").remove();

        var color = d3.scaleOrdinal()
            .range(d3.schemeCategory20
                // .map(function (c) { c = d3.rgb(c); c.opacity = 0.8; return c; }));

                .map(function (c) { c = d3.rgb(c); return c; }));

        // Creates a new treemap layout with settings for width, height and padding.  
        var treemap = d3.treemap()
            .size([width, height])
            .padding(0);

        // Constructs a root node
        var root = d3.hierarchy(data)
            // Evaluates the specified value function for this node and each descendant in post-order traversal, and returns this node
            .sum(d => d.value)
            // Sorts the children of this node, if any, and each of this node’s descendants’ children, in pre-order traversal using the specified compare function, and returns this node.
            .sort((a, b) => b.height - a.height || b.value - a.value)

        // Runs the treemap layout, returning the array of nodes associated with the specified root node
        treemap(root);

        // create a svg to display the treemap
        let svg = d3.select('body').append("svg").attr("id", "myTreemap")
            .attr("width", width)
            .attr("height", height);

        // console.log(root.leaves());

        // for each leaf of the tree create a group to contain rectangle and text 
        let leaves = svg
            .selectAll("g")

            .data(root.leaves())
            .enter()
            .append("g")
            .attr("class", "group")
            .attr("height", function (d) { return d.y1 - d.y0; })
            .attr("width", function (d) { return d.x1 - d.x0; })
            .attr('transform', function (d) { return 'translate(' + [d.x0, d.y0] + ')' })
        // for each leaf's group append a rectange with color based on parent and size based on treemap, 
        // attach data attributes for name, category, and value
        leaves
            .append("rect")
            .attr("class", "tile")
            .attr("data-name", function (d) { return d.data.name; })
            .attr("data-category", function (d) {
                return d.parent.data.name;
            })
            .attr("data-value", function (d) { return d.value; })
            .attr("height", function (d) { return d.y1 - d.y0; })
            .attr("width", function (d) { return d.x1 - d.x0; })
            .attr("fill", d => color(d.parent.data.name))

            // when mouse moves over rect display tooltip for rect
            .on("mouseover", function () {
                tooltip.style("display", "inline");
            })
            // on mouse move, move tooltip
            .on("mousemove", function (d) {
                tooltip
                    .html("Name: " + d.data.name + "<br/> Category: " + d.parent.data.name + "<br/> Value:" + d.value)
                    .attr("data-value", d.value)
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 12) + "px");
            })
            // when mouse leaves rect change display to none
            .on("mouseout", function () {
                tooltip.style("display", "none");
            })
        // for each leaf's group append a textbox with leaf's name  
        leaves
            .append("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", 20)
            .attr("y", 20)

        leaves.selectAll('text')
            .selectAll("tspan.text")
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
            .enter()
            .append("tspan")
            .attr("class", "text")
            .text(d => d)
            .attr("x", 1)
            .attr("dx", 0)
            .attr("dy", 10);

        let legendVals = root.children.map(d => d.data.name);

        var svgw = 600;
        var svgh = 1000;

        d3.selectAll("#myLegend").remove();

        let svgLegend = d3.select('body')
            .append("svg")
            .attr("transform", "translate(0," + 0 + ")")
            .attr("id", "myLegend")

            .attr("width", svgw)
            .attr("height", svgh);

        const boxSize = 15;
        var legend = svgLegend
            .selectAll("#legend")
            .data(legendVals)
            .enter()
            .append("g")
            .attr("id", "legend")
            .attr("class", "legends")

        xPos = (i) => {
            return 150 + i % 3 * 150;
        }
        yPos = (i) => {
            return 15 + Math.floor(i / 3) * 25;
        }
        legend
            .append("rect")
            .attr("class", "legend-item")

            .attr("x", (d, i) => xPos(i))
            .attr("y", (d, i) => yPos(i))

            .attr("width", boxSize)
            .attr("height", boxSize)
            .style("fill", (d, i) => color(legendVals[i]));

        legend
            .append("text")
            .text(d => d)
            .attr("x", (d, i) => xPos(i) + 25)
            .attr("y", (d, i) => yPos(i) + 15)

    });
};


videoGameData();
