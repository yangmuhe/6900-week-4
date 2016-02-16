/**
 * Created by yangmuhe on 2/4/16.
 */

d3.timeSeries = function(){
    //internal variables
    //will need some default values, which can be overridden later
    var w = 800,
        h = 600,
        m = {t:25, r:50, b:25, l:50},
        chartW = w - m.l - m.r,
        chartH = h - m.t - m.b,
        timeRange = [new Date(), new Date()],
        binSize, //if not specified here and neither do user, user will get an error
        maxY = 1000,
        valueAccessor = function(d){return d.startTime},
        scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
        scaleY = d3.scale.linear().range([chartH,0]).domain([0, maxY]);

    //"exports"
    //the function that gets returned
    function exports(selection){
        console.log("Start drawing the chart")
        /*
        selection.append('svg')
            .attr('width',w)
            .attr('height',h)
            .append('circle').attr('r',50)
        */
        chartW = w - m.l - m.r;  //!! why do they have to be defined here again?
        chartH = h - m.t - m.b;

        //create the histogram layout
        var layout = d3.layout.histogram()
            .value(valueAccessor)
            .range(timeRange)
            .bins(binSize.range(timeRange[0],timeRange[1])); //search d3.time.week.range

        scaleX.range([0,chartW]).domain(timeRange);
        scaleY.range([chartH,0]).domain([0, maxY]);


        //take the data, use a histogram layout to transform into a series of (x,y)
        selection.each(function(_d){  //go through every elements in the selection
            //'selection' here is d3.select('.plot') in script.js
            var data = layout(_d);
            //console.log(data);

            //upadate scale
            //scaleX.domain(timeRange);
            //scaleY.domain([0, d3.max(data, function(d){return d.y})]);


            //Generator
            var lineGenerator = d3.svg.line()
                .x(function(d){return scaleX(d.x.getTime() + d.dx/2)})  //??
                .y(function(d){return scaleY(d.y)})
                .interpolate('basis');
            var areaGenerator = d3.svg.area()
                .x(function(d){return scaleX(d.x.getTime() + d.dx/2)})
                .y0(chartH)
                .y1(function(d){return scaleY(d.y)})
                .interpolate('basis');

            //axis
            var axisX = d3.svg.axis()
                .scale(scaleX)
                .orient('bottom')
                .ticks(d3.time.year);

            //append DOM
            //selection.append('svg')
            var svg = d3.select(this).append('svg');
                //.selectAll('svg')
                //.data([_d])

            /*
            var svgEnter = svg.enter().append('svg').attr('width',w).attr('height',h);

            svgEnter.append('g').attr('class','line')
                .attr('transform','translate('+m.l+','+m.t+')')
                .append('path')
            svgEnter.append('g').attr('class','area')
                .attr('transform','translate('+m.l+','+m.t+')')
                .append('path')
            svgEnter.append('g').attr('class','axis')
                .attr('transform','translate('+m.l+','+(m.t+chartH)+')')
            */

            svg.attr('width',w).attr('height',h);
            svg.append('g').attr('class','line')
                .attr('transform','translate('+m.l+','+m.t+')')
                .append('path');
            svg.append('g').attr('class','area')
                .attr('transform','translate('+m.l+','+m.t+')')
                .append('path');
            svg.append('g').attr('class','axis')
                .attr('transform','translate('+m.l+','+(m.t+chartH)+')');

            svg.select('.line').select('path')
                .datum(data)
                .attr('d',lineGenerator);
            svg.select('.area').select('path')
                .datum(data)
                .attr('d',areaGenerator);
            svg.select('.axis')
                .call(axisX);

            /*var chart = svg.select('.chart')
                .attr('transform','translate('+ m.l+','+m.t+')')

            chart.append('g')
                .attr('class','axis axis-x')
                .attr('transform','translate(0,'+chartH+')')
                .call(axisX)

            //var chart = svg.append('g')

            chart.append('path')
                .attr('class','line')
                .datum(data)
                .attr('d',lineGenerator)
                .style('fill','none')
                .style('stroke','black')
                */


        })

    }


    //Getter and setter functions
    //modify and access internal variables
    exports.width = function(_x){  //"_" to remind this is a user input. It's a convention.
        if(!arguments.length) return w;
        w = _x;
        return this;  //"this" refers to exports
    }

    exports.height = function(_x){
        if(!arguments.length) return h;
        h = _x;
        return this;
    }

    exports.timeRange = function(_r){
        if(!arguments.length) return timeRange;
        timeRange = _r;
        return this;
    }

    exports.binSize = function(interval){
        if(!arguments.length) return binSize;
        binSize = interval;
        return this;
    }

    exports.value = function(accessor){
        if(!arguments.length) return valueAccessor;
        valueAccessor = accessor;
        return this;
    }


    return exports;
}