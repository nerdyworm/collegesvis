(function( $ ){
  var Collegevis = function() {
    // load the json data that should be located
    // at root/data/data.json
    var data = [];

    // after we load the data we will update
    // the interface for the first time.
    $.getJSON('data/data.json', function(d) {
      data = d;
      console.log(data);
      var html = ""
      //fill in the raw data view with this data
      for(i = 0; i < data.length; i++) {
        html += "<tr>";
        html += "<td>" + data[i].name + "</td>";
        html += "<td>" + data[i].annual_tuition + "</td>";
        html += "<td>" + data[i].reputation + "</td>";
        html += "<td>" + data[i].job_prospects + "</td>";
        html += "<td>" + data[i].financial_aid + "</td>";
        html += "<td>" + data[i].type + "</td>";
        html += "<td>" + data[i].location_size + "</td>";
        html += "</tr>";
      }

      console.log(html);
      $("#raw_data").append(html);
      update();
    });

    // defaults
    var init_slider_value = 65;

    // controls and view variables
    var $controls = $('#controls'),
        $graph    = $('#graph'),
        $sliders  = $('.slider'),
        $tabs     = $("#tabs"),
        $views    = $('#views');

    // make controlls active
    $sliders.slider({value: init_slider_value});
    $sliders.bind('slide', function() { update(); });
    $sliders.bind('change', function() { udpdate(); });

    $tabs.tabs();

    // make the views same height as controlls
    $views.height($controls.outerHeight());

    // update the tabs panels to match this
    // 80 is the height of the tabs
    $tabs.find(".ui-tabs-panel").height($controls.outerHeight() - 80);

    $graph.height($controls.outerHeight() - 80);
    
    var gh = $graph.height(),
        gw = $graph.width(),
        padding = 20,
        max_value = 700;

    // the thing we draw on
    var paper = Raphael("graph", gw, gh);


    function draw_bar(values, index, total) {

      var bar_width = 25; //TODO: calculate width based on number of bars needed

      var last_height = 0;

      for(i = 0; i < values.length; i++) {
        var height = height_on_paper(values[i]);

        var y = bottom_paper(height) - last_height;
        var x = x_position(index, bar_width);

        var bar = paper.rect(x, y, bar_width, height);

        last_height += height;
      }
      
    }

    // don't like these fn names....
    function bottom_paper(height) {
      return gh - height - padding;
    }

    function height_on_paper(value) {
      var total_height = gh - padding,
          scale = total_height / max_value;
      return (value * scale);
    }

    function x_position(index, width) {
      return padding + (10 * index) + (width * index);
    }


    function draw() {
      var values = [];

      $sliders.each(function(index) {
        values[index] = $(this).slider('value');
      });
      draw_bar(values, 0, 2);    
      draw_bar([10, 50, 30], 1, 2);    
      draw_bar(values, 2, 4);
    }

    function slider_changed() {
      draw();
    }

    function slider_slide() {
      draw();
    }

    function update() {
      paper.clear();

      draw();
    }
  };


  $(document).ready(function() {
    var c = new Collegevis({});
  });
})(jQuery );
