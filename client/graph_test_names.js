var GraphTestNames = function(data, _graph_detail) {
    var that = this;
    this._graph_id = '#chart';
    this._graph_detail = _graph_detail;

    this._graph = new Rickshaw.Graph({
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

    this._x_ticks = new Rickshaw.Graph.Axis.X({
        graph: this._graph,
        orientation: 'bottom',
        element: document.getElementById('x_axis'),
        //pixelsPerTick: 800,
        tickFormat: format_x_axis,
        ticks: 10,
    });

    this._y_ticks = new Rickshaw.Graph.Axis.Y({
        graph: this._graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: 'glow',
    });
    this._graph.render();

    this._slider = new Rickshaw.Graph.RangeSlider({
        graph : this._graph,
        element : document.getElementById('slider'),
    });

    this.handle_graph_click = function(point) {
        var full_name = test_name(point.value.case);
        this._graph_detail.update_data(_test_name_ts_duration[full_name]);
    }

    // Not currently used
    this.handle_all_data_button_click = function(e) {
        var domain = _graph.dataDomain();
        this._graph.window.xMin = domain[0];
        this._graph.window.xMax = domain[1];
        this._graph.update();
    }

    this.handle_format_point_hover = function(series, x, y, formattedX, formattedY, d) {
        that.last_hovered_point = d;
        var date = new Date(d.value.record.timestamp);
        var str = "Timestamp: " + new Date(d.value.record.timestamp) + "<br>";
        str += "Test: " + _test_names[d.value.x] + "<br>";
        str += "Duration: " + d.value.y + "<br>";
        return str;
    }

    this._hover_detail = new Rickshaw.Graph.HoverDetail({
        graph : this._graph,
        formatter : this.handle_format_point_hover,
    });

    $(this._graph_id).on('click', function() {
        return that.handle_graph_click.call(that, that.last_hovered_point);
    });

    this.update_data = function(data) {
        this._graph.series[0].data = data;
        this._graph.update();
    }
    return this;
}

