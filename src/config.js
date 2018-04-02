// API key from Siena's account:
// 9C39DFA4-E061-4B3E-9504-CBDB4EDB070D

class Config {
  constructor() { this.apiKey = undefined; this.valid = false; }
  getKey() { return this.apiKey; }
  getValid() { return this.valid; }
  setKey(key) { this.apiKey = key; this.valid = true; }
}

module.exports = new Config();
