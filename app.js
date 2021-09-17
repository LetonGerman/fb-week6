export default function appSrc(express, bodyParser, createReadStream, crypto, http, MongoClient) {
    const app = express();

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin','*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,OPTIONS,DELETE');
        next();
    });
    app.use(express.json());
    app.use(bodyParser.urlencoded({extended : true}));
    app.use(bodyParser.text());

    app.get('/login/', (req, res) => {
        res.send('neveraskedfor');
    });

    app.get('/code/', (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
        createReadStream(import.meta.url.substring(7)).pipe(res);
    });

    app.get('/sha1/:input', (req, res) => {
        var shasum = crypto.createHash('sha1');
        shasum.update(req.params.input);
        res.send(shasum.digest('hex'));
    });

    app.get('/req/', (req, res) => {

        if (req.query.addr) {
            http.get(req.query.addr, (get) => {
                let data = '';

                get.on('data', (chunk) => {
                    data += chunk;
                });
                
                get.on('end', () => {
                    res.send(data);
                });
                
                }).on("error", (err) => {
                res.send(data);
                });
        } else {
            res.send('no addr found');
        }

    });

    app.post('/req/', (req, res) => {
        http.get(req.body.replace('addr=', ''), (get) => {
            let data = '';

            get.on('data', (chunk) => {
              data += chunk;
            });
          
            get.on('end', () => {
                res.send(data);
            });
          
          }).on("error", (err) => {
            res.send(data);
          });
    });

    app.post('/insert/', (req, res) => {
        console.log(req);
        const uri = req.body.URL;
        MongoClient.connect(uri, function(err, db) {
            if(err) throw err;
            
            db.collection('users').insert({ login: req.body.login, password: req.body.password });
        });
    });

    app.all('*', (req, res) => {
        res.send('neveraskedfor');
    });

    return app;
}