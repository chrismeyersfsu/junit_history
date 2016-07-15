var GraphTimestampDuration = function(data) {
    this._graph = new Rickshaw.Graph( {
        element: document.getElementById("chart_detail"),
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

    this.format_x_axis = function(d) {
        d = new Date(d)
        return d3.time.format("%c")(d)
    }
    this._x_ticks = new Rickshaw.Graph.Axis.X({
        graph: this._graph,
        orientation: 'bottom',
        element: document.getElementById('x_axis_detail'),
        tickFormat: this.format_x_axis,
        ticks: 10,
    });

    this._y_ticks = new Rickshaw.Graph.Axis.Y({
        graph: this._graph,
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        ticksTreatment: 'glow',
    });

    this.handleFormatPointHover = function(series, x, y, formattedX, formattedY, d) {
        var str = "Date: " + new Date(d.value.x) + "<br>";
        str += "Duration: " + y + "<br>";
        return str;
    }
    this._hover_detail = new Rickshaw.Graph.HoverDetail({
        graph : this._graph,
        formatter : this.handleFormatPointHover,
    });

    this._graph.render();

    this.update_data = function(data) {
        $('#chart_detail_title').text("Duration History for " + test_name(data[0].case));

        this._graph.series[0].data = data;
        this._graph.update();
    }
    return this;
}

