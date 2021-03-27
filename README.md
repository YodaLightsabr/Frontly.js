# Frontly.js
Frontly.js is express middleware that allows you to inject dynamic content into your webpages.

## How to use
First, install frontly.
```
npm install frontly
```
Second, require it and use it as middleware.
```js
const express = require('express');
const Frontly = require('frontly');

const app = express();
app.use(Frontly.middleware);
```
Third, make a HTML file that you want to serve.
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Frontly Demo</title>
  </head>
  <body>
    <h1><::Frontly.Custom.Title::></h1> <!-- This is the syntax for Frontly in an HTML document. -->
  </body>
</html>
```
Finally, serve the file with `res.sendFileFrontly()`.
```js
app.get('/', (req, res) => {
  res.sendFileFrontly(__dirname + '/index.html', {
    params: {
      Title: "Hello, world!"
    }
  });
});
```
Here's the final product:


![image](https://user-images.githubusercontent.com/76178582/112709270-19cb3e00-8e75-11eb-9528-b11e180cf21c.png)


[![Run on replit](https://camo.githubusercontent.com/8e37d97e0cefea4b2a18a1cbdea73d70bcb42a899ab4992166d13cf78c0473bc/68747470733a2f2f7265706c2e69742f62616467652f6769746875622f6c756e61726f79737465722f6d616e696d2d7265706c)](https://replit.com/github/YodaLightsabr/FrontlyDemo)
