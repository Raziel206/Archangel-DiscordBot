const fs = require('fs');
const path=require('path');
module.exports = (client) => {
    client.handleCommands = () => {
        const foldersPath=path.join(__dirname,'../..','commands');
        const commandsFolder=fs.readdirSync(foldersPath);
        for(const folder of commandsFolder){
            const commandsPath=path.join(foldersPath,folder);
            const commandFiles=fs.readdirSync(commandsPath);
            for(const file of commandFiles){
                const filePath=path.join(commandsPath,file);
                let command=require(filePath);
                if(path.basename(filePath).includes("Registry")){
                    for(const com of command)
                        client.commands.set(com.data.name,com);
                }
                else if('data' in command && 'execute' in command){
                    client.commands.set(command.data.name,command);
                }
                else{
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`);
                }
            }
        }
    };
};