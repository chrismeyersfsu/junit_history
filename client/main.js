var _data = [];
var _test_names = [];
var _test_names_dict = [];
var _graph;
var _timestamps = [];

var format_x_axis = function(n) {
    return _test_names[n];
}

function test_name(_case) {
    return _case['className'] + '::' + _case['name'];
}

function populate_test_name(_case, test_names, test_names_dict) {
    full_name = test_name(_case);
    if (!test_names_dict[full_name]) {
        var len = test_names.push(full_name);
        test_names_dict[full_name] = Number(len - 1);
    }
}
function populate_test_names(data, test_names, test_names_dict) {
     _.each(data, function(item) {
        _.each(item['_source']['suites'], function(suite) {
            if (suite['name'] === "pytest") {
                _.each(suite['cases'], function(_case) {
                    populate_test_name(_case, test_names, test_names_dict);
                });
            }
        });
    });

    console.log(_test_names);
    console.log(_test_names_dict);
}
function populate_timestamps(data, timestamps) {
     _.each(data, function(item) {
        timestamps.push((item['_source']['timestamp']));
    });
}

function populate_x_y(data, test_names_dict) {
    var points = [];
     _.each(data, function(item) {
        _.each(item['_source']['suites'], function(suite) {
            if (suite['name'] === "pytest") {
                _.each(suite['cases'], function(_case) {
                    full_name = test_name(_case);
                    var x_index = test_names_dict[full_name];
                    if (full_name == "awx.main.tests.functional.test_db_credential::test_cred_unique_org_name_kind") {
                        console.log("Index: " + x_index);
                    }
                    var entry = { 'x': x_index, 'y': _case['duration'] };
                    points.push(entry);
                });
            }
        });
    });
    return _.sortBy(points, 'x');
}

function generate_graph(data) {
    _graph = new Rickshaw.Graph( {
        element: document.getElementById("chart"),
        renderer: 'scatterplot',
        stroke: true,
        width: 2000,
        height: 500,
        min: 'auto',
        series: [{
            data: data,
            color: 'steelblue'
        }],
    }); 
    var x_ticks = new Rickshaw.Graph.Axis.X({
        graph: _graph,
        orientation: 'bottom',
        element: document.getElementById('x_axis'),
        //pixelsPerTick: 800,
        tickFormat: format_x_axis
    });
    var y_ticks = new Rickshaw.Graph.Axis.Y({
        graph: _graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: 'glow',
    });

    _graph.render();

    var slider = new Rickshaw.Graph.RangeSlider({
        graph : _graph,
        element : document.getElementById('slider'),
    });
    var hoverDetail = new Rickshaw.Graph.HoverDetail({
        graph : _graph,
        formatter : function(series, x, y, formattedX, formattedY, d) {
            return _test_names[x] + " - " + y;
        },
    });
    return _graph;
}


$( document ).ready(function() {
    $.get("sample_data.json", function(data) {
        populate_timestamps(data, _timestamps);
        populate_test_names(data, _test_names, _test_names_dict);
        points = populate_x_y(data, _test_names_dict);
        _data = points;

        generate_graph(_data);
        console.log(points[0]);
        console.log(points[1]);
        console.log(points[2]);
        console.log(points[3]);
        console.log(points[4]);
    }).fail(function(reason) {
        console.log("Getting sample data failed " + reason);
        console.log(reason);
    });
});
