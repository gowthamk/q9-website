<?php  
require 'vendor/autoload.php';
use Ratchet\MessageComponentInterface;  
use Ratchet\ConnectionInterface;


require 'q9_class.php';

$app = new Ratchet\App("tryq9.com", 8080, '0.0.0.0');
$app->route('/q9', new Q9);

$app->run();

?>
