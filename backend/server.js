const express = require('express');
const mysql = require('mysql');
const DATABASE = require('./utilities/createDB');
const TABLES = require('./utilities/createTables');
const cred = require('./utilities/credentials');
const passport = require('passport');

const CONFIG = require('./config.js')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const CustomStrategy = require('passport-custom').Strategy
const { authenticate } = require('ldap-authentication')

const cookieParser = require('cookie-parser')

const { flash } = require('express-flash-message');

function ensureAuthenticated(req, res, next) {
	if (!req.user){
		res.status(401).json({ succes: false, message: "not logged in" })
	}else{
		next()
	}
}


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
      if (!req.body.uid || !req.body.password) {
        throw new Error('username and password are not provided')
      }
      // construct the parameter to pass in authenticate() function
      let ldapBaseDn = CONFIG.ldap.dn
      let options = {
        ldapOpts: {url: CONFIG.ldap.url},
        // note in this example it only use the user to directly
        // bind to the LDAP server. You can also use an admin
        // here. See the document of ldap-authentication.
        // userDn: `uid=${req.body.username},${ldapBaseDn}`,
        adminDn: 'cn=Administrator,cn=Users,dc=vnpt-technology,dc=vn',
        adminPassword: 'Ns1@an5v',
        userPassword: req.body.password,
        userSearchBase: 'ou=O365,ou=VNPTTech,dc=vnpt-technology,dc=vn',
        usernameAttribute: 'uid',
        username: req.body.uid,
        //userPassword: req.body.password,
        //userSearchBase: ldapBaseDn,
        //usernameAttribute: 'uid',
        //username: req.body.username
      }
      // ldap authenticate the user
      let user = await authenticate(options)
      // success
      //console.log(user);
      done(null, user)
    } catch (error) {
      // authentication failure
      done(error, null)
    }
  }
))


passport.serializeUser(function (user, done) {
  	done(null, user.uid)
})

passport.deserializeUser(function (id, done) {
	  User.findOne({ uid: id }).exec()
	    .then(user => {
	      if (!user) {
        	done(new Error(`Cannot find user with uid=${id}`))
	      } else {
        	done(null, user)
      		}
	})
})

// passport requires a session
var sessionMiddleWare = cookieSession({
  name: 'session',
  keys: ['keep the secret only to yourself'],
  maxAge: 1 * 60 * 60 * 1000 // 1 hours
})



class LIBRARY {

