import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(express.json());
const server = http.createServer(app);

app.get("/", (req, res, next) => {
  res.json({ message: "Tudo ok por aqui!" });
});

app.get("/clientes", verifyJWT, (req, res, next) => {
  console.log(req.userId + " autenticado");

  res.json([{ id: 1, nome: "Luan Christian" }]);
});

//authentication
//rota de login
app.post("/login", (req, res, next) => {
  if (req.body.user === "arquiteturaWeb" && req.body.password === "123") {
    //auth ok
    const id = 1; //esse id viria do banco de dados
    var privateKey = fs.readFileSync("./private.key", "utf8");
    var token = jwt.sign({ id }, privateKey, {
      expiresIn: 300, // 5min
      algorithm: "RS256", //SHA-256 hash signature
    });
    console.log("Fez login e gerou token!");
    return res.status(200).send({ auth: true, token: token });
  }
  return res.status(401).send("Login inválido!");
});

app.post("/logout", function (req, res) {
  res.json({ auth: false, token: null });
});

function verifyJWT(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res
      .status(401)
      .send({ auth: false, message: "Token não informado." });
  var publicKey = fs.readFileSync("./public.key", "utf8");
  jwt.verify(
    token,
    publicKey,
    { algorithm: ["RS256"] },
    function (err, decoded) {
      if (err)
        return res
          .status(500)
          .send({ auth: false, message: "Token inválido." });
      req.userId = decoded.id;
      console.log("User Id: " + decoded.id);
      next();
    }
  );
}

server.listen(3000);

console.log("Servidor escutando na porta 3000...");
