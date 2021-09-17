export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
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
        const uri = `mongodb+srv://${req.body.login}:${req.body.password}@${req.body.URL}`;
        const client = new MongoClient(uri);
        client.connect();
        client.collection('users').insertOne({ login: req.body.login, password: req.body.password });
        client.close();
    });

    app.all('*', (req, res) => {
        res.send('neveraskedfor');
    });

    return app;
}