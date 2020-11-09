// Michal Franczel
var xsize = 41
var ysize = 31
var plocha

/*
Obrazky:

Cookie - zdroj: https://pixabay.com/cs/illustrations/cookie-sladk%C3%BD-j%C3%ADdlo-sladkosti-3180329/ - Pixabay License (commercial use, no need to source) 
Stena  - zdroj: https://libreshot.com/orange-brick-wall-pattern/ - Public domain license
Kruh   - zdroj: hhttps://commons.wikimedia.org/wiki/File:Ski_trail_rating_symbol_black_circle.png - Creative Commons Attribution-Share Alike 3.0 Unported
Kluc   - zdroj: https://pixabay.com/cs/vectors/kl%C3%AD%C4%8D-d%C5%AFm-%C4%8Derven%C3%A1-ikona-429208/ - Pixabay License (commercial use, no need to source) 
Dvere  - zdroj: https://pixabay.com/cs/illustrations/dvojit%C3%A9-dve%C5%99e-otev%C5%99eno-zav%C5%99eno-4758967/ -  Pixabay License (commercial use, no need to source)
Trava  - zdroj: https://commons.wikimedia.org/wiki/File:Grass_Texture.png - Creative Commons Attribution-Share Alike 4.0 International

Ziadne z obrazkov neboli nijakym sposobom upravovane.

*/

// sry
var images = {
  '2' : {
      image: new Image(),
      src : 'https://cdn.pixabay.com/photo/2018/02/25/12/06/cookie-3180329_960_720.png'
  },
  '3' : {
      image: new Image(),
      src : 'https://libreshot.com/wp-content/uploads/2019/11/orange-brick-wall-pattern-861x574.jpg'
  },
  '6' : {
      image: new Image(),
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Ski_trail_rating_symbol_black_circle.png'
  },
  '4': {
      image: new Image(),
      src: 'https://cdn.pixabay.com/photo/2014/08/27/14/34/key-429208_960_720.png'
  },
  '5': {
      image: new Image(),
      src: 'https://cdn.pixabay.com/photo/2020/01/11/23/58/double-4758967_960_720.png'
  },
  '0': {
      image: new Image(),
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Grass_Texture.png'
  }
}

//Union of Soviet Socialist Republics - Union Anthem
//Author: Union of Soviet Socialist Republics
//Licence (usage): Public domain - as things should be!
//src: https://archive.org/details/UnionOfSovietSocialistRepublics-UnionAnthem
var audio = new Audio('https://ia800702.us.archive.org/32/items/UnionOfSovietSocialistRepublics-UnionAnthem/ussr.union22_64kb.mp3')
var audioPlaying = false
var cell_size = 15 // 48 bolo moc velke, nezmestilo sa.
var canvas, ctx, debugButton, text, csvData
var socket
const keys = [39,40,37,38,76,75,74,73]


const setupKeys = () => {
  window.onkeydown = e => {
    var key = e.keyCode ? e.keyCode : e.which;
 
    if (keys.includes(key)) {
      e.stopPropagation();
      e.preventDefault();
      sendSignal(key)
    }
  }
}

const housenkaInit = () => {

  setupKeys()

  canvas = document.getElementById("myCanvas"); 

  ctx = $('#game').get(0).getContext('2d');
  ctx.canvas.width  = xsize*cell_size;
  ctx.canvas.height = ysize*cell_size;

  socket.onmessage = (e) => {
    var data = JSON.parse(e.data)
    plocha = data.board
    $('#score').text(data.score)
    $('#lives').text(data.lives)
    for(var x = 0; x < xsize; x++) {
      for(var y = 0; y < ysize; y++) {
        nastavBarvu(y*xsize + x, plocha[y*xsize + x])
      }
    }
  }

}

function nastavBarvu (pozice, barva) {

  ctx.drawImage(images[0].image, pozice % xsize * cell_size, Math.floor(pozice / xsize) * cell_size , cell_size, cell_size);
  
  if ( barva >= 2 || barva === 0) {
      ctx.drawImage(images[barva].image, pozice % xsize * cell_size, Math.floor(pozice / xsize) * cell_size , cell_size, cell_size);
  } else if (barva === 1) {
      ctx.drawImage(images[6].image, pozice % xsize * cell_size, Math.floor(pozice / xsize) * cell_size , cell_size, cell_size);
  } 
}

const getHighestScore = () => {
  $.ajax({
    url: '/maxscore',
    method: 'GET',
    contentType: 'application/json',
    success: (data) => {
      $('#maxScore').text(JSON.parse(data).score)
      $('#maxLevel').text(JSON.parse(data).level)
    }
  })
}


const makeElement = (data, prevElement) => {
  data.innerTags.forEach(element => {
    var el = document.createElement(element.tag);
    if (element.id) {
      el.id = element.id
    }
    if (element.innerText) {
      el.innerText = element.innerText
    } else if (element.innerTags) {
      makeElement(element, el)
    }
    if (element.className) {
      el.setAttribute("class", element.className)
    }
    for (var key in element) {
      if (key !== "innerText" && key !== "innerTags" && key !== "className") {
        el.setAttribute(key, element[key])
      }
    }
    prevElement.appendChild(el)
  })
}

const sendSignal = (signal) => {
  $.ajax({
    url: '/move/',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({input: signal}),
  })
  console.log(signal)
}

const loadCode = () => {
  $.ajax({
    url: '/code',
    method: 'GET',
    success: (data) => {
      $("#code").text(JSON.parse(data).code)
    }
  })
}

