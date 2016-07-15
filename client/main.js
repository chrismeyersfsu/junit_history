var _data = [];
var _test_names = [];
var _test_names_dict = [];
var _test_name_ts_duration = [];
var _graph;
var _graph_detail;
var _timestamps = [];
var _slider;
var _hover_detail;

var format_x_axis = function(n) {
    return _test_names[n];
}

function test_name(_case) {
    return _case['classname'] + '::' + _case['name'];
}

function _populate_test_name(_case, test_names, test_names_dict) {
    var full_name = test_name(_case);
    if (!test_names_dict[full_name]) {
        var len = test_names.push(full_name);
        test_names_dict[full_name] = Number(len - 1);
    }
}

function _populate_test_name_timestamp_duration(item, _case, test_name_duration) {
        var full_name = test_name(_case);
        if (!test_name_duration[full_name]) {
            test_name_duration[full_name] = []
        }
        test_name_duration[full_name].push({
            'x': item['timestamp'],
            'y': Number(_case['time']),
            'case': _case,
            'record': item,
        });
}

function _populate_timestamp(item, timestamps) {
    timestamps.push(item['timestamp']);
}

function _populate_x_y(item, _case, test_names_dict, points) {
    var full_name = test_name(_case);
    var x_index = test_names_dict[full_name];
    if (full_name == "awx.main.tests.functional.test_db_credential::test_cred_unique_org_name_kind") {
        console.log("Index: " + x_index);
    }
    var entry = { 'x': x_index, 'y': Number(_case['time']), 'case': _case, 'record': item };
    points.push(entry);
}

function loop(data, cb) {
    _.each(data, function(item) {
        if (item['junit']['testsuite']['__']['name'] == "pytest") {
            _.each(item['junit']['testsuite']['testcase'], function(_case) {
                cb(item, _case['__']);
            });
        }
     });
}

function populate_data_structures(data, test_names, test_names_dict, test_name_duration, timestamps) {
    var points = [];
    _.each(data, function(item) {
        _populate_timestamp(item, timestamps);
    });
    loop(data, function(item, _case) {
        _populate_test_name(_case, test_names, test_names_dict);
        _populate_test_name_timestamp_duration(item, _case, test_name_duration);
    });
    loop(data, function(item, _case) {
        _populate_x_y(item, _case, test_names_dict, points);
    });
    return _.sortBy(points, 'x');
}

function handleGraphClick(point) {
    /*    
    _graph.window.xMin = point.value.x - 1;
    _graph.window.xMax = point.value.x + 1;
    _graph.update();
    _slider.update();
    */
    var full_name = test_name(point.value.case);
    _graph_detail.update_data(_test_name_ts_duration[full_name]);
    //_graph.update();
}

function handleAllDataButtonClick(e) {
    var domain = _graph.dataDomain();
    _graph.window.xMin = domain[0];
    _graph.window.xMax = domain[1];
    _graph.update();
}

function handleFormatPointHover(series, x, y, formattedX, formattedY, d) {
    _hover_detail.last_hovered_point = d;
    var date = new Date(d.value.record.timestamp);
    var str = "Timestamp: " + new Date(d.value.record.timestamp) + "<br>";
    str += "Test: " + _test_names[d.value.x] + "<br>";
    str += "Duration: " + d.value.y + "<br>";
    return str;
}

function generate_graph(data) {
    var graphId = '#chart';
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
        tickFormat: format_x_axis,
        ticks: 10,
    });
    var y_ticks = new Rickshaw.Graph.Axis.Y({
        graph: _graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: 'glow',
    });

    _graph.render();

    _slider = new Rickshaw.Graph.RangeSlider({
        graph : _graph,
        element : document.getElementById('slider'),
    });
    _slider.onSlide(function(x, y, z) {
    });
    _hover_detail = new Rickshaw.Graph.HoverDetail({
        graph : _graph,
        formatter : handleFormatPointHover,
    });

    $(graphId).on('click', function() {
        return handleGraphClick(_hover_detail.last_hovered_point);
    });

    _graph_detail = GraphTimestampDuration([{ x: 0, y: 0 }]);
    return _graph;
}


$( document ).ready(function() {
    //$.get("sample_data.json", function(data) {
    $.get("/", function(data) {
        points = populate_data_structures(data, _test_names, _test_names_dict, _test_name_ts_duration, _timestamps);
        _data = points;

        generate_graph(_data);
    }).fail(function(reason) {
        console.log("Getting sample data failed " + reason);
        console.log(reason);
    });

    $('#allDataButton').on('click', handleAllDataButtonClick);
});
