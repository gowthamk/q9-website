var editor1 = ace.edit("editor1");
editor1.setTheme("ace/theme/xcode");
editor1.session.setMode("ace/mode/ocaml");
var editor2 = ace.edit("editor2");
editor2.setTheme("ace/theme/xcode");
editor2.session.setMode("ace/mode/ocaml");

function set_eg(app) {
  var crdt_ml = $('div#crdt_'+app+'_ml').text();
  var eff_ml = $('div#eff_'+app+'_ml').text();
  editor1.setValue(crdt_ml,-1);
  editor2.setValue(eff_ml,-1);
}

function change_eg() {
  set_eg(this.value);
}

$('select#toggler').on('change',change_eg);
set_eg($('select#toggler option:selected').val());
