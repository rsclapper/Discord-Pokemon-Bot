import fetch from "node-fetch";
import http from 'http';
import {Client, Intents} from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});
const hostname = process.env.HOST_NAME;
const port = process.env.PORT;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  })
  
  client.on("message", msg => {

    console.log(msg.content);

    if (msg.content.toLowerCase() == "hello pokedex") {
      msg.channel.send(`Hello ${msg.author.username}`);
    }

    if (msg.content.includes("pokedex #")) {
        const currentMsg = msg.content;
        let pokeNo = currentMsg.split("");
        pokeNo.splice(0,9);
        pokeNo = pokeNo.join("");
        console.log(`PokeNo ${pokeNo} called`);
        const pokemonApi = new PokemonRepositoryApi(pokeNo);
        pokemonApi.getPokemonData(pokeNo)
            .then(data => {
                console.log(data);
                if(data != null) {
                    msg.channel.send(`#${pokeNo} ${data.species.name.toUpperCase()} \n ${data.sprites.front_default} \n`);
                }
            });
    }

  })
  
  const mySecret = process.env.TOKEN;
  client.login(mySecret);
});

class PokemonRepositoryApi {

    getPokemonData(pokeNo){
        return fetch(`${process.env.POKEMON_API_URL}${pokeNo}`)
            .then(response => response.json());
    }
}