    constructor(port, app) {

        this.port = port;
        this.app = app;
        this.app.use(express.json())
        this.temp = 0;

	// The order of the following middleware is very important for passport!!
	this.app.use(bodyParser.urlencoded({ extended: true }))
	this.app.use(sessionMiddleWare)
	// passport requires these two
	this.app.use(passport.initialize())
	this.app.use(passport.session())
	// web page template
	//this.app.set('view engine', 'pug')
	this.app.set('view engine', 'ejs');

	this.app.use(cookieParser())
	this.app.use(flash({ sessionKeyName: 'flashMessage' }));

        //Initialize Database
        new DATABASE().initDB();

        //Initialize All The Tables
        new TABLES().initTable();
        
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });

    }

    get() {
        //GET LIST OF ALL THE bookS
        this.app.get('/api/getBooks', (req, res) => {
            let sql = `SELECT * FROM book`;
            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted books");
		    console.log(result.length);
                res.send(result);
            });
        });

	//GET LIST OF ALL THE bookS has require to borrow (Admin)
	this.app.get('/api/getIssuing', (req, res) => {
            
            let sql = `SELECT book.name, book.author, book.semester, book.id, borrow.date, borrow.deadline, employee.uid as uid\
                       FROM book, employee, borrow\
                       where borrow.uidEmployee = employee.uid and book.id = borrow.idBook and borrow.accepted <> 1`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted issues");
		    console.log(result.length);
                res.send(result);
            });
        });

        //GET LIST OF bookS BY SEMESTER
        this.app.get('/api/getBooks/:id', (req, res) => {
            let sql = `SELECT '${res.cookie.uid}' as uid, id, name, author, image, introduction FROM book where count > 0`;
            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
		    console.log(`${res.cookie.uid}`);
                    console.log("Successfully extracted books");
                res.send(result);
            });
        });

	//LOGIN
	this.app.post('/api/login', passport.authenticate('ldap', { failureRedirect: '/login' }), function (req, res) {
		console.log(req.body.uid);
		console.log(req.body.password);
		//res.redirect('/success');
	        //res.redirect('http://172.24.104.83:3000/home');
		res.clearCookie('session');
		res.cookie('uid', `${req.body.uid}`, { expires: new Date(Date.now() + 90000)});
		res.send('success')
        });

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
	});

	// passport standard logout call.
	this.app.get('api/logout', (req, res) => {
	  req.logout();
	  res.redirect('/');
	});

        //borrowing A book
        this.app.post('/api/borrow', (req, res) => {
	    if (req.cookies.uid == undefined){
		console.log('Please login to issue book!');
	    }else{
	        let sql = [`INSERT INTO borrow(uidEmployee, idBook, deadline, accepted) VALUES ('${req.cookies.uid}', ${req.body.id}, date_add(CURRENT_TIMESTAMP(), interval 7 day), 0);`, `INSERT IGNORE INTO employee(uid) VALUES ('${req.cookies.uid}');`];

                for(let i = 0; i < sql.length; i++){
                    this.db.query(sql[i], (err, result) => {
			console.log(`cookies.uid is: ${req.cookies.uid}`);
			console.log(`idBook is: ${req.body.id}`);
			console.log(`i is: ${i}`);
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
              }
		res.send("red");
        });

	//borrowed A book (For Admin Accept borrow)
        this.app.post('/api/borrowed', (req, res) => {
            if (req.cookies.uid == undefined){
                console.log('Please login to issue book!');
            }else{
                let sql = [`INSERT INTO borrowed(uidEmployee, idBook, deadline) VALUES ('${req.body.uid}', ${req.body.id}, date_add(CURRENT_TIMESTAMP(), interval 7 day));`, `INSERT IGNORE INTO employee(uid) VALUES ('${req.cookies.uid}');`,
                       `Update borrow SET accepted = 1 WHERE borrow.idBook = ${req.body.id}`, `Update book set count = count - 1 where id = ${req.body.id}`];

                for(let i = 0; i < sql.length; i++){
                    this.db.query(sql[i], (err, result) => {
                        console.log(`cookies.uid is: ${req.cookies.uid}`);
                        console.log(`idBook is: ${req.body.id}`);
                        console.log(`i is: ${i}`);
                        if(err){
                            console.log("Couldn't add");
                            this.temp = 1;
                        }
                        else
                            console.log("Successfully inserted to borrowed");
                    });
                    if(this.temp)
                        break;
                }
              }
                res.send("red");
        });

        //GET ALL THE ISSUED bookS BY A employee
        this.app.get('/api/getIssues/:sid', (req, res) => {
            
            let sql = `SELECT book.name, book.author, book.semester, book.id, borrow.date, borrow.deadline, employee.name as sname\
                       FROM book, employee, borrow\
                       where borrow.uidEmployee = '${req.params.sid}' and book.id = borrow.idBook and employee.uid = '${req.params.sid}'`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });

	//GET ALL THE ISSUED bookS BY A employee (Querry from Admin)
        this.app.get('/api/getIssuesAdmin/:sid', (req, res) => {
            
            let sql = `SELECT book.name, book.author, book.semester, book.id, borrowed.date, borrowed.deadline, employee.name as sname\
                       FROM book, employee, borrowed\
                       where borrowed.uidEmployee = '${req.params.sid}' and book.id = borrowed.idBook and employee.uid = '${req.params.sid}'`;
	   console.log(sql);

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });

	//GET ALL THE ISSUED bookS BY A employee (search by employee)
        this.app.get('/api/getIssues', (req, res) => {
            
            let sql = `SELECT book.name, book.author, book.semester, book.id, borrow.date, borrow.deadline, employee.name as sname\
                       FROM book, employee, borrow\
                       where borrow.uidEmployee = '${req.cookies.uid}' and book.id = borrow.idBook and employee.uid = '${req.cookies.uid}'`;

            this.db.query(sql, (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });


        //RETURN A book, UPDATE FINE IF ANY (Do by Admin)
        this.app.post('/api/return', (req, res) => {
            console.log(`uidEmployee: ${req.body.sid}`); 
	    console.log(`idBook: ${req.body.id}`);
            let sql = [`SELECT deadline from borrowed WHERE idBook = ${req.body.id} and uidEmployee = '${req.body.sid}'`,
                       `DELETE FROM borrowed where uidEmployee = '${req.body.sid}' and idBook = ${req.body.id}`,
                       `UPDATE book SET count = count + 1 WHERE id = ${req.body.id}`];

            for(let i = 0; i < sql.length; i++){
                this.db.query(sql[i], (err, result) => {
                    if(err){
                        console.log("Couldn't return");
                    }
                    //FOR FINE
                    else if(i == 0){
			console.log(sql[i]);
			console.log(result);
                        var d1 = new Date(result[0].deadline);
                        var d2 = new Date()
                        const timeDiff = d2 - d1;
                        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
			console.log(`d1 - d2 - timeDiff, daysDiff: ${d1}, ${d2}, ${timeDiff}, ${daysDiff}`);
                        if(daysDiff > 0) {
                            this.db.query(`UPDATE employee SET fine = fine + ${(daysDiff - 1) * 10} WHERE id = '${req.body.sid}'`, (err, result) => {
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

	//RETURN A book, UPDATE FINE IF ANY (by employee self)
        this.app.post('/api/returnissuedbook', (req, res) => {
            console.log(`${req.body.id}`); 
            let sql = [`SELECT deadline from borrow WHERE idBook = ${req.body.id} and uidEmployee = '${req.cookies.uid}'`,
                       `DELETE FROM borrow where uidEmployee = '${req.cookies.uid}' and idBook = ${req.body.id}`,
                       `UPDATE book SET count = count + 1 WHERE id = ${req.body.id}`];

            for(let i = 0; i < sql.length; i++){
                this.db.query(sql[i], (err, result) => {
                    if(err){
                        console.log("Couldn't return");
                    }
                    //FOR FINE
                    else if(i == 0){
                        console.log(result);
                        var d1 = new Date(result[0].deadline);
                        var d2 = new Date()
                        const timeDiff = d2 - d1;
                        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        if(daysDiff > 0) {
                            this.db.query(`UPDATE employee SET fine = fine + ${(daysDiff - 1) * 10} WHERE id = '${req.cookies.uid}'`, (err, result) => {
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

        //GET ALL THE employee WHO HAVE ISSUED A PARTICULAR book (Search issued book by Admin)
        this.app.get('/api/students/:id', (req, res) => {
	    let sql = `SELECT employee.uid, borrowed.date, borrowed.deadline\
                       FROM employee, borrowed\
                       where borrowed.idBook = '${req.params.id}' and employee.uid = borrowed.uidEmployee`;
            this.db.query(sql, (err, result) => {
                if(err)
                    console.log("Couldn't get issues");
                else
                    console.log("Successfully extracted issues");
                res.send(result);
            });
        });

	// Search book by Employee
	this.app.get('/api/employees/:id', (req, res) => {
            let sql = `SELECT * from book where book.name like '%${req.params.id}%'`;
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
