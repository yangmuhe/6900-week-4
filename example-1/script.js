var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){


    //create nested hierarchy based on stations
    var tripsByStation = d3.nest()
        .key(function(d){return d.startStation})
        .entries(rows);

    console.log(tripsByStation)

    //create a <div> for each station
    //bind trips data to each station
    var plots = d3.select('.container').selectAll('.plot')
        .data(tripsByStation);

    plots
        .enter()
        .append('div').attr('class','plot');

    plots
        .each(function(d){
            //@param d?
            //this?
            var timeSeries = d3.timeSeries()
                .width(w)
                .height(h)
                .timeRange([new Date(2012,6,15),new Date(2013,6,15)])
                .value(function(d){ return d.startTime; })
                .maxY(50)
                .bins(d3.range(new Date(2011,6,15), new Date(2013,6,16), 1000*3600*24));

            d3.select(this).datum(d.values)
                .call(timeSeries);
        })
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

