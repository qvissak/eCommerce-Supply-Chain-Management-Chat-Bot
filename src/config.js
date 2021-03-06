
class Config {
  constructor() {
    this.apiKey = undefined;
    // API key from Siena's account:
    this.demoKey = '9C39DFA4-E061-4B3E-9504-CBDB4EDB070D';
    this.savedArgs = null;
  }
  getKey() { return this.apiKey; }
  getDemoKey() { return this.demoKey; }
  setKey(key) { this.apiKey = key; }
  resetKey() { this.apiKey = undefined; }
  getSavedArgs() { return this.savedArgs; }
  setSavedArgs(args) { this.savedArgs = args; }
}

module.exports = new Config();
