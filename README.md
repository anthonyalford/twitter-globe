# Tweets on a Map!

Real-time visualization of geotagged tweets about a given topic using socket.io, and the Twitter API.

Read the original blog post at:

http://joelgrus.com/2016/02/27/trump-tweets-on-a-globe-aka-fun-with-d3-socketio-and-the-twitter-api/


First install the dependencies:

```bash
$ npm install
```

then create a `credentials.js` that looks like

```js
module.exports = {
  consumer_key: "...",
  consumer_secret: "...",
  access_token_key: "...",
  access_token_secret: "..."
};
```

You can run the original globe app with this:

```bash
$ node twitter-globe.js "search phrase goes here"
```

Or the map app:

```bash
$ node twitter-map.js
```


and finally navigate your browser to `localhost:3000`.

Put it up on a giant screen! It's strangely mesmerizing.
