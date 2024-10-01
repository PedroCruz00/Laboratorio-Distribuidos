const { encode } = require('gpt-3-encoder');

const countTokens = (text) => {

    const tokens = encode(text);
    return tokens.length; 
};

module.exports = { countTokens };
