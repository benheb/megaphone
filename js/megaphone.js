  var velocity = [.008, -.002],
    t0 = Date.now(),
    projection,
    cities,
    svg,
    path,
    φ,
    λ,
    down,
    stepInterval = null;
  
  function init() { 
    
    var width = document.width,
      height = document.height;
      
    projection = d3.geo.orthographic()
      .scale(400)
      .translate([width / 2, height / 2])
      .clipAngle(90)
      .rotate([100, -20])
      .precision(0);
    
    path = d3.geo.path()
      .projection(projection);
    
    λ = d3.scale.linear()
      .domain([0, width])
      .range([-180, 180]);
    
    φ = d3.scale.linear()
      .domain([0, height])
      .range([90, -90]);
  
    svg = d3.select("#d3-map").append("svg")
      .attr("width", width)
      .attr("height", height);
    
    down = false;
    svg.on('mousedown', function() {
      down = true;
    });
    
    svg.on('mouseup', function() {
      down = false;
    });
    
    svg.on("mousemove", function() {
      if (!down) return;
      var p = d3.mouse(this);
      projection.rotate([λ(p[0]), φ(p[1])]);
      d3.selectAll("circle")
        .attr("transform", function(d) {return "translate(" + projection([d.geometry.coordinates[0],d.geometry.coordinates[1]]) + ")";  })
        .attr('d', updateLine)
      svg.selectAll("path").attr("d", path);
    });
   
    // mousewheel scroll
    $('#d3-map').mousewheel(function (event, delta, deltaX, deltaY) {
      var s = projection.scale();
      if (delta > 0) {
        projection.scale(s * 1.1);
      }
      else {
        projection.scale(s * 0.9);
      }
      svg.selectAll("path").attr("d", path);
    });
    
    addGeoms();
  }
    
  /*
   * 
   * Add world countries
   * 
   */
  function addGeoms() {
    //add countries
    d3.json("data/world-110m.json", function(error, world) {
      svg.append("path")
        .datum(topojson.object(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);
        
      //tweets();
    });
  }
  
  function tweets( m ) {
    var tweets = svg.append('g');
    
    tweets.selectAll("circle")
      .data([ m ])
    .enter().insert("circle")
      .attr("transform", function(d) { return "translate(" + projection([d.graphic.geometry.x,d.graphic.geometry.y]) + ")";})
      .attr("fill", '#fff')
      .attr('class', 'tweets')
      .attr('r', 2);
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
    var temp = data.properties.temperature;
    var colors = ["rgb(78,0,0)", "rgb(103,0,31)", "rgb(178,24,43)", "rgb(214,96,77)", "rgb(244,165,130)", "rgb(253,219,199)", "rgb(247,247,247)", "rgb(209,229,240)", "rgb(146,197,222)", "rgb(67,147,195)", "rgb(33,102,172)", "rgb(5,48,97)"] 
    colors = colors.reverse();
    var color;
    
    switch ( true ) {
      case ( temp < -10 ) :
        color = colors[0];
        break;
      case ( temp < 0 ) :
        color = colors[1];
        break;
      case ( temp < 15 ) : 
        color = colors[2]
        break;
      case ( temp < 30 ) : 
        color = colors[3]
        break;
      case ( temp < 40 ) : 
        color = colors[4]
        break;
      case ( temp < 50 ) : 
        color = colors[5]
        break;
      case ( temp < 50 ) : 
        color = colors[6]
        break;
      case ( temp < 60 ) : 
        color = colors[7]
        break;
      case ( temp < 70 ) : 
        color = colors[8]
        break;
      case ( temp < 80 ) : 
        color = colors[9]
        break;
      case ( temp > 80 ) : 
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