// Pedido do express e armazenando na variavel
const express = require("express")
const server = express()

// Pegar o banco de dados
const db = require("./database/db")

// Habilitar o uso do req.body na minha aplicação
server.use(express.urlencoded({ extended: true}))

// Configurar pasta publica
server.use(express.static("public"))


// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    //Sem cache
    noCache: true
})


// Configurar caminhos da minha aplicação
// Página inicial
// req: Requisição
// res: Resposta
// Rota do index
server.get("/", (req, res) => {
    return res.render("index.html", {title: "Titulo"})
})

// rota do create-point
server.get("/create-point", (req, res) => {

    // req.query: Query Strings da nossa url
    
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    // req.body: O corpo do nosso formulário

    // Inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", {saved:true})
    }
    
    //inserir
    db.run(query, values, afterInsertData)

})

// rota do search-results
server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }


    // Pegar os dados do banco de dados
    // sul
    // chapadão do sul
    // rio do sul
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        // mostrar a página html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total})
    })

    
})

// Ligar o servidor
server.listen(3000)