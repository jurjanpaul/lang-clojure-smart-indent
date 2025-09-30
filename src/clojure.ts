import {parser, props} from "@nextjournal/lezer-clojure"
import {NodeProp, SyntaxNode, NodeType} from "@lezer/common"
import {styleTags, tags} from "@lezer/highlight"
import {indentNodeProp, foldNodeProp, foldInside, LRLanguage, LanguageSupport, TreeIndentContext} from "@codemirror/language"
import { EditorState } from "@codemirror/state"

/// A language provider based on the [Lezer Clojure](https://github.com/nextjournal/lezer-clojure), extended with
/// highlighting and indentation information.

const {coll} = props

// debug
// const nodeText = (state, node: SyntaxNode) => { return state.doc.sliceString(node.from, node.to) }

function nodeText(state: EditorState, node: SyntaxNode) {
  return state.doc.sliceString(node.from, node.to);
}

function createLookupMap(words: string[]) {
  var obj: { [key: string]: boolean } = {};
  for (var i = 0; i < words.length; ++i) {
     obj[words[i]] = true;
  }
  return obj;
}

var haveBodyParameter = [
  "->", "->>", "as->", "binding", "bound-fn", "case", "catch", "comment",
  "cond", "cond->", "cond->>", "condp", "def", "definterface", "defmethod",
  "defn", "defmacro", "defprotocol", "defrecord", "defstruct", "deftype",
  "do", "doseq", "dotimes", "doto", "extend", "extend-protocol",
  "extend-type", "fn", "for", "future", "if", "if-let", "if-not", "if-some",
  "let", "letfn", "locking", "loop", "ns", "proxy", "reify", "struct-map",
  "some->", "some->>", "try", "when", "when-first", "when-let", "when-not",
  "when-some", "while", "with-bindings", "with-bindings*", "with-in-str",
  "with-loading-context", "with-local-vars", "with-meta", "with-open",
  "with-out-str", "with-precision", "with-redefs", "with-redefs-fn"];
var hasBodyParameter = createLookupMap(haveBodyParameter);

function nextNodeOnSameLine(state: EditorState, node: SyntaxNode) {
  let line = state.doc.lineAt(node.from);
  let nextNode = node.nextSibling;
  while (nextNode && nextNode.type.isSkipped && nextNode.to < line.to) {
     nextNode = nextNode.nextSibling;
  }
  if (nextNode && !nextNode.type.isSkipped && nextNode.to < line.to) {
    return nextNode;
  }
}

export const clojureLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [styleTags({NS: tags.keyword,
                       DefLike: tags.keyword,
                       "Operator/Symbol": tags.keyword,
                       "VarName/Symbol": tags.definition(tags.variableName),
                       // Symbol: tags.keyword,
                       // "'": tags.keyword, // quote
                       Boolean: tags.atom,
                       "DocString/...": tags.emphasis,
                       "Discard!": tags.comment,
                       Number: tags.number,
                       StringContent: tags.string,
                       "\"\\\"\"": tags.string, // need to pass something, that returns " when being parsed as JSON
                       Keyword: tags.atom,
                       Nil: tags.null,
                       LineComment: tags.lineComment,
                       RegExp: tags.regexp}),

            indentNodeProp.add((nodeType: NodeType) => {
              return (context: TreeIndentContext) => {
                let {pos, unit, node, state, baseIndent, textAfter} = context
                if (nodeType.prop(coll) && node.firstChild) {
                  let parentBase = context.column(node.firstChild.to) // column at the right of parent opening-(
                  let startSymbolNode = node.firstChild.nextSibling;
                  if ("List" == nodeType.name && startSymbolNode) {
                    if (hasBodyParameter[(nodeText(state, startSymbolNode))]) {
                      return parentBase + 1;
                    }
                    let nextNode = nextNodeOnSameLine(state, startSymbolNode);
                    if (nextNode) {
                      return context.column(nextNode.from);
                    }
                  }
                  return parentBase
                } else {
                  return 0
                }
              }
            }),

            foldNodeProp.add({["Vector Map List"]: foldInside})]}),

  languageData: {commentTokens: {line: ";;"}}})

export function clojure() {
  return new LanguageSupport(clojureLanguage)
}
