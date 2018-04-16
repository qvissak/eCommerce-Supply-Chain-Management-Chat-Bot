
class Config {
  constructor() {
    this.apiKey = undefined;
    // API key from Siena's account:
    this.demoKey = '9C39DFA4-E061-4B3E-9504-CBDB4EDB070D';
  }
  getKey() { return this.apiKey; }
  getDemoKey() { return this.demoKey; }
  setKey(key) { this.apiKey = key; }
  resetKey() { this.apiKey = undefined; }
}

module.exports = new Config();
