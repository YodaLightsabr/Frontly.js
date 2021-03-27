const config = {
  version: '1.0'
}
const fs = require('fs');
class Parser {
  constructor (text, customIndex) {
    this.text = text;
    this.index = {
      'Frontly': 'Frontly v' + config.version,
      'Frontly.Version': config.version,
      'Frontly.VersionString': 'v' + config.version,
      'Frontly.HelloWorld': 'Hello, world! - Frontly.js'
    }
    this.customIndex = customIndex;
  }
  parse () {
    var text = this.text;
    var regex = new RegExp('<::([^::>]+)::>', 'g');
    var matches = text.match(regex);
    if (matches == null) return text;
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      var start = text.substring(0, text.indexOf(match));
      var end = text.substring(text.indexOf(match) + match.length);
      var inner = match.substring(3, match.length - 3);
      if (inner.startsWith('Frontly.Scripting') && inner.match(new RegExp('<\\?(.|\\n)*\\?>', 'g')) !== null) {
        var newMatch = inner.match(new RegExp('<\\?(.|\\n)*\\?>', 'g'));
        var script = newMatch[0].substring(2, newMatch[0].length - 2);
        text = start + eval(script) + end;
      } else {
        text = start + this.replace(inner) + end;
      }
    }
    return text;
  }
  replace (frontlyReference) {
    var fr = frontlyReference;
    if (Object.keys(this.index).includes(fr)) {
      return this.index[fr];
    }
    if (Object.keys(this.customIndex || {}).map(a => 'Frontly.Custom.' + a).includes(fr)) {
      return this.customIndex[fr.substring(15)];
    }
    return '<::Error::MissingFromIndex::' + fr + '::>'
  }
}
const Frontly = {
  middleware (req, res, next) {
    res.sendFrontly = (text, opts) => {
      var parser = new Parser(text, (opts || {}).params);
      res.send(parser.parse());
    }
    res.sendFileFrontly = (path, opts) => {
      fs.readFile(path, 'utf-8', (err, text) => {
        if (err) throw err;
        res.sendFrontly(text, opts);
      });
    }
    next();
  },
  applyTo (app) {
    app.use(this.middleware);
  },
  Parser: Parser
}
module.exports = Frontly;
