const ActionCommand = require("../../utils/actionCommands.js");

const actionConfigs = [
  {
    name: "hug",
    description: "Hug another user",
    searchTerms: [
      "wholesome anime hug",
      "cute anime hug",
      "comforting anime hug",
      "happy anime hug",
      "friendship anime hug"
    ],
    actionWord: "hugs"
  },
  {
    name: "kill",
    description: "Playfully kill another user",
    searchTerms: [
      "funny anime kill",
      "anime fight kill",
      "cartoon dramatic kill"
    ],
    actionWord: "kills"
  },
  {
    name: "slap",
    description: "Slap another user",
    searchTerms: [
      "anime slap",
      "funny anime slap",
      "cartoon slap"
    ],
    actionWord: "slaps"
  },
  {
    name: "pat",
    description: "Pat another user",
    searchTerms: [
      "anime head pat",
      "cute anime pat",
      "wholesome pat gif"
    ],
    actionWord: "pats"
  },
  {
    name: "cuddle",
    description: "Cuddle another user",
    searchTerms: [
      "anime cuddle",
      "cute cuddle gif",
      "warm anime cuddle"
    ],
    actionWord: "cuddles"
  },
  {
    name: "kiss",
    description: "Kiss another user",
    searchTerms: [
      "anime kiss",
      "cute anime kiss",
      "romantic anime kiss"
    ],
    actionWord: "kisses"
  },
  {
    name: "lick",
    description: "Lick another user",
    searchTerms: [
      "anime lick gif",
      "cute anime lick",
      "funny anime lick"
    ],
    actionWord: "licks"
  },
  {
    name: "bite",
    description: "Bite another user",
    searchTerms: [
      "anime bite"
    ],
    actionWord: "bites"
  },
  {
    name: "punch",
    description: "Punch another user",
    searchTerms: [
      "anime punch",
      "funny punch gif",
      "cartoon punch"
    ],
    actionWord: "punches"
  },
  {
    name: "kick",
    description: "Kick another user",
    searchTerms: [
      "anime kick",
      "funny anime kick",
      "cartoon kick"
    ],
    actionWord: "kicks"
  },
  {
    name: "stare",
    description: "Stare at another user",
    searchTerms: [
      "anime stare",
      "funny anime stare",
      "anime intense stare"
    ],
    actionWord: "stares at"
  },
  {
    name: "wave",
    description: "Wave at another user",
    searchTerms: [
      "anime wave",
      "cute anime wave",
      "friendly anime wave"
    ],
    actionWord: "waves at"
  },
  {
    name: "highfive",
    description: "High five another user",
    searchTerms: [
      "anime high five",
      "cute high five gif",
      "funny anime high five"
    ],
    actionWord: "high fives"
  },
  {
    name: "handhold",
    description: "Hold hands with another user",
    searchTerms: [
      "anime hand hold",
      "romantic hand holding gif",
      "cute anime handhold"
    ],
    actionWord: "holds hands with"
  },
  {
    name: "poke",
    description: "Poke another user",
    searchTerms: [
      "anime poke gif",
      "funny poke",
      "cute anime poke"
    ],
    actionWord: "pokes"
  },
  {
    name: "tickle",
    description: "Tickle another user",
    searchTerms: [
      "anime tickle gif",
      "cute anime tickle",
      "funny tickle gif"
    ],
    actionWord: "tickles"
  },
  {
    name: "dance",
    description: "Dance with another user",
    searchTerms: [
      "anime dance gif",
      "funny anime dance",
      "cute anime dance"
    ],
    actionWord: "dances with"
  },
  {
    name: "blush",
    description: "Blush at another user",
    searchTerms: [
      "anime blush gif",
      "cute anime blush",
      "anime embarrassed gif"
    ],
    actionWord: "blushes at"
  },
  {
    name: "cry",
    description: "Cry to another user",
    searchTerms: [
      "anime cry gif",
      "sad anime cry",
      "cute crying gif"
    ],
    actionWord: "cries to"
  },
  {
    name: "laugh",
    description: "Laugh at another user",
    searchTerms: [
      "anime laugh gif",
      "funny anime laugh",
      "cartoon laugh"
    ],
    actionWord: "laughs at"
  },
  {
    name: "shrug",
    description: "Shrug at another user",
    searchTerms: [
      "anime shrug gif",
      "funny shrug",
      "cartoon shrug"
    ],
    actionWord: "shrugs at"
  }
];

const commands = actionConfigs.map(config => {
  const instance = new ActionCommand(config);
  return {
    cooldown: 5,
    data: instance.getData(),
    execute: (...args) => instance.execute(...args)
  };
});

module.exports = commands;
