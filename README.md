# @nextjournal/lang-clojure [![NPM version](https://img.shields.io/npm/v/@nextjournal/lang-clojure.svg)](https://www.npmjs.com/package/@nextjournal/lang-clojure)

This package implements Clojure language support for the [CodeMirror](https://codemirror.net/) code editor.

!! This fork supports Smart Indent.
However, I don't want to keep this fork, now that I see a possibility that 'Clojure Smart Indent' may work as a separate extension after all. Still figuring out the details.


## API Reference
<dl>
<dt>
  <code><strong><a href="#">clojure</a></strong>() → <a href="https://codemirror.net/docs/ref#language.LanguageSupport">LanguageSupport</a></code></dt>

<dd><p>Clojure language support.</p>
</dd>
<dt>
  <code><strong><a href="#">clojureLanguage</a></strong>: <a href="https://codemirror.net/docs/ref#language.LezerLanguage">LezerLanguage</a></code></dt>

<dd><p>A language provider based on the <a href="https://github.com/nextjournal/lezer-clojure">Lezer Clojure
parser</a>, extended with
highlighting and indentation information.</p>
</dd>
</dl>

## Try it

https://nextjournal.github.io/lang-clojure

## Contribute

```
yarn install
```

Run demo locally

```
yarn dev
```

Build dist

```
yarn prepare
```
