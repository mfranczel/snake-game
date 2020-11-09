// Michal Franczel
import Game from './Game.js'
var express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
var path = require('path')
var uid = require('uid')
var ws = require('ws')
var uid = require('uid')

import Home from './components/Home'
import Leaderboard from './components/Leaderboard'
import LiveGames from './components/LiveGames'
import LoginModal from './components/LoginModal'
import Navbar from './components/Navbar'
import AdminDashboard from './components/AdminDashboard'
import RegisterModal from './components/RegisterModal.js';

const cookie = require('cookie')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt');
const { Parser } = require('json2csv');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');

const app = express()
const wss = new WebSocket.Server({ port: 8082 });

var runningGames = []
var speed = 250

const home = new Home()
const leaderboard = new Leaderboard()
const liveGames = new LiveGames()
const loginModal = new LoginModal()
const navbar = new Navbar()
const adminDashboard = new AdminDashboard()
const registerModal = new RegisterModal()


var db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.log(err.message)
  } else {
    console.log("Connected to database")
  }
})

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  username TEXT NOT NULL UNIQUE, 
  email TEXT NOT NULL UNIQUE, 
  password TEXT NOT NULL, 
  maxscore INTEGER,
  maxlevel INTEGER
  )`
)
db.run(`CREATE TABLE IF NOT EXISTS gamelog (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  userid INTEGER, 
  session TEXT,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL,
  FOREIGN KEY(userid) REFERENCES users(id)
  )`
)

const sessionParser = session({secret: 'henlo my friends',saveUninitialized: true,resave: false})

app.use(sessionParser);
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("client"))

wss.on('connection', function connection(ws, request) {

  var sid = cookieParser.signedCookie(cookie.parse(request.headers.cookie)['connect.sid'], 'henlo my friends')

  var game = runningGames.find(game => game.sessionID.indexOf(sid) >= 0 || game.liveSessions.indexOf(sid) >= 0)
  game.wss.push(ws)

  ws.on('close', () => {
    if (game => game.sessionID.indexOf(sid) >= 0){
      game.game.state = "stopped"
      var l = game.wss.indexOf(ws)
      game.wss.splice(l, 1)
    } 
    
  })
});


// sends game board to every user that is playing every x seconds, stops when page is reloaded
setInterval(() => {
  runningGames.forEach(game => {
    var message = {
      score: game.game.body,
      lives: game.game.lives,
      board: game.game.board
    }
    if (game.game.state === "running") {
      game.game.pohybHousenky()
      game.wss.forEach(ws => {
        ws.send(JSON.stringify(message))
      })
    } else if ( game.game.state === "init") {
      game.game.state = "paused"
      game.game.start()
      game.wss.forEach(ws => {
        ws.send(JSON.stringify(message))
      })
    } else if ( game.game.state === "paused") {
      game.wss.forEach(ws => {
        ws.send(JSON.stringify(message))
      })
    } else {
      var score, level
      if (game.game.body > game.game.max_body) {
        score = game.game.body
      } else {
        score = game.game.max_body
      }

      if (game.game.level > game.game.max_level) {
        level = game.game.level
      } else {
        level = game.game.max_level
      }
      if (score > 0){
        if (game.userID) {
          db.run('INSERT INTO gamelog(userid, session, score, level) VALUES (?,?,?,?)',[game.userID, game.sessionID[0], score, level],function(err) {if (err) console.log(err.message)})
          
          db.get('SELECT * FROM users WHERE id = ?', [game.userID], function (err, row){
            if (row.maxscore < score) {
              db.run('UPDATE users SET maxscore = ?, maxlevel=? WHERE id = ?', [score, level, game.userID])
            }
          })
        } else {
          db.run('INSERT INTO gamelog(session, score, level) VALUES (?,?,?)',[game.sessionID[0], score, level],function(err) {if (err) console.log(err.message)})
        }
      }
      runningGames.splice(runningGames.indexOf(game), 1)
    }
  })
}, speed)

//returns user info in csv format
app.get('/csv', (req, res) => {
  if (req.session.username === "admin") {
    db.all('SELECT * FROM users', (err, rows) => {
      const fields = ['username', 'email', 'password', 'maxscore', 'maxlevel'];
      const opts = { fields };
      
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(rows);
        res.send(csv)
      } catch (err) {
        console.log("ERROR parsing user data")
      }
    })
  }
})

//converts csv to jason
var csv2JSON = (csv) => {
  var vals = csv.split('\n'), ret = [];
  for(var i = 1; i < vals.length; i++ ){
    let user = vals[i].split(',');
    ret.push({
      username : user[0].split('"').join(''),
      email : user[1].split('"').join(''),
      password : user[2].split('"').join(''),
      maxscore : Number(user[3]),
      maxlevel: Number(user[4])
    });
  }
  return ret;
}

//restores user database from csv file
app.post('/csv', (req, res) => {
  if (req.session.username === "admin") {
    var userData = req.body.data
    db.run('DELETE FROM gamelog')
    db.run('DELETE FROM users')
    db.run('vacuum')
    csv2JSON(userData).forEach(user => {
      db.run('INSERT OR REPLACE INTO users(username, email, password, maxscore, maxlevel) VALUES (?,?,?,?,?)', [user.username, user.email, user.password, user.maxscore, user.maxlevel], (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
    db.all('SELECT * FROM users', (err, row) => {
      if (err) {
        console.log(err)
      }
      console.log(row)
    })
  }
  res.end()
})

//returns maxscore and maxlevel for either user or session if not logged in
app.get('/maxscore', (req, res) => {
  if (req.session.loggedin) {
    db.get('SELECT * FROM users WHERE id = ?', [req.session.userId], function (err, row) {
      if (row) {
        res.send(JSON.stringify({score: row.maxscore, level: row.maxlevel}))
      }
    })
  } else {
    db.get('SELECT * FROM gamelog WHERE session = ? ORDER BY score DESC LIMIT 1', [req.sessionID], (err, row) => {
      if (row) {
        res.send(JSON.stringify({score: row.score, level: row.level}))
      } else {
        res.send(JSON.stringify({score: 0, level: 0}))
      }
    })
  }
})  

// creates new game and adds it to current games that are being played 
const makeGame = (req, wss, sess, game) => {
  var newGame

  if(req.session.loggedin) {
    newGame = {
      gameID: uid(),
      game: game,
      sessionID: [...sess, req.sessionID],
      userID: req.session.userId,
      code: Math.floor(Math.random() * Math.floor(10000)),
      wss: wss,
      liveSessions: []
    }
  } else {
    newGame = {
      gameID: uid(),
      game: game,
      sessionID: [...sess, req.sessionID],
      code: Math.floor(Math.random() * Math.floor(10000)),
      wss: wss,
      liveSessions: []
    }
  }
  newGame.game.state = "paused"
  runningGames.push(newGame)
}

//adds game to current games that are being played
app.post('/game', (req, res) => {
  var data = JSON.parse(req.body.data)
  var newGame = new Game()

  for (var key in data) {
    newGame[key] = data[key]
  }

  var wssCopy, sessionCopy

  runningGames.forEach(game => {
    if (game.sessionID.indexOf(req.sessionID) >= 0) {
      game.game.state = "stopped"
      wssCopy = game.wss
      sessionCopy = game.sessionID
    }
  })
  makeGame(req, wssCopy, sessionCopy, newGame)
  res.end()

})

// returns json representation of game that is being played
app.get('/game', (req, res) => {
  var game = runningGames.find(game => game.sessionID.indexOf(req.sessionID) >= 0).game
  res.send(JSON.stringify(game))
})

//makes home page
const makeHome = (req, nav) => {
  var game

  // check if logged in, find game for sess or user if there is a paused one
  if (req.session.loggedin) {      
    game = runningGames.find(game => game.userID && (game.userID === req.session.userId) && game.game.state === "paused")
  } else {
    game = runningGames.find(game => (game.sessionID.indexOf(req.sessionID) >= 0) && game.game.state === "paused")
  }

  if (!game){
    game = new Game()
    makeGame(req, [], [], game)
    game.start()
  } else {
    if(req.session.loggedin) {
      game.sessionID.push(req.sessionID)
    }
  }
  var content = {
    innerTags: [
      nav,
      home.home,
      loginModal.loginModal,
      registerModal.registerModal
    ]
  }
  return content
}

//makes leaderboard page
const makeLeaderboard = (req, nav) => {
  db.all('SELECT * FROM gamelog LEFT JOIN users ON users.id = gamelog.userid ORDER BY score DESC LIMIT 20', (err, rows) => {
    leaderboard.insertValues(rows)
  })

  var content = {
    innerTags: [
      nav,
      leaderboard.leaderboard,
      loginModal.loginModal,
      registerModal.registerModal
    ]
  }
  return content
}

//makes live page
const makeLive = (nav) => {
  var running = runningGames.filter(game => game.game.state == "running")
  var scores = running.map(game => ({
    id: game.gameID,
    score: game.game.body
  }))

  liveGames.insertValues(scores)

  var content = {
    innerTags: [
      nav,
      liveGames.liveGames,
      loginModal.loginModal,
      registerModal.registerModal
    ]
  }
  return content
} 

//makes admin page
const makeAdmin = (nav) => {
  db.all('SELECT * FROM users', (err, rows) => {
    adminDashboard.populateTable(rows, runningGames)
  })
  var content = {
    innerTags: [
      nav,
      adminDashboard.adminDashboard
    ]
  }
  return content
}

//makes page for live watching
const watchGame = (req, nav) => {
  var gameid = req.params.type
  var game = runningGames.find(game => game.gameID == gameid) 

  game.liveSessions.push(req.sessionID)
    
  var modifiedHome = JSON.parse(JSON.stringify(home.home))
  modifiedHome.innerTags = modifiedHome.innerTags.slice(0, 2)

  var content = {
    innerTags: [
      nav,
      modifiedHome,
      loginModal.loginModal,
      registerModal.registerModal
    ]
  }
  return content
}

app.get('/data/:type', (req, res) => {

  var content = "{}"
  var nav = navbar.navbar

  if(req.session.username) {
    if (req.session.username === 'admin') {
      nav = navbar.withAdmin()
    } else {
      nav = navbar.withUser(req.session.username)
    }
  } 

  if(req.params.type === "home") {
    content = makeHome(req, nav)
  } else if (req.params.type === "leaderboard"){
    content = makeLeaderboard(req, nav)
  } else if (req.params.type === "live"){
    content = makeLive(nav)
  } else if (req.params.type === "admin") {
    if (req.session.username === "admin") {
      content = makeAdmin(nav)
    } else {
      res.end()
      return
    }
  } else {
    content = watchGame(req, nav)
  }
  res.send(JSON.stringify(content))
})

//returns game code for session
app.get('/code', (req, res) => {
  var sessionID = req.sessionID
  var code
  runningGames.forEach(game => {
    if (game.sessionID.indexOf(sessionID) >= 0) {
      code = JSON.stringify({code: game.code})
    }
  })
  res.send(code)
})

app.post('/code', (req, res) => {
  var sessionID = req.sessionID
  var code = Number(req.body.code)
  var game = runningGames.find(game => game.code === code)

  if(game) {

    runningGames.forEach(game => {
      var index = game.sessionID.indexOf(sessionID)
      if (index >= 0) {
        game.sessionID.splice(index, 1)
      }
    })

    game.sessionID.push(sessionID)

    res.send("Success")
  } else {
    res.send("Error")
  }
})

//moves key in given running game
app.post('/move', (req, res) => {
  var key = req.body.input
  
  runningGames.find(game => game.sessionID.indexOf(req.sessionID) >= 0 && game.game.state !== "stopped")?.game.stiskKlavesy(key)
  res.send("")

})

//loggs out (destroys sess)
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

//registers new user
app.post('/register', (req, res) => {
  var username = req.body.username
  var password = req.body.password
  var email = req.body.email

  if (email && password && username) {
    if(!/^[a-zA-Z]+$/.test(username)){
      res.send(JSON.stringify({
        type: "error",
        message: "Username should contain only [a-zA-Z] characters!"
      }))
      return
    }

    if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      res.send(JSON.stringify({
        type: "error",
        message: "Please, provide valid email address."
      }))
      return
    }
    bcrypt.hash(password, 10, function(error, hash) {
      db.run('INSERT INTO users(username, email, password, maxscore, maxlevel) VALUES (?,?,?,?,?)', [username, email, hash, 0,0], function (err) {
        if (err) {
          console.log(err)
          res.send(JSON.stringify({
            type: "error",
            message: "User might already exist"
          }))
        } else {
          req.session.loggedin = true;
          req.session.username = username;
          req.session.userId = this.lastID;
          res.send(JSON.stringify({
            type: "success",
            message: "Account successfully created"
          }))
        }
      })
    })
  } else {
    res.send(JSON.stringify({
      type: "error",
      message: "Provide all required information"
    }))
  }

})

//loggs user in
app.post('/login', (req, res) => {
	var username = req.body.username;
  var password = req.body.password;
  
	if (username && password) {

    db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
      if (row && bcrypt.compareSync(password, row.password)) {
        req.session.loggedin = true;
        req.session.username = username;
        req.session.userId = row.id;
        res.send(JSON.stringify({
          type: "success",
          message: "Logged in"
        }))
      } else {
        res.send(JSON.stringify({
          type: "error",
          message: "Username or password is incorrect"
        }))
      }
    })
	} else {
		res.send(JSON.stringify({
      type: "error",
      message: "Please enter username and password!"
    }))
  }
});

//returns page
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"))
})

app.listen(8080, () => {console.log("Server listening on 8080")})
