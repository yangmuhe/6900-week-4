var m = {t:50,r:100,b:50,l:100},
    w = d3.select('.plot').node().clientWidth- m.l- m.r,
    h = d3.select('.plot').node().clientHeight - m.t - m.b;

var plot = d3.select('.plot').append('svg')
    .attr('width',w+ m.l+ m.r)
    .attr('height',h+ m.t+ m.b)
    .append('g').attr('class','histogram')
    .attr('transform','translate('+ m.l+','+ m.t+')');

d3.csv('../data/hubway_trips.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    //d3.range(start,end,increment)
    var layout = d3.layout.histogram()
        .value(function(d){ return d.startTime; })
        .range([new Date(2011,6,15),new Date(2013,6,15)])
        .bins( d3.range(new Date(2011,6,15), new Date(2013,6,16), 24*3600*1000) );

    var timeSeries = layout(rows);
    console.log(timeSeries);

    //Scales
    var scaleX = d3.time.scale().domain([new Date(2011,6,15),new Date(2013,6,15)]).range([0,w]),
        scaleY = d3.scale.linear().domain([0,d3.max(timeSeries,function(d){return d.y;})]).range([h,0])

    //Genetator
    var lineGenerator = d3.svg.line()
        .x(function(d){ return scaleX(d.x + d.dx/2)})
        .y(function(d){ return scaleY(d.y)})
        .interpolate('basis');

    var axisX = d3.svg.axis() //return a function
        .scale(scaleX) //
        .orient('bottom')
        .ticks(d3.time.weeks);



    //append and modify the DOM elements
    plot.append('path')
        .datum(timeSeries)
        .attr('d',lineGenerator);

    plot.append('g')
        .attr('class','axis axis-x')
        .attr('transform','translate(0,'+h+')')
        .call(axisX);

    //
    plot
        .call(appendRedBall);
    plot2.call(appendRedBall);
    plot3
    plot4

    function appendRedBall(element){
        element.append('circle').style('fill','red').attr('r',5);
    }




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

