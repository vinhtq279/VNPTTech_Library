const mysql = require('mysql');
const cred = require('./credentials');

class TABLES {
    
    constructor(){
        
        this.db = mysql.createConnection({
            ...cred,
            database: 'library'
        });

        this.sql = {
            student: 'CREATE TABLE IF NOT EXISTS student(id int AUTO_INCREMENT, name VARCHAR(255), fine float(6,2) DEFAULT 0, PRIMARY KEY (id))',
            book: 'CREATE TABLE IF NOT EXISTS book(id int AUTO_INCREMENT, name VARCHAR(255), author VARCHAR(255), semester int(1), count int, PRIMARY KEY (id))',
            borrow: 'CREATE TABLE IF NOT EXISTS borrow(idStudent int, idBook int, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, deadline TIMESTAMP, PRIMARY KEY (idStudent, idBook), FOREIGN KEY(idStudent) REFERENCES student(id), FOREIGN KEY(idBook) REFERENCES book(id))'
        };
        
    }

    initTable() {
        for(let i in this.sql){
            this.db.query(this.sql[i], (err, result) => {
                if(err)
                    console.log(`Couldn't create table ${i}`);
                else
                    console.log(`Successfully created table ${i}`);
            })
        }
    }
}

module.exports = TABLES;
