# 🤝 Сosmopolite
Make a ES Module for NPM and a dist file for &lt;script> at the same time

## Why?

When making open source libraries, you don't want to limit your users. I believe that any simple library should be installable in at least two ways:
1. `npm install amazingLib`
2. `<script src="https://amazingCDN.com/amazingLib.js"></script>`

But obviously you don't want to develop two separate codebases.

This is where Cosmopolite steps in.

## What it does?

It takes your NPM library you wrote with ES imports and makes the distributive script file out of it. Your users now can not only `npm install` your library, they also can include that generated file with a `<script>` tag and everything will work.

## Usage

1. Make your own repo, use this repo as a template
2. Go to `package.json` and change the `name` field. Let's say you changed it to `awesomeLib`
3. Implement your library inside `src` folder
4. Push changes. The `dist` folder will appear, there will be the `awesomeLib.js` file. This is your dist.
5. Publish your library via NPM or Yarn to your favorite registry

Now your library will be accessible via both
```
npm install awesomeLib
```
and
```HTML
<script src="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-LOGIN/awesomeLib/dist/awesomeLib.min.js"></script>
```

Enjoy!
