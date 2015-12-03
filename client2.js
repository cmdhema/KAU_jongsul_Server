var mqtt = require('mqtt')

client = mqtt.createClient(1883, '192.168.1.1');

client.subscribe('presence2');

console.log('Client publishing.. ');
client.publish('topic/servo/1/on', 'Client 1 is alive.. Test Ping! ' + Date());
client.publish('topic/servo/2/off', 'Client 1 is alive.. Test Ping! ' + Date());

client.end();