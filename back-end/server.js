const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const multer = require('multer')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

//Database modellen
const User = require('./models/user.model')
const Favorites = require('./models/favorite.model')

//Gebruik express
const app = express()
const port = 2999;

//file upload configuratie
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './static/public/assets/uploads')
  },
  filename: (req, file, cb) => {
    let fileExtention
    if(file.mimetype === 'image/jpeg'){
      fileExtention = '.jpeg'
    }else if(file.mimetype === 'image/png') {
      fileExtention = '.png'
    }
    cb(null, new Date().toISOString() + fileExtention)
  }
})

//Check of file .jepg og .png is
const fileFilter = (req, file, cb) => {
  //zo ja upload de foto
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  }else{
    cb(null, false)
  }
}

//set file size to 5MB
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

//Database config
app.use(express.json())
const uri  = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@matchingapp.8cqli.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority';


//Database connectie start
mongoose.Promise = global.Promise
mongoose.connect( uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log('Connection succesfull'))
.catch((err) => console.error(err))

// Statische bestanden
app.use(express.static('static/public'))
app.use('/css', express.static(__dirname + 'static/public/css'))
app.use('/js', express.static(__dirname + 'static/public/js'))
app.use('/assets', express.static(__dirname + 'static/public/assets'))

//gebruik body-parser in app
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//gebruik ejs
app.set('view engine','ejs')

//Session Logic
const {
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!quiet,it\'asecret!',
  SESS_LIFETIME = 1000 * 60 * 60 * 2
} = process.env

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    originalmaxAge: SESS_LIFETIME,
    sameSite: true,
    secure: false //set true if in production
  }
}))

//Checkt of je ingelogd bent zo nee ga naar inlog pagina
const redirectLogin = (req, res, next) => {
  if(!req.session.userId) {
    res.redirect('/')
  }else{
    next()
  }
}

//Checkt of je al eerder bent ingelogd zo ja ga naar dashboard
const redirectDash = (req, res, next) => {
  if(req.session.userId) {
    res.redirect('/dashboard')
  }else{
    next()
  }
}



//login pagina
app.get('/', redirectDash, async (req, res) => { 
  res.render('index')
})

app.post('/', async (req, res) => {
  let emailPost = req.body.email
  let passwordPost = req.body.password
  if (emailPost && passwordPost) {
    try{
      const user = await User.findOne({
        email: emailPost
      }, async (err, obj) => {
          if (!obj) {
            //Geen gebruiker gevonden
            res.render('index', { errorMsg: 'Geen user gevonden' })
          } else {
            //Check de gehashde wachtwoorden
            await bcrypt.compare(passwordPost, obj.pwd, (err, result) => {
                if (result) {
                  //Gebruiker is ingelogd, add cookie
                  req.session.userId = obj._id
                  return res.redirect('/dashboard')
                } else {
                  //Wachtwoord incorrect
                  res.render('index', { errorMsg: 'User gevonden maar wachtwoord incorrect' })
                }
              })
          }
        })
    }catch (error) {
      console.log(error)
    }
  }
})



//logout pagina
app.get('/logout', redirectLogin, (req, res) => {
  res.render('dashboard.ejs')
})

app.post('/logout', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard')
    }
    res.clearCookie(SESS_NAME)
    res.redirect('/')
  })
})



//dashboard pagina
app.get('/dashboard', redirectLogin, async (req, res) => {
  try{
    //Vind de gebruiker die inlogd is
    await User.find({ _id: req.session.userId},'_id email firstname lastname age gymname gymplace gymerv profilePic bio', async (err, obj) => {
      if (obj) {
        //Vind alle gebruikers behalve de gene die is ingelogd
        await User.find({ _id: {$ne: req.session.userId}},'_id email firstname lastname age gymname gymplace gymerv profilePic bio', async (err, obj2) => {
          if (obj2) {
            //Vind de buddies
            await Favorites.find({ fromBuddie: req.session.userId }, 'toBuddie',async (err, obj3) => {
              res.render('dashboard.ejs', {ingelogd: obj, gebruikers: obj2, favos: obj3, currentId: req.session.userId})
            })
          }
        })
      }
    })
  }catch (error) {
    console.log(error)
  }
})



