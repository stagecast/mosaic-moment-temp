const fs = require('fs')

module.exports = {
  outputDir: '../mobile',
  publicPath: './',
  devServer: {
    https: {
      key: fs.readFileSync('/Users/filippoboiani/server.key'),
      cert: fs.readFileSync('/Users/filippoboiani/server.crt'),
    },
    public: 'https://localhost:8080/'
  }
}

// https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/
// ssh info
// Root CERT
// rootCA.key (openssl genrsa -des3 -out rootCA.key 2048)
// pass: testcollage

//
