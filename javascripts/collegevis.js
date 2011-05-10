(function( $ ){
  // # Collegevis
  //
  var Collegevis = function() {
    // We store the original data in the `$data` variable
    // and the data that we plan on sorting is stored
    // in the `$sorted_data` variable.  This is to ensure
    // that the natural order of the data set is never
    // disturbed.
    var $data = [], $sorted_data = [];

    // Load the data from our data source.  For this example
    // the data is a static text file in `JSON`a format.  After
    // we load the data pass that data into the callback.
    //
    $.getJSON('data/data.json', function(d) {
      // Assign this data to the global variables
      $data = d;

      // Make a copy of the data for sorting
      $sorted_data = $data.slice();

      // Let's update this thing
      update();
    });

    var init_slider_value = 65;

    // Setup all our control and view variables.
    //
    // `#` is an id
    //
    // `.` is a class
    //
    var $controls = $('#controls'),
        $graph    = $('#graph'),
        $sliders  = $('.slider'),
        $tabs     = $("#tabs"),
        $views    = $('#views'),
        $sort     = $('#sort');

    // Colors are assigned in the order which they are listed here
    var colors = [
      '#66C2A5',
      '#FC8D62',
      '#8DA0CB',
      '#E78AC3',
      '#A6D854',
      '#FFD92F'
    ];

    // We cache the translation of values to selectors.
    // See: [sel\_for\_value(value)](#section-38)
    var id_cache = {};

    // Add the color label to each control field by appending
    // an html div and setting the background color
    //
    $(".control").each(function(index) {
      $(this).append($('<div class="color"></div>').css({'background': colors[index]}));
    });

    // Initialize the sliders to our default value
    $sliders.slider({value: init_slider_value});

    // Bind a slide action to the update function
    $sliders.bind('slide', function() { update(); });

    // Bind a change action to the update function
    // Note: Change is when the user clicks on some part of the
    // slider's bar.
    $sliders.bind('change', function() { udpdate(); });

    // Bind the click function to all radio buttons and check boxes to the
    // update function.
    $("input[type=radio]").bind('click', function() { update(); });
    $("input[type=checkbox]").bind('click', function() { update(); });

    // Initialize the tab view
    $tabs.tabs();

    // This sets the hight of the views (Data view and Graph View) to
    // the same size as the controls.  We just to ensure that things
    // line up correctly.
    $views.height($controls.outerHeight());

    // Inside the view we want to make sure that the tab's fill
    // the view area correctly.
    //
    // 80 is the height of the tabs
    $tabs.find(".ui-tabs-panel").height($controls.outerHeight() - 80);

    // Finally update the graph view to match the size of the view
    // area and let's give it 80 pixels of padding to make it look nice.
    $graph.height($controls.outerHeight() - 80);

    // Commonly used variables that we want to have short names for
    var gh = $graph.height(),
        gw = $graph.width(),
        padding = 20,
        max_value = 800;

    // Let's create something that we can draw on.
    // Set the size to our containers.
    var paper = Raphael("graph", gw, gh);

    // Our default font for this visualization.
    var txt = {font: '10px Helvetica, Arial', fill: "#000"};

    // ### Draws the bars in the visualization
    //
    function draw_bar(college, index) {
      // The values are the scaled and normalized data attributes.
      var values = college.values;

      // Bar Height: we figure out how high each bar can be and still fit it on the graph
      var bh = Math.floor(gh / $data.length);

      // The last width is set to the size of our label to the left
      var last_width = 130;
      var i;
      for(i = 0; i < values.length; i++) {
        // Figure out our scale based on the max value
        var scale = gw / max_value,
            // Figure out the size of this attribute on the graph
            width = (values[i] * scale);

        // Our vertical position is the index we were given  times the bar height.
        var y = index * bh;

        // Create a rectangle object with our dimensions and coordinates
        var bar = paper.rect(last_width, y, width, bh);

        // Update the last width so that we know where the next bar starts
        last_width += width;

        // Fill the bar with pretty colors
        bar.attr('fill', colors[i]);

        // No we do not want an ugly black line around our pretty bars
        bar.attr("stroke", 'none');
      }

      // Add our label to the view, we also trim it down so that we do not
      // overflow in to the graph area.
      var text = paper.text(0, index * bh + 3, college.name.substring(0, 25));

      text.attr({'text-anchor': 'start'});
      text.attr(txt);
    }

    function hovered(index) {
      $("#hover").html(data[index].name);
    }

    // ### Scaling functions for data
    //
    // Each function will scale it's particular
    // data point to the value that it should be
    // in proportion to all the other values times
    // the slider weight.
    //
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
      var v = 0, id = sel_for_value(value);

      // if the check box for this value is checked
      // then we should include the value
      if($(id).is(':checked')) {
         v = $("#type").slider('value');
      }

      return v;
    }

    function scale_location_size(value) {
      var v = 0, id = sel_for_value(value);

      // if the check box for this value is checked
      // then we should include the value
      if($(id).is(':checked')) {
        v = $("#location").slider('value');
      }

      return v;
    }

    // Looks up the selector for a particular value
    // and then caches it so that we do not have
    // to do any string manipulation twice.
    //
    // `Small City` === `#small_city`
    //
    function sel_for_value(value) {
      if( id_cache[value] === undefined ) {
        var id = value.toLowerCase().replace(/ /g, "_");
        id_cache[value] = "#" + id;
      }
      return id_cache[value];
    }


    // Returns an array of data with the
    // values scaled and the score totaled.
    //
    function update_data(d) {
      var i = 0, j = 0;

      for(i = 0; i < d.length; i++) {
        d[i].value  = 0;
        d[i].values = [];
        d[i].values[0] = scale_cost(parseInt(d[i].annual_tuition, 10));
        d[i].values[1] = scale_rep(parseInt(d[i].reputation, 10));
        d[i].values[2] = scale_finaid(parseInt(d[i].financial_aid, 10));
        d[i].values[3] = scale_job(parseInt(d[i].job_prospects, 10));
        d[i].values[4] = scale_type(d[i].type);
        d[i].values[5] = scale_location_size(d[i].location_size);

        // sum the values for the total score
        var sum = 0;
        for(j = 0; j <= 5; j++) {
          sum += d[i].values[j];
        }

        d[i].value = sum;
      }

      return d;
    }

    // Takes an array of data.  First clears the canvas
    // then loops over each data item and calls the
    // draw bar function.
    //
    function draw_graph(d) {
      paper.clear();

      var i = 0;
      for(i = 0; i < d.length; i++) {
        draw_bar(d[i], i);
      }
    }

    // Generates the HTML for the table view,
    // removes the old data, and inserts the new
    // data
    //
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

    // Comparator function for sorting the
    // data set.
    //
    function compare_values(a, b) {
      return b.value - a.value;
    }

    // Convenience method for checking if the
    // sorted check box is checked.
    //
    function is_sorted() {
      return $sort.is(':checked');
    }

    // Determines which data source to use depending
    // on whether or not we should be sorting it.
    // Executes the callback with the data as an
    // argument.
    //
    function with_data_source(callback) {
      if(is_sorted()) {
        return callback($sorted_data);
      } else {
        return callback($data);
      }
    }

    // Determines whether or not to sort the
    // data.  Executes the callback with the correct
    // collection of data.
    //
    function with_sort(_data, callback) {
      if(is_sorted()) {
        callback(_data.sort(compare_values));
      } else {
        callback(_data);
      }
    }

    // Updates the data and executes the callback
    // with the updated data.
    //
    function with_updates(_data, callback) {
      return callback(update_data(_data));
    }

    // ### Update the visualization
    //
    //  This update method uses a nested callback block
    // to ensure that the data is actually updated and
    // sorted when the draw functions are called with it.
    //
    // with a data source,
    // with updates to that data source,
    // with the sort to the updated data source if needed
    //
    // and finally draw the table and graph with the sorted,
    // updated, data source
    function update() {
      with_data_source(function(a) {
        with_updates(a, function(b) {
          with_sort(b, function(c) {
            draw_table(c);
            draw_graph(c);
          });
        });
      });
    }
  };

  // ### Page Load Event
  // When the page is loaded in the browser and we can start
  // executing our script this function will be called.
  //
  // We simply create a new CollegeVis object and let it handle
  // the rest.
  $(document).ready(function() {
    var c = new Collegevis({});
  });
})(jQuery);