//favorites pagina
app.get('/favorites', redirectLogin, async (req, res) => {
  try{
    //Vind de gebruiker die inlogd is
    await User.find({ _id: req.session.userId},'_id email firstname lastname age gymname gymplace gymerv profilePic bio', async (err, obj) => {
      if (obj) {
        //Vind alle gebruikers behalve de gene die is ingelogd
        await User.find({ _id: {$ne: req.session.userId}},'_id email firstname lastname age gymname gymplace gymerv profilePic bio', async (err, obj2) => {
          if (obj2) {
            //Vind de buddies
            await Favorites.find({ fromBuddie: req.session.userId }, 'toBuddie',async (err, obj3) => {
              res.render('favorites.ejs', {ingelogd: obj, gebruikers: obj2, favos: obj3, currentId: req.session.userId})
            })
          }
        })
      }
    })
  }catch (error) {
    console.log(error)
  }
})

//profile pagina
app.get('/profile', redirectLogin, async (req, res) => {
  try{
    await User.find({ _id: req.session.userId},'_id email firstname lastname age gymname gymplace gymerv profilePic bio', async (err, obj) => {
      if (obj) {
        //Vind de gebruiker die inlogd is
        res.render('profile.ejs', {ingelogd: obj})
      }
    })
  }catch{
    console.log(error)
  }
})

app.post('/profile', async (req, res) => {
  
})


//Check buddie POST pagina
app.post('/checkBuddie', async (req, res) => {

  //Zet POST alles in variable
  let fromBuddiePost = req.body.frombuddie
  let toBuddiePost = req.body.tobuddie

  if (fromBuddiePost && toBuddiePost ) {
    try{
      //Bestaat buddie?
      await Favorites.collection.findOne({
        fromBuddie: fromBuddiePost,
        toBuddie: toBuddiePost
      }, async (err, obj) => {
        if (obj) {
          //Zo ja, verwijderbestaande buddie
          Favorites.collection.deleteMany({
            fromBuddie: fromBuddiePost,
            toBuddie: toBuddiePost
          }, (err, docs) => { })
        }else{
          //Zo nee, maak buddie aan
          Favorites.collection.insertOne({
            fromBuddie: fromBuddiePost,
            toBuddie: toBuddiePost
          }, (err, docs) => { })
        }
      })
    }catch (error) {
      console.log(error)
    }
  }
  res.send()
})



//registreer pagina
app.get('/registreer', redirectDash, (req, res) => {
  res.render('registreer.ejs')
})

app.post('/registreer', upload.single('profilePic'), async (req, res) => {

  //Zet POST alles in variable
  let emailPost = req.body.email
  let passwordPost = req.body.password
  let firstnamePost = req.body.firstname
  let lastnamePost = req.body.lastname
  let agePost = req.body.age
  let gymnamePost = req.body.gymname
  let gymplacePost = req.body.gymplace
  let gymervPost = req.body.gymerv
  let bioPost = req.body.bio
  
  //hash wachtwoord
  let hashPassword = await bcrypt.hash(passwordPost, 10)

  //check of alles is gezet
  if (emailPost && passwordPost && firstnamePost && lastnamePost && agePost && gymnamePost && gymplacePost && gymervPost && bioPost) {
    try{
      //Kijk of gebruiker al bestaat
      const user = await User.findOne({
        email: emailPost
      }, (err, obj) => {
          if (!obj) {
            //Zo nee, maak nieuwe gebruiker aan
            User.collection.insertOne({
              email: emailPost,
              pwd: hashPassword,
              firstname: firstnamePost,
              lastname: lastnamePost,
              age: agePost,
              gymname: gymnamePost,
              gymplace: gymplacePost,
              gymerv: gymervPost,
              profilePic: '/assets/uploads/' + req.file.filename,
              bio: bioPost
            }, (err, docs) => {
              if (err) {
                return console.error(err)
              } else {
                res.render('index.ejs', { errorMsg: 'Congratulations your registration was succesfull, you now may log in!' })
              }
            })
          }else {
            if (obj.email == emailPost) {
              //Zo ja, gebruiker bestaat al
              res.render('registreer.ejs', { errorMsg: 'Email is already taken' })
            }
          }
        })
    }catch (error) {
      console.log(error)
    }
  }
})



//404 redirect naar home pagina
app.get('*', (req, res) => {
  res.redirect('/')
})


//Luister op port
app.listen(port, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port} and from other machines at http://192.168.0.106:8080`)
})