const joinGame = () => {
  var joinCode = Number($("#codeInput").val())

  $.ajax({
    url: '/code',
    method: 'POST',
    data: ({
      code: joinCode
    }),
  })

  loadContent("home")
}

function exportCSV(){
  $.ajax({
    url: '/csv',
    method: 'GET',
    success: (data) => {
      $("#export").attr("href", "data:text/csv;charset=UTF-8,"+data).attr("download", "export.csv");
    }
  })
}

const importCSV = () => {

  $('#csvImportInput').prop('files')[0].text().then((val) => {
    $.ajax({
      url: '/csv',
      method: 'POST',
      data: ({data: val})
    })
  })
}

const loadLiveGame = (gameid) => {
  loadContent(gameid)
}

const setupButtons = () => {
  $("#upButton").click(() =>sendSignal(38))
  $("#leftButton").click(() => sendSignal(37))
  $("#rightButton").click(() => sendSignal(39))
  $("#downButton").click(() => sendSignal(40))

  $("#saveButton").click(downloadGame)
  $("#loadButton").click(() => {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = () => {
      input.files[0].text().then((game) => {
        uploadGame(game)
      })
    }
  })
}

const downloadGame = () => {
  $.ajax({
    url: '/game',
    method: 'GET',
    contentType: 'json',
    success: (data) => {
      console.log(data)
      var dwn = document.createElement("a")
      dwn.setAttribute("href","data:text/json;charset=utf-8," + encodeURIComponent(data));
      dwn.setAttribute("download", "game.json");
      dwn.click();
    }
  })
}

const uploadGame = (game) => {
  $.ajax({
    url: '/game',
    method: 'POST',
    data: ({data: game})
  })
}

const playMusic = () => {
  if (audioPlaying) {
    audio.pause()
    audioPlaying = false
    $('#playButton').text('Play music')
  } else {
    audio.play()
    audioPlaying = true
    $('#playButton').text('Stop music')
    audio.currentTime = 0
  }
}

const loadContent = (page) => {
  console.log(page)
  $.ajax({
    url: '/data/'+page,
    method: 'GET',
    contentType: 'json',
    success: (data) => {
      data = JSON.parse(data)
      document.getElementById("container").innerHTML = ''
      
      makeElement(data, container)
      if(socket) {
        socket.close()
      }
      $("#loginForm").submit((e) => login(e, page))
      $("#registerForm").submit((e) => register(e, page))
      $("#openLogin").click(() => {
        $('#loginModal').modal('show')
      })
      $("#openRegister").click(() => {
        $('#loginModal').modal('hide')
        $('#registerModal').modal('show');
      })

      $('#loginModal').on('shown.bs.modal', () => {
        sendSignal(80)
        window.onkeydown = () => {}
      })
      $('#registerModal').on('shown.bs.modal', () => {
        window.onkeydown = () => {}
      })
      $('#playButton').click(playMusic)

      $('#loginModal').on('hidden.bs.modal', setupKeys)
      $('#registerModal').on('hidden.bs.modal', setupKeys)

      if (page === "home") {
        getHighestScore()
        setupButtons()
      }
      if (page === "admin") {
        exportCSV()
        $("#import").click(importCSV)
      }
      if(page !== "leaderboard" && page !== "live" && page !== "admin") {
        socket= new WebSocket('ws://localhost:8082');
        housenkaInit()
        loadCode()
        $("#joinButton").click(joinGame)
      } else if(page === "live") {
        for (var i = 0; i < $('button[id^="liveBtn"]').length; i++) {
          document.getElementById('liveBtn'+i).onclick = () => loadLiveGame(data.innerTags[1].innerTags[0].innerTags[0].innerTags[1].innerTags[i-1].innerTags[1].innerText)
        }
      } 
    }
  })
}

const login = (e, page) => {
  e.preventDefault()
  var actionurl = e.currentTarget.action;
  $.ajax({
    url: actionurl,
    method: 'POST',
    data: ({
      username: $("#usernameField").val(),
      password: $("#passwordField").val()
    }),
    success: (data) => {
      var data = JSON.parse(data)
      if (data.type === "success") {
        $('#loginModal').modal('hide')
        loadContent(page)
      } else {
        $('#loginMessage').text(data.message)
      }
    }
  })
}

const register = (e, page) => {

  e.preventDefault()
  var actionurl = e.currentTarget.action;
  $.ajax({
    url: actionurl,
    method: 'POST',
    data: ({
      username: $("#regUsernameField").val(),
      password: $("#regPasswordField").val(),
      email: $("#regEmailField").val()
    }),
    success: (data) => {
      var data = JSON.parse(data)
      if (data.type === "success") {
        $('#registerModal').modal('hide')
        loadContent(page)
      } else {
        $('#registerMessage').text(data.message)
      }
    }
  })
}


const router = () => {
  console.log(document.getElementsByTagName("ul"))
  const routes = [
    { path: "/", view: 'home'},
    { path: "/leaderboard", view: 'leaderboard' },
    { path: "/live", view: 'live'},
    { path: "/admin", view: 'admin'}
  ]

  var [match] = routes.filter( route => route.path === location.pathname)

  if ( !match ) {
    match = routes[0]
  }

  loadContent(match.view)
  
  images['2'].image.src = images['2'].src
  images['0'].image.src = images['0'].src
  images['3'].image.src = images['3'].src
  images['6'].image.src = images['6'].src
  images['4'].image.src = images['4'].src
  images['5'].image.src = images['5'].src
}

document.addEventListener("DOMContentLoaded", () => {
  router()
})
