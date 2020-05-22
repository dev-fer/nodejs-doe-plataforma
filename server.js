const express = require('express');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));

const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: '5432',
  database: 'bloodonation'
});

const nunjucks = require('nunjucks');
nunjucks.configure('./', { express: app, noCache: true });

app.get('/', (req, res) => {
  
  const query = `SELECT * FROM donors`;

  db.query(query, function(err, result) {
    if(err) return res.send('Erro ao buscar dados');

    const donors = result.rows;
    return res.render('index.html', { donors });
  });
  
});

app.post("/", (req,res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.");
  }

  const query = `INSERT INTO donors ("name", "email", "blood") 
            VALUES ($1, $2, $3)`;

  const data = [name, email, blood];
  
  db.query(query, data, function(err) {
    if (err) return res.send('Erro ao registrar dados.');

    return res.redirect('/');
  })

});

app.listen(3333);