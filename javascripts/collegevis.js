(function( $ ){
  var Collegevis = function() {
    // load the json data that should be located
    // at root/data/data.json
    var $data = [], $sorted_data = [];

    // after we load the data we will update
    // the interface for the first time.
    $.getJSON('data/data.json', function(d) {
      $data = d;
      $sorted_data = $data.slice();  //copy data for sorts
      update();
    });

    // defaults
    var init_slider_value = 65;

    // controls and view variables
    var $controls = $('#controls'),
        $graph    = $('#graph'),
        $sliders  = $('.slider'),
        $tabs     = $("#tabs"),
        $views    = $('#views'),
        $sort     = $('#sort');

    // pretty colors
    var colors = [
      '#ECD078',
      '#C7F464',
      '#53777A',
      '#D95B43',
      '#542437',
      '#C02942'
    ];

    // add the color to the controls
    $(".control").each(function(index) {
      $(this).append($('<div class="color"></div>').css({'background': colors[index]}));
    });

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
        max_value = 800;

    // the thing we draw on
    var paper = Raphael("graph", gw, gh);
    var txt = {font: '10px Helvetica, Arial', fill: "#000"};

    function draw_bar(values, index) {
      var bh = Math.floor(gh / $data.length);
      var last_width = 130;
      var i;
      for(i = 0; i < values.length; i++) {
        var scale = gw / max_value,
            width = (values[i] * scale);

        var y = index * bh;
        var bar = paper.rect(last_width, y, width, bh);

        last_width += width;

        bar.attr('fill', colors[i]);
        bar.attr("stroke", 'none');
      }

      var text = paper.text(0, index * bh + 3, values.name.substring(0, 25));

      text.attr({'text-anchor': 'start'});
      text.attr(txt);
    }

    function hovered(index) {
      $("#hover").html(data[index].name);
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

    function y_position(index, width) {
      return padding + (5 * index) + (width * index);
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
      var i = 0, d = data_source();

      for(i = 0; i < d.length; i++) {
        var values = [];
        values[0] = scale_cost(parseInt(d[i].annual_tuition, 10));
        values[1] = scale_rep(parseInt(d[i].reputation, 10));
        values[2] = scale_finaid(parseInt(d[i].financial_aid, 10));
        values[3] = scale_job(parseInt(d[i].job_prospects, 10));
        values[4] = scale_type(d[i].type);
        values[5] = scale_location_size(d[i].location_size);
        values.name = d[i].name;

        draw_bar(values, i);

        // sum the values for the total score
        // if table visible then we should sort it
        // by the score
        //
        //
        var j = 0, sum = 0;
        for(j = 0; j < 5; j++) {
          sum += values[j];
        }

        d[i].value = sum;
      }

    }

    function draw_table(data) {
      var i, html = "";

      for(i = 0; i < data.length; i++) {
        html += "<tr>";
        html += "<td>" + data[i].name + "</td>";
        html += "<td>" + data[i].annual_tuition + "</td>";
        html += "<td>" + data[i].reputation + "</td>";
        html += "<td>" + data[i].job_prospects + "</td>";
        html += "<td>" + data[i].financial_aid + "</td>";
        html += "<td>" + data[i].type + "</td>";
        html += "<td>" + data[i].location_size + "</td>";
        html += "<td>" + data[i].value + "</td>";
        html += "</tr>";
      }

      $("#raw_data").find("tr:gt(0)").remove();
      $("#raw_data").append(html);
    }

    function lazy_sort_data() {
      if( is_sorted() ) {
        $sorted_data = $sorted_data.sort(function(a, b) {
          return b.value - a.value;
        });
      }
    }

    function slider_changed() {
      draw();
    }

    function slider_slide() {
      draw();
    }

    function is_sorted() {
      return $sort.is(':checked');
    }

    function data_source() {
      if(is_sorted()) {
        return $sorted_data;
      } else {
        return $data;
      }
    }

    function update() {
      paper.clear();

      lazy_sort_data();

      draw_table( data_source() );

      draw();
    }
  };

  $(document).ready(function() {
    var c = new Collegevis({});
  });
})(jQuery);
