// API key from Siena's account:
// 9C39DFA4-E061-4B3E-9504-CBDB4EDB070D

class Config {
  constructor() {
    this.apiKey = undefined;
  }

  setKey(key) {
    this.apiKey = key;
  }

  getKey() {
    return this.apiKey;
  }
}

module.exports = new Config();
