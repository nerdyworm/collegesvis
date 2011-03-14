(function( $ ){
  var Collegevis = function() {
    var sample_data = [
      { }, { }
    ];

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
    $sliders.bind('slide', update);

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

    draw();
  };


  $(document).ready(function() {
    var c = new Collegevis({});
  });
})(jQuery );
