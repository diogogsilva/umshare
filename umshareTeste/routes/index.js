var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')

router.get('/', verificaAutenticacao, function (req, res) {
  res.render('index', { user: req.user.email })
});

router.get('/feed', verificaAutenticacao, function (req, res) {
  axios.get('http://localhost:5003/publicacoes?utilizador=' + req.user.email)
    .then(dados => res.json(dados.data))
    .catch(erro => console.log(erro))
});

router.get('/grupos', verificaAutenticacao, function (req, res) {
  axios.get('http://localhost:5003/grupos')
    .then(dados => res.json(dados.data))
    .catch(erro => console.log(erro))
});

router.get('/grupo/:gid', verificaAutenticacao, function (req, res) {
  var dados1, dados2, dados4, isAdmin;
  var dados3 = [];
  axios.get('http://localhost:5003/grupos/' + req.params.gid)
    .then(dados => {
      dados1 = dados.data;
      // ADMIN
      var token = jwt.sign({}, "umshare",
      {
        expiresIn: 3000,
        issuer: "Servidor UMShare"
      })
      axios.get('http://localhost:5003/utilizadores/' + dados1.admin + '?token=' + token)
        .then(dados => {
          dados2 = dados.data;
          if(dados.data.email == req.user.email) {
            isAdmin = 1;
          } else {
            isAdmin = 0;
          }
          // MEMBROS
          dados1.membros.forEach(function(membro, index) {
            var token = jwt.sign({}, "umshare",
            {
              expiresIn: 3000,
              issuer: "Servidor UMShare"
            })
            axios.get('http://localhost:5003/utilizadores/' + membro + '?token=' + token)
            .then(dados => {
              if(dados.data != null) {
                dados3.push(dados.data)
              }
              if(index == dados1.membros.length -1) {
                axios.get('http://localhost:5003/publicacoes?grupo=' + 123)//dados1._id) 
                  .then(dados => {
                    dados4 = dados.data;
                    res.json({grupo: dados1, admin: dados2, isAdmin: isAdmin, membros: dados3, publicacoes: dados4})
                  })
                  .catch(erro => console.log(erro))
              }
            })
            .catch(erro => console.log(erro))
          });
          // FIM MEMBROS
        })
        .catch(erro => console.log(erro))
        //FIM ADMIN
    })
    .catch(erro => console.log(erro))
});

router.get('/perfil', verificaAutenticacao, function (req, res) {
  var token = jwt.sign({}, "umshare",
    {
      expiresIn: 3000,
      issuer: "Servidor UMShare"
    })
  axios.get('http://localhost:5003/utilizadores/' + req.user.email + "?token=" + token)
    .then(dados => res.json(dados.data))
    .catch(erro => console.log(erro))
});

router.get('/logout', verificaAutenticacao, function (req, res) {
  req.logout()
  res.redirect('/')
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.get('/register', function (req, res) {
  res.render('register')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/login',
  successFlash: 'Utilizador autenticado com sucesso!',
  failureRedirect: '/erro',
  failureFlash: 'Utilizador ou password inválido(s)...'
})
)

router.post('/addMembro', verificaAutenticacao, function (req, res) {
  var token = jwt.sign({}, "umshare",
  {
    expiresIn: 3000,
    issuer: "Servidor UMShare"
  })
  axios.get('http://localhost:5003/utilizadores/' + req.body.idMembro + "?token=" + token)
    .then(dados => {
      if (dados.data == undefined) {
        res.jsonp({ "status": "erro", "msg": "Utilizador '" + req.body.idMembro + "' não encontrado!" })
      } else {
        axios.get('http://localhost:5003/grupos/' + req.body.gid)
        .then(dados => {
          var existe;
          dados.data.membros.forEach(element => {
            if(element == req.body.idMembro) {
              existe = true;
            }
          });
          if(existe){
            res.jsonp({ "status": "erro", "msg": "Utilizador '" + req.body.idMembro + "' já pertence ao grupo!" })
          } else {
            axios.post('http://localhost:5003/grupos/addMembro', {
              gid: req.body.gid,
              idMembro: req.body.idMembro
            })
            .then(dados => res.jsonp({ "status": "ok", "msg": "Adicionado com sucesso!" }))
            .catch(e => res.jsonp({ "status": "erro", "msg": "Algo correu mal!" }))
          }
        })
        .catch(e => res.render('error', { error: e }))
      }
    })
    .catch(e => res.render('error', { error: e }))
})

router.post('/removeMembro', verificaAutenticacao, function (req, res) {
  axios.get('http://localhost:5003/grupos/' + req.body.gid)
    .then(dados => {
      var existe;
      dados.data.membros.forEach(element => {
        if(element == req.body.idMembro) {
          existe = true;
        }
      });
      if(existe){
        axios.post('http://localhost:5003/grupos/removeMembro', {
              gid: req.body.gid,
              idMembro: req.body.idMembro
            })
            .then(dados => res.jsonp({ "status": "ok", "msg": "Removido com sucesso!" }))
            .catch(e => res.jsonp({ "status": "erro", "msg": "Algo correu mal!" }))
      } else {
        res.jsonp({ "status": "erro", "msg": "Grupo não contém o utilizador '" + req.body.idMembro + "'!" })
      }
    })
    .catch(e => res.render('error', { error: e }))
})

router.post('/reg', function (req, res) {
  var token = jwt.sign({}, "umshare",
    {
      expiresIn: 3000,
      issuer: "Servidor UMShare"
    })
  var hash = bcrypt.hashSync(req.body.password, 10);
  axios.get('http://localhost:5003/utilizadores/' + req.body.email + "?token=" + token)
    .then(dados => {
      if (dados.data != undefined) {
        res.jsonp({ "status": "erro", "msg": "Email já em uso!" })
      } else {
        axios.post('http://localhost:5003/utilizadores', {
          email: req.body.email,
          nome: req.body.nome,
          password: hash
        })
          .then(dados => res.jsonp({ "status": "ok", "msg": "Registado com sucesso!" }))
          .catch(e => res.render('error', { error: e }))
      }
    })
})

function verificaAutenticacao(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("verificou a autenticação!")
    next();
  } else {
    console.log("não verificou a autenticação!")
    res.redirect("/login");
  }
}

module.exports = router;
