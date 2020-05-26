var name_index = [{
        index: 21,
        name: "陳"
    },
    {
        index: 66,
        name: "林"
    },
    {
        index: 47,
        name: "黃"
    },
    {
        index: 135,
        name: "張"
    },
    {
        index: 60,
        name: "李"
    },
    {
        index: 105,
        name: "王"
    },
    {
        index: 111,
        name: "吳"
    },
    {
        index: 69,
        name: "劉"
    },
    {
        index: 17,
        name: "蔡"
    },
    {
        index: 124,
        name: "楊"
    },
    {
        index: 120,
        name: "許"
    },
    {
        index: 139,
        name: "鄭"
    },
    {
        index: 116,
        name: "謝"
    },
    {
        index: 42,
        name: "洪"
    },
    {
        index: 19,
        name: "曾"
    },
    {
        index: 40,
        name: "郭"
    },
    {
        index: 84,
        name: "邱"
    },
    {
        index: 65,
        name: "廖"
    },
    {
        index: 119,
        name: "徐"
    },
    {
        index: 56,
        name: "賴"
    },
    {
        index: 142,
        name: "周"
    },
    {
        index: 126,
        name: "葉"
    },
    {
        index: 96,
        name: "蘇"
    },
    {
        index: 50,
        name: "江"
    },
    {
        index: 74,
        name: "羅"
    },
    {
        index: 144,
        name: "莊"
    },
    {
        index: 73,
        name: "呂"
    },
    {
        index: 82,
        name: "彭"
    },
    {
        index: 41,
        name: "何"
    },
    {
        index: 49,
        name: "簡"
    }
];

var path = d3.geoPath();

function max(num) {
    return Math.max.apply(null, num);
}
d3.json("data/json/tw_county_topo.json", function(error, su) {
    d3.json("data/json/tw_mercator_topo.json", function(error, us) {
        if (error) throw error;
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        var select = d3.select("#container").append("select")
            .attr("class", "pretty-select")
            .on('change', onchange);
        select.selectAll("option")
            .data(name_index)
            .enter().append("option")
            .attr("value", function(d) {
                return d.index;
            })
            .text(function(d) {
                return d.name;
            })


        var svg = d3.select("#map");

        var topo = topojson.feature(us, us.objects.tw_mercator).features;

        var custom_domain = topo.map(function(item) {
            return Object.values(item.properties)[21];
        });

        var max_ratio = max(custom_domain.filter(function(d) {
            return d != "NA"
        }).map(function(d) {
            return parseFloat(d)
        }))

        var color = d3.scaleQuantile()
            .domain(custom_domain)
            .range(["rgb(247,252,253)", "rgb(224,236,244)", "rgb(191,211,230)", "rgb(158,188,218)", "rgb(140,150,198)", "rgb(140,107,177)", "rgb(136,65,157)", "rgb(110,1,107)"]);

        var town = svg.append("g")
            .attr("class", "towns")
            .selectAll("path")
            .data(topo)
            .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) {
                var value = Object.values(d.properties)[21];
                if (value != max_ratio) {
                    return color(value);
                } else if (value == max_ratio) {
                    return "#ffe600"
                } else {
                    return "#ccc"
                }
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.properties.COUNTY + d.properties.TOWN + "<br/>" + Object.values(d.properties)[21] + "%")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("path")
            .attr("class", "county-borders")
            .attr("d", path(topojson.mesh(su, su.objects.tw_county, function(a, b) {
                return a !== b;
            })))

        function onchange() {
            var selectValue = parseInt(d3.select('select').property('value'))
            var custom_domain = topo.map(function(item) {
                return Object.values(item.properties)[selectValue];
            });

            var max_ratio = max(custom_domain.filter(function(d) {
                return d != "NA"
            }).map(function(d) {
                return parseFloat(d)
            }))
            var color = d3.scaleQuantile()
                .domain(custom_domain)
                .range(["rgb(247,252,253)", "rgb(224,236,244)", "rgb(191,211,230)", "rgb(158,188,218)", "rgb(140,150,198)", "rgb(140,107,177)", "rgb(136,65,157)", "rgb(110,1,107)"]);

            town.style("fill", function(d) {
                    var value = Object.values(d.properties)[selectValue];
                    if (value != "NA" & value != max_ratio) {
                        return color(value);
                    } else if (value == max_ratio) {
                        return "#ffe600"
                    } else {
                        return "#ccc"
                    }
                })
                .on("mouseover", function(d) {
                    var value = Object.values(d.properties)[selectValue];
                    if (value != "NA") {
                        div.transition()
                            .duration(200)
                            .style("opacity", .9);
                        div.html(d.properties.COUNTY + d.properties.TOWN + "<br/>" + Object.values(d.properties)[selectValue] + "%")
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY - 28) + "px");
                    }
                })
                .on("mouseout", function(d) {
                    var value = Object.values(d.properties)[selectValue];
                    if (value != "NA") {
                        div.transition()
                            .duration(500)
                            .style("opacity", 0);
                    }
                });
        }
    });
});