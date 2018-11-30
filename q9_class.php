<?php
//namespace Q9App;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use React\Stream\ReadableResourceStream as Stream;

require './vendor/autoload.php';

class Q9 implements MessageComponentInterface {

  private $loop;

  public function __construct(\React\EventLoop\LoopInterface $loop) {
    $this->loop = $loop;
  }

  public function onOpen(ConnectionInterface $conn) {
    echo "New conn!\n";
  }

  private function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
	}

  public function onMessage(ConnectionInterface $conn, $msg) {
    echo("onMessage\n");
    $obj = json_decode($msg);
    $rand_str = $this->generateRandomString();
    $header = ($obj->app)."_app_header.ml";
    $app = ($obj->app)."_".($rand_str)."_app.ml";
    shell_exec('cp '.$header.' '.$app);
    $handle = fopen($app, 'a') or die('Cannot open file:  '.$app);
    fwrite($handle, $obj->code);
    fclose($handle);
    /* execute q9 */
    echo("File generated\n");
    $cmd = './q6 -k 4 -c store_interface.mli store_interface.ml uuid.mli uuid.ml q6_interface.ml '.$app;
    flush();
    $stream = new Stream(popen($cmd, "r"),$this->loop);
    $stream->on('data', function($data) use ($conn) {
      $conn->send($data);
      echo($data);
    });
		$stream->on('end', function () use ($conn){
      $conn->send("QUIT");
			echo 'END';
		});
    /*if (is_resource($handle)) {
        echo("Running..\n");
        while ($s = fgets($handle)) {
            $conn->send($s);
            echo($s);
        }
    }
    else {
        echo("Command couldn't run\n");
    }
    $conn->send("QUIT");*/
  }

  public function onClose(ConnectionInterface $conn) {
  }

  public function onError(ConnectionInterface $conn, \Exception $e) {
  }
}
