const { REST, Routes } = require('discord.js');
const { clientId, token ,guildId} = require('./config.json');
const fs = require('fs');
const path = require('path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		let command = require(filePath);
		if(path.basename(filePath).includes("Registry")){
			for(const com of command)
				commands.push(com.data.toJSON());
		}
		else if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // const data= rest.put(Routes.applicationGuildCommands(clientId,guildId),{ body : commands});// For guild specific commands

		const data= rest.put(Routes.applicationCommands(clientId),{ body : commands}); // For global commands

		// const data= rest.put(Routes.applicationGuildCommands(clientId,guildId),{ body : []}); // To delete all guild commands
		
		// const data= rest.put(Routes.applicationCommands(clientId),{ body : []}); // To delete all global commands
		
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);

	} catch (error) {
		console.error(error);
	}
})();