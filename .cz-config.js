"use strict";

module.exports = {
  types: [
    {
      value: "WIP",
      name: "💪  WIP:      Work in progress"
    },
    {
      value: "feat",
      name: "✨  feat:     A new feature"
    },
    {
      value: "fix",
      name: "🐞  fix:      A bug fix"
    },
    {
      value: "refactor",
      name:
        "🛠  refactor: A code change that neither fixes a bug nor adds a feature"
    },
    {
      value: "docs",
      name: "📚  docs:     Documentation only changes"
    },
    {
      value: "test",
      name: "🏁  test:     Add missing tests or correcting existing tests"
    },
    {
      value: "chore",
      name:
        "🗯  chore:    Changes that don't modify src or test files. Such as updating build tasks, package manager"
    },
    {
      value: "style",
      name:
        "💅  style:    Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)"
    },
    {
      value: "revert",
      name: "⏪  revert:   Revert to a commit"
    }
  ],

  scopes: [],

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"]
};

function game(name, limit) {
  this.name = name;
  this.score = 0;
  this.limit = limit;
}
game.prototype.getScore = function() {
  this.score++;
};
game.prototype.win = function() {
  return this.limit >= this.score;
};

var WX = new game("wx", 2);
var TXL = new game("txl", 5);

if (WX.win() || TXL.win()) {
  // guan wo luan shi !
}
