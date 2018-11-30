<?php  
require 'vendor/autoload.php';
use Ratchet\MessageComponentInterface;  
use Ratchet\ConnectionInterface;


require 'q9_class.php';

require './vendor/autoload.php';

$loop = \React\EventLoop\Factory::create();
$app = new Ratchet\App("tryq9.com", 8080, '0.0.0.0', $loop);
$app->route('/q9', new Q9($loop));

$app->run();

?>
