const express = require('express');
const path = require('path');
const mysql = require('mysql');
var sha256 = require('js-sha256');
const app = express();
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"]

app.use(express.json());
 app.use(express.urlencoded({
   extended:true
 }));

 app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

//create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database : 'cafedb'
    
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('connected');
});



//create DB
/*app.get('/createdb',(req,res) => {
    let sql = 'CREATE DATABASE cafedb';
    db.query(sql,(err,result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created..');
    })
});*/

app.get('/',(req,res) => {
    let sql = 'SELECT * FROM schedule ORDER BY ID asc';
     db.query(sql,(err,results) =>{
        if(err) throw err;
         console.log(results);
         res.render('schedule',{schedules:results,days,title:'Schedules'});
    })
});

app.get('/new', function (req, res) {
    res.render('addSchedule', {days,title: "Add New Schedule"
    });
});

  app.post('/new',(req,res)=>{
      let userName = req.body.username;
      let day = req.body.day;
      let start = req.body.start;
      let end = req.body.end;
        db.query('INSERT INTO schedule(username,day,start,end) VALUES(?,?,?,?)',
        [userName,day,start,end],function(err)
        {
                if (err) {
                  return console.log(err.message);
                }
                console.log("New schedule has been added");
                res.render('addSchedule',{
                    username:userName,
                    day:day,
                    start_at:start,
                    end_at:end,
                    days
                });
                
        
       });
    
  });
    
          
      
    
  


app.listen('3000',()=>{
    console.log('server started on port 3000');
});