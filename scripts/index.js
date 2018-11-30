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

function on_click_ce(e) {
  e.preventDefault();
  var href = $(this).attr('href');
  var display = $('div#ce_display'); 
  display.css("background", "url('"+href+"') no-repeat");
  display.css("background-size", "contain");
}

/* web sockets */
function connect() {
  var sock = new WebSocket("ws://tryq9.com:8080/q9");
  sock.onmessage = function(event) {
    var msg = event.data;
    if(msg.includes("QUIT")){
			$('div#console ul').append('<li class="prompt"></li><li></li>');
      $('a.ce_link').click(on_click_ce);
    } 
    else {
      var msg = msg.replace('\t','<span class="spc" />');
      var last_li = $('div#console ul li').last();
      var li_html = last_li.html();
      last_li.html(li_html+msg);
      if(msg.endsWith("\n")) {
        $('div#console ul').append('<li></li>');
      }
      /*else {
        console.log("#"+msg+"#");
        var last_li = $('div#console ul li').last();
        var li_html = last_li.html();
        last_li.html(li_html+msg);
      }*/
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

function change_eg() {
  var console = $('div#console ul');
  console.html('<li class="prompt"></li><li></li>');
  $('div#ce_display').removeAttr("style");
  set_eg(this.value);
}

$('select#toggler').on('change',change_eg);
set_eg($('select#toggler option:selected').val());

function on_play(e) {
  e.preventDefault();
  var last_prompt = $('div#console ul li.prompt').last();
  last_prompt.html("./q9_analyze");
  var app = $('select#toggler option:selected').val();
  var eff_ml = editor2.getValue();
  var data = {app:app, code:eff_ml};
  /*$.post("q9.php", data,
         function(data,status) {alert(status);});*/
  sock.send(JSON.stringify(data));
}


