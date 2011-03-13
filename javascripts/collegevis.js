(function( $ ){

  $.fn.collegevis = function() {
    // defaults
    var init_slider_value = 65;

    // controls and view variables
    var $controls = $('#controls'),
        $sliders  = $('.slider'),
        $views    = $('#views'),
        $tabs     = $("#tabs");

    // make controlls active
    $sliders.slider({value: init_slider_value});
    $tabs.tabs();

    // make the views same height as controlls
    $views.height($controls.outerHeight());

    // update the tabs panels to match this
    // 80 is the height of the tabs
    $tabs.find(".ui-tabs-panel").height($controls.outerHeight() - 80);


  };


})(jQuery );



$(document).ready(function() {

  $(document).collegevis();

      $('.slider').slider({value: 50});
      $('#tabs').tabs();
    });
