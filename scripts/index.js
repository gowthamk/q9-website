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
  var console = $('div#console');
  console.html("");
  set_eg(this.value);
}

$('select#toggler').on('change',change_eg);
set_eg($('select#toggler option:selected').val());

/* web sockets */
function connect() {
  var sock = new WebSocket("ws://tryq9.com:8080/q9");
  sock.onmessage = function(event) {
    var msg = event.data;
    var console = $('div#console');
    var html = console.html();
    if(msg.includes("QUIT")){
      console.html(html+"$> ");
      alert("Done");
    } 
    else {
      console.html(html+msg+"<br />");
    }
  }
  sock.onerror = function(event) {
    alert("Socket error. Please retry!");
  }
  sock.onopen = function(event) {
    $('a#play').click(on_play);
  }
  return sock;
}

var sock = connect();

function on_play() {
  var console = $('div#console');
  var html = console.html();
  var app = $('select#toggler option:selected').val();
  var eff_ml = editor2.getValue();
  var data = {app:app, code:eff_ml};
  /*$.post("q9.php", data,
         function(data,status) {alert(status);});*/
  sock.send(JSON.stringify(data));
}


