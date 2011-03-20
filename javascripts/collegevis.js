(function( $ ){
  var Collegevis = function() {
    // load the json data that should be located
    // at root/data/data.json
    var data = [];

    // after we load the data we will update
    // the interface for the first time.
    $.getJSON('data/data.json', function(d) {
      var html = "";
      //fill in the raw data view with this data
      var i;
      for(i = 0; i < d.length; i++) {
        html += "<tr>";
        html += "<td>" + d[i].name + "</td>";
        html += "<td>" + d[i].annual_tuition + "</td>";
        html += "<td>" + d[i].reputation + "</td>";
        html += "<td>" + d[i].job_prospects + "</td>";
        html += "<td>" + d[i].financial_aid + "</td>";
        html += "<td>" + d[i].type + "</td>";
        html += "<td>" + d[i].location_size + "</td>";
        html += "</tr>";
      }

      $("#raw_data").append(html);

      data = d;

      console.log(data);

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

    $("input[type=radio]").bind('click', function() { update(); });
    $("input[type=checkbox]").bind('click', function() { update(); });
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


    function draw_bar(values, index) {

      // incorrect but gives me the desired output as it is
      var bar_width = (gw / data.length + 1) / 2; 

      var last_height = 0;

      var i;
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
      return padding + (5 * index) + (width * index);
    }

    // scaling functions for data
    // 
    // each function will scale it's particular
    // data point to the value that it should be
    // on the graph
    function scale_cost(value) {
      return (value * ($("#cost").slider('value') / 100)) / 200;
    }

    function scale_rep(value) {
      return value * ($("#reputation").slider('value') / 10);
    }

    function scale_finaid(value) {
      return value * ($("#finaid").slider('value') / 10);
    }

    function scale_job(value) {
      return value * ($("#jobs").slider('value') / 10);
    }

    function scale_type(value) {
      var v = 0;
      $(".type_checkbox:checked").each(function() {
        if(value == $(this).val()) {
          v = 10 * ($("#type").slider('value') / 10);
        }
      });
      return v;
    }

    function scale_location_size(value) {
      var v = 0;
      $(".location_size:checked").each(function() {
        if(value == $(this).val()) {
          v = 10 * ($("#location").slider('value') / 10);
        }
      });
      return v;
    }

    function draw() {
      var i = 0;
      for(i = 0; i < data.length; i++) {
        var values = [];
        values[0] = scale_cost(parseInt(data[i].annual_tuition, 10));
        values[1] = scale_rep(parseInt(data[i].reputation, 10));
        values[2] = scale_finaid(parseInt(data[i].financial_aid, 10));
        values[3] = scale_job(parseInt(data[i].job_prospects, 10));
        values[4] = scale_type(data[i].type);
        values[5] = scale_location_size(data[i].location_size);

        draw_bar(values, i);
      }
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
