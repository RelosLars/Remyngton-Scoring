const botsettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");

const prefix = botsettings.prefix;

const bot = new Discord.Client();
const k = "0db10863146202c12ca6f6987c98f1ec9d629421";
const u = "7209831";
const m = "0";

const mp = "41649863";
const type = "id"
const snekfetch = require("snekfetch");
const api = "https://osu.ppy.sh/api/get_match"
const apiMap = "https://osu.ppy.sh/api/get_beatmaps"

var csv = require('fast-csv');



bot.on("ready", async () => {
	console.log(`Bot is ready! ${bot.user.username}`);
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if (message.channel.type === "dm") return;

	let messageArray = message.content.split(/\s+/g);
	let command = messageArray.slice(1);

	if(!message.content.startsWith(prefix)) return;

	var args = message.content.substring(prefix.length).split(" ");
	
	switch(args[0]) {
        case "results":

        let mpLink = args[1]
        let mapID = args[2]

        //function to get the relevant beatmap data
        var dataMap = snekfetch.get(apiMap + "?k=" + k + "&b=" + mapID).then(function(dataMap, rt){
	        let jsonMap = JSON.parse(dataMap.text);
	        let Mapname = jsonMap[0].title;
	        let DiffName = jsonMap[0].version;
	        //console.log(Mapname + " [" + DiffName + "]"); 
	        
        
        //FIND OUT HOW TO GET API DATA WITHOUT FUCKING SNEKFETCH OR MAKE IT WORK WITHOUT ASYNCHRONOUS METHODS
        

        //maybe try to make the beatmap json function around the multiplayer function


        
        
        var data = snekfetch.get(api + "?k=" + k + "&mp=" + mpLink).then(function(data){
        let json = JSON.parse(data.text);
        let Mapnumber = 0;
            for (let i = 0; i < json.games.length; i++) {
            	
            	var id = json.games[i].beatmap_id;
            	if (id === mapID) {
            		
            		Mapnumber = i;
            	}
            }
            

            
            let scoreP1 = json.games[Mapnumber].scores[0].score;
            let scoreP2 = json.games[Mapnumber].scores[1].score;
            let scoreP3 = json.games[Mapnumber].scores[2].score;
            let scoreP4 = json.games[Mapnumber].scores[3].score;

            let maxcomboP1 = json.games[Mapnumber].scores[0].maxcombo;
            let maxcomboP2 = json.games[Mapnumber].scores[1].maxcombo;
            let maxcomboP3 = json.games[Mapnumber].scores[2].maxcombo;
            let maxcomboP4 = json.games[Mapnumber].scores[3].maxcombo;

            let missesP1 = json.games[Mapnumber].scores[0].countmiss;
            let missesP2 = json.games[Mapnumber].scores[1].countmiss;
            let missesP3 = json.games[Mapnumber].scores[2].countmiss;
            let missesP4 = json.games[Mapnumber].scores[3].countmiss;
             
            //Gets total score possible ignoring combobonus, used to calculate acc
            var TotalScore = 300 * (parseInt(json.games[Mapnumber].scores[0].count300) + parseInt(json.games[Mapnumber].scores[0].count100) + parseInt(json.games[Mapnumber].scores[0].count50) + parseInt(json.games[Mapnumber].scores[0].countmiss));
            
            let accP1 = (parseFloat(json.games[Mapnumber].scores[0].count300)*300 + parseFloat(json.games[Mapnumber].scores[0].count100)*100 + parseFloat(json.games[Mapnumber].scores[0].count50)*50)/TotalScore*100;
            let accP2 = (parseFloat(json.games[Mapnumber].scores[1].count300)*300 + parseFloat(json.games[Mapnumber].scores[1].count100)*100 + parseFloat(json.games[Mapnumber].scores[1].count50)*50)/TotalScore*100;
            let accP3 = (parseFloat(json.games[Mapnumber].scores[2].count300)*300 + parseFloat(json.games[Mapnumber].scores[2].count100)*100 + parseFloat(json.games[Mapnumber].scores[2].count50)*50)/TotalScore*100;
            let accP4 = (parseFloat(json.games[Mapnumber].scores[3].count300)*300 + parseFloat(json.games[Mapnumber].scores[3].count100)*100 + parseFloat(json.games[Mapnumber].scores[3].count50)*50)/TotalScore*100;
            
            var ws = fs.createWriteStream('Results ' + json.match.name + ' ' + Mapname + ' [' + DiffName + '].csv');
            
            csv.
            	write([
            [scoreP1, maxcomboP1, accP1, missesP1],
            [scoreP2, maxcomboP2, accP2, missesP2],
            [scoreP3, maxcomboP3, accP3, missesP3],
            [scoreP4, maxcomboP4, accP4, missesP4]
            ])

            .pipe(ws); 
            // Results soll Lobbyname und Mapname beinhalten
            message.channel.send('Here are the results of the lobby ' +  json.match.name +  '\nMap: ' + Mapname + " [" + DiffName + "]", { //mit args die parameter abfragen und diese in die api abfrage einfügen
            	files: [
				    './Results ' + json.match.name + ' ' + Mapname + ' [' + DiffName + '].csv'
				]
            })
        });
        })
        break;

        case "help":
        	message.channel.send("Type !results [mplink] [mapID] \nExample: \nLink of the lobby: https://osu.ppy.sh/community/matches/41649863 \nLink of the map: https://osu.ppy.sh/s/269773 \nWhat you have to type in: \n!results 41649863 269773" )
        break;
        default:
        	message.channel.send("Type !help if you are struggling");

        break;
        
    }


}) 



bot.login(process.env.token);
