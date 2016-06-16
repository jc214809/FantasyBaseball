$(function() {
  var spinner = {
    hide: function() {
      $('#spinnerSection').hide();
    },
    show: function() {
      $('#spinnerSection').show();
    }
  }
  var spinner = Object.create(spinner);
  spinner.hide();
});
