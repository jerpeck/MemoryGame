const   express         = require('express'),
        app             = express(),
        port            = 3000;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.sendFile(index.html);
});

app.listen(port, function(){
    console.log('memory_simon listening on 3000');
});