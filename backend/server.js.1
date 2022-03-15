const express = require('express');
const mysql = require('mysql');
const DATABASE = require('./utilities/createDB');
const TABLES = require('./utilities/createTables');
const cred = require('./utilities/credentials');

const cookieSession = require('cookie-session');


const bodyParser = require('body-parser');

const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const { authenticate } = require('ldap-authentication');

/**
 * Create the passport custom stragegy and name it `ldap`
 * 
 * Only this part is where we use ldap-authentication to do
 * the authentication.
 * 
 * Everything else in this example is standard passport staff.
 *
 */ 
passport.use('ldap', new CustomStrategy(
  async function (req, done) {
    try {
      if (!req.body.username || !req.body.password) {
        throw new Error('username and password are not provided')
      }
      // construct the parameter to pass in authenticate() function
      let ldapBaseDn = 'dc=vnpt-technology,dc=vn';
      let options = {
        ldapOpts: {
          url: 'ldap://ad01.vnpt-technology.vn'
        },
        // note in this example it only use the user to directly
        // bind to the LDAP server. You can also use an admin
        // here. See the document of ldap-authentication.
        // userDn: `uid=${req.body.username},${ldapBaseDn}`,
	adminDn: 'cn=Administrator,cn=Users,dc=vnpt-technology,dc=vn',
	adminPassword: 'Ns1@an5v',
	userPassword: req.body.password,
	userSearchBase: 'ou=O365,ou=VNPTTech,dc=vnpt-technology,dc=vn',
	usernameAttribute: 'uid',
	username: req.body.username,
        //userPassword: req.body.password,
        //userSearchBase: ldapBaseDn,
        //usernameAttribute: 'uid',
        //username: req.body.username
      }
      // ldap authenticate the user
//      let user = await authenticate(options);
      var user = await authenticate(options);
      // success
      console.log(user.uid);
      done(null, user)
    } catch (error) {
      // authentication failure
      done(error, null)
    }
  }
))

// passport requires this
passport.serializeUser(function (user, done) {
  done(null, user);
})


// passport requires this
passport.serializeUser(function (user, done) {
  done(null, user);
})
// passport requires this
passport.deserializeUser(function (user, done) {
  done(null, user);
})
// passport requires a session
var sessionMiddleWare = cookieSession({
  name: 'session',
  keys: ['keep the secret only to yourself'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})


class LIBRARY {

    constructor(port, app) {

        this.port = port;
        this.app = app;
        this.app.use(express.json());

	// The order of the following middleware is very important for passport!!
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(sessionMiddleWare)
        // passport requires these two
        this.app.use(passport.initialize())
        this.app.use(passport.session())

        // web page template
        this.app.set('view engine', 'pug')

        this.temp = 0;

        //Initialize Database
        new DATABASE().initDB();

        //Initialize All The Tables
        new TABLES().initTable();
        
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });

    };


    get() {
	// user post username and password
	this.app.post('/login', passport.authenticate('ldap', { failureRedirect: '/login' }), function (req, res) {
	//    res.redirect('/success');
	    res.redirect('http://172.24.104.83:3000');
  		}
	)

	// success page
	this.app.get('/success', (req, res) => {
	  	let user = req.user
		  if (!user) {
		    res.redirect('/')
		    return
		  }
  		res.render('success', {
		      userDisplayName: user.cn,
		      userObject: JSON.stringify(user, null, 2)
    		})
	})

	// passport standard logout call.
	this.app.get('/logout', (req, res) => {
		  req.logout();
		  res.redirect('/');
	})

	// the login page
	this.app.get('/', function (req, res) {
		  res.render('index', { title: 'Hey', message: 'Hello there!' })
	})






        //GET LIST OF ALL THE BOOKS
        this.app.get('/api/getBooks', (req, res) => {
            let sql = `SELECT * FROM book`;
            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted books");
                res.send(result);
            });
        });

        //GET LIST OF BOOKS BY SEMESTER
        this.app.get('/api/getBooks/:id', (req, res) => {
            let sql = `SELECT * FROM book where semester = '${req.params.id}'`;
            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted books");
                res.send(result);
            });
        });

        //BORROW A BOOK
        this.app.post('/api/borrow', (req, res) => {
            let sql = [`INSERT INTO BORROW(idStudent, idBook) VALUES (${req.body.sid}, ${req.body.id});`,
                       `Update BOOK SET count = count - 1 WHERE id = ${req.body.id}`];
//	    let sql = [`INSERT INTO BORROW(idStudent, idBook) VALUES (${user.uid}, ${req.body.id});`,
//                       `Update BOOK SET count = count - 1 WHERE id = ${req.body.id}`];
                for(let i = 0; i < sql.length; i++){
                    this.db.query(sql[i], (err, result) => {
                        if(err){
                            console.log("Couldn't add");
                            this.temp = 1;
                        }
                        else
                            console.log("Successfully inserted");
                    });
                    if(this.temp)
                        break;
                }
        });

        //GET ALL THE ISSUED BOOKS BY A STUDENT
        this.app.get('/api/getIssues/:sid', (req, res) => {
            
            let sql = `SELECT book.name, book.author, book.semester, book.id, borrow.date, borrow.deadline, student.name as sname\
                       FROM book, student, borrow\
                       where borrow.idStudent = '${req.params.sid}' and book.id = borrow.idBook and student.id = '${req.params.sid}'`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });

        //RETURN A BOOK, UPDATE FINE IF ANY
        this.app.post('/api/return', (req, res) => {
            
            let sql = [`SELECT deadline from borrow\
                        WHERE idBook = ${req.body.id} and idStudent = ${req.body.sid}`,
                       `DELETE FROM borrow where idStudent = ${req.body.sid} and idBook = ${req.body.id}`,
                       `UPDATE BOOK SET count = count + 1 WHERE id = ${req.body.id}`];

            for(let i = 0; i < sql.length; i++){
                this.db.query(sql[i], (err, result) => {
                    if(err){
                        console.log("Couldn't return");
                    }
                    
                    //FOR FINE
                    else if(i == 0){
                        var d1 = new Date(result[0].deadline);
                        var d2 = new Date()
                        const timeDiff = d2 - d1;
                        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        if(daysDiff > 0) {
                            this.db.query(`UPDATE STUDENT SET fine = fine + ${(daysDiff - 1) * 10} WHERE id = '${req.body.sid}'`, (err, result) => {
                                if(err)
                                    console.log(err);
                                else
                                    console.log("Fine Updated Succesfully");
                            });
                        }
                    }

                });
            }
        });

        //GET ALL THE STUDENTS WHO HAVE ISSUED A PARTICULAR BOOK
        this.app.get('/api/students/:id', (req, res) => {
            
            let sql = `SELECT student.name, borrow.date, borrow.deadline\
                       FROM student, borrow\
                       where borrow.idBook = '${req.params.id}' and student.id = borrow.idStudent`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log("Couldn't get issues");
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });
    }

    listen() {
        this.app.listen(this.port, (err) => {
            if(err)
                console.log(err);
            else
                console.log(`Server Started On ${this.port}`);
        })
    }
    
}

let library = new LIBRARY(3001, express());
library.get();
library.listen();
