var _test_names = [];
var _test_names_dict = [];
var _test_name_ts_duration = [];
var _timestamps = [];

var _graph;
var _graph_detail;
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

function init_graphs() {
    _graph_detail = new GraphTimestampDuration([{ x: 0, y: 0 }]);
    _graph = new GraphTestNames([{ 'x': 0, 'y': 0 }], _graph_detail);
}

function get_name(name) {
    $.get("/?name="+name, function(data) {
        _test_names = [];
        _test_names_dict = [];
        _test_name_ts_duration = [];
        _timestamps = [];

        points = populate_data_structures(data, _test_names, _test_names_dict, _test_name_ts_duration, _timestamps);

        _graph.update_data(points);   
    }).fail(function(reason) {
        console.log("Getting web data failed " + reason);
        console.log(reason);
    });
}

$( document ).ready(function() {
    init_graphs();
    $.get("/names/", function(data) {
        for (var i=0;i<data.length;i++){
            $('<option/>').val(data[i]).html(data[i]).appendTo('#test_set');
        }

        $('#test_set').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            get_name(valueSelected);
        });

        get_name(data[0]);

    });

    //$('#allDataButton').on('click', handleAllDataButtonClick);
});
