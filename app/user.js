const express = require("express");
const app = express();
const pool = require("../database/db");

app.get("/", (req, res) => {

    pool.query(`SELECT *,date_format(created_on,'%Y-%m-%d %T') as vaqt FROM flosun.flower where isActive=1;
    SELECT *,date_format(created_on,'%Y-%m-%d %T') as vaqt FROM flosun.flower where isActive=1;`, (err, rows, fields) => {
        
        if (err) return res.render("user/404");
        // const userName = req.flash('home');
        const home={home: rows[0]}
        // console.log(home)
        // const sub={sub: rows[1]}
        // const news={news: rows[2]}
        // console.log({...home,...sub})
        return res.render("index", { ...home});
    })

    // res.render("index", {})
})

app.get("/home", (req, res) => {

    res.redirect('/')
})

app.get("/admin", (req, res) => {

        res.render("register", {})
})

//yangilik qismi
app.get("/news", (req, res) => {
    pool.query(`SELECT * FROM menu
    where isActive=1 and sub=0;

    SELECT m1.* FROM menu m1
left join 
(SELECT * FROM menu
where isActive=1 and sub=0) m2
on m1.id=m2.id
where m1.isActive=1 and m2.id is null;
    
    SELECT *,
    date_format(created_on,'%Y-%m-%d %T') as vaqt
     FROM news
    where isActive=1`, (err, rows, fields) => {
        const home={home: rows[0]}
        const sub={sub: rows[1]}
        const news={news: rows[2]}
        if (err) return res.render("user/404");
        return res.render("user/news", { ...home,...sub,...news});
    })
    // const userName = req.flash('yangilik');
    // res.render("admin/news", {})
})

//aynan bitta yangilik qismi
app.get("/single_news/:id", (req, res) => {
    pool.query(`SELECT * FROM menu
    where isActive=1 and sub=0;

    SELECT m1.* FROM menu m1
left join 
(SELECT * FROM menu
where isActive=1 and sub=0) m2
on m1.id=m2.id
where m1.isActive=1 and m2.id is null;
    
    SELECT *,
    date_format(created_on,'%Y-%m-%d %T') as vaqt
     FROM news
    where isActive=1 and id=${req.params.id}`, (err, rows, fields) => {

        const home={home: rows[0]}
        const sub={sub: rows[1]}
        const news={news: rows[2]}
        if (err) return res.render("user/404");
        return res.render("user/single_news", { ...home,...sub,...news});
        
    })
    // const userName = req.flash('yangilik');
    // res.render("admin/news", {})
})

//register qismi
app.get("/register", (req, res) => {
    return res.render("user/register");
    // const userName = req.flash('yangilik');
    // res.render("admin/news", {})
})



//about qismi
app.get("/about", (req, res) => {
   res.render('about')
})

//contact qismi
app.get("/contact", (req, res) => {
    res.render('contact')
 })

// signUp post
app.post("/admin/gul",  async (req, res) => {
    const a = req.body;
    const rand = Math.floor(Math.random() * 6) + 1
    pool.query("INSERT INTO `flosun`.`flower`(`id`,`name`,`narx`,`isActive`,`image`) VALUES (null,?,?,1,?) ", [a.name, a.narx, rand], (err, rows, fields) => {
        if (err) {
            return res.render("admin/error", {bir:4,uch:4,msg:"Xatolik!\n"+err });
        }

        res.redirect('/')

    })
})


// login post
app.post("/login",  async (req, res) => {
    const a = req.body;
    pool.query("call login_check(?,?) ; ", [ a.tel,  a.parol], (err, rows, fields) => {
        if (err) {
            return res.render("admin/error", {bir:4,uch:4,msg:"Xatolik!\n"+err });
        }
        // console.log(rows)
        if(rows[0][0].natija*1==0) return res.render("user/login",{msg:"Bunday foydalanuvchi topilmadi!"});
        else if(rows[0][0].role_id*1==1){
            //chala
            return res.render("employeer/index");
        }
        else if(rows[0][0].role_id*1==4){
            req.session.userId = rows[0][0].natija*1;
            req.flash('admin_kirdi', {msg:rows[0][0].rol+" janoblari akkauntga xush kelibsiz",fish:rows[0][0].fish,rol:rows[0][0].rol,vaqt:rows[0][0].vaqt});
            return res.redirect('/admin')
        }
        else{
            return res.render("admin/error", {bir:4,uch:4,msg:"Hozircha bunaqa rol yoq!\n" });
        }
        
       

    })
})

module.exports = app;