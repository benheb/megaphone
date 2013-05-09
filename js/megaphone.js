  var velocity = [.008, -.002],
    t0 = Date.now(),
    projection,
    cities,
    svg,
    path,
    scale;
  
  function init() { 
    
    var width = document.width,
      height = document.height;
      
    projection = d3.geo.orthographic()
      .scale(1000)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate([120, -37])
      .precision(0);
    
    path = d3.geo.path()
      .projection(projection);
    
    svg = d3.select("#d3-map").append("svg")
      .attr("width", width)
      .attr("height", height);
  
    addGeoms();
  }
    
  /*
   * 
   * Add world countries
   * 
   */
  function addGeoms() {
    //add countries
    d3.json("data/world.json", function(error, world) {
      console.log('world', world)
      svg.insert("path")
        .datum(topojson.object(world, world.objects.world))
        .attr("class", "land")
        .attr("d", path);
      
      svg.insert("path")
        .datum(topojson.object(world, world.objects.counties))
        .attr("class", "land counties")
        .attr("d", path);
        
    });
  }
  
  function tweets( m ) {
    var scale = d3.scale.linear()
      .domain([1,6000])
      .range([1,50]);
      
    var tweets = svg.append('g');
    
    tweets.selectAll("circle")
      .data([ m ])
    .enter().insert("circle")
      .attr("transform", function(d) { return "translate(" + projection([d.graphic.geometry.x,d.graphic.geometry.y]) + ")";})
      .attr("fill", styler)
      .attr('class', 'tweets')
      .attr('r', 1)
      .transition()
        .duration(1000)
        .attr('r', function(d) { return scale( d.graphic.attributes.user_followers ) })
      .transition()
        .duration(400)
        .attr('r', 3)
     
     console.log('m', m)
     $('#info-window').html(m.graphic.attributes.text).show();
  }
  
  
  /*
   * 
   * Interactions - on hover / on exit
   * 
   */
  function hover( d ) {
    exit();
    
  }
  
  function exit() {
    
  }
  
  /*
   * 
   * Styler 
   * 
   */
  function styler( data ) {
    var followers = data.graphic.attributes.user_followers;
    var colors = ["rgb(78,0,0)", "rgb(103,0,31)", "rgb(178,24,43)", "rgb(214,96,77)", "rgb(244,165,130)", "rgb(253,219,199)", "rgb(247,247,247)", "rgb(209,229,240)", "rgb(146,197,222)", "rgb(67,147,195)", "rgb(33,102,172)", "rgb(5,48,97)"] 
    colors = colors.reverse();
    var color;
    
    switch ( true ) {
      case ( followers < 10 ) :
        color = colors[0];
        break;
      case ( followers < 30 ) :
        color = colors[1];
        break;
      case ( followers < 60 ) : 
        color = colors[2]
        break;
      case ( followers < 100 ) : 
        color = colors[3]
        break;
      case ( followers < 130 ) : 
        color = colors[4]
        break;
      case ( followers < 160 ) : 
        color = colors[5]
        break;
      case ( followers < 200 ) : 
        color = colors[6]
        break;
      case ( followers < 400 ) : 
        color = colors[7]
        break;
      case ( followers < 600 ) : 
        color = colors[8]
        break;
      case ( followers < 1200 ) : 
        color = colors[9]
        break;
      case ( followers > 1200 ) : 
        color = colors[10]
        break;
    }
    return color;
  }
  
  /*
   * Handles rotating globe
   * 
   * 
   */
  //TODO fix d="" errors when spinning (has to do with clipping?)
  function setTimer() {
    d3.timer(function() {
      var t = Date.now() - t0,
          o = [λ(450) + velocity[0] * t, φ(450) + velocity[1] * 1];
          //o = [origin[0] + velocity[0] * t, origin[1] + velocity[1] * t];
      
      if (!down) {
        projection.rotate(o);
        d3.selectAll("circle")
          .attr("transform", function(d) {return "translate(" + projection([d.geometry.coordinates[0],d.geometry.coordinates[1]]) + ")";  })
          .attr('d', updateLine)
        svg.selectAll("path").attr("d", path);
      }
    });
  }