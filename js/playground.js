/**
 * Created by Doma on 15/12/27.
 */

function Trie() {
    function Node(value, isTerminal) {
        this.value = value || null;
        this.isTerminal = !!isTerminal;
        this.children = [];
    }

    var root = new Node(),
        clear = function () {
            root.children = [];
        },
        insert = function (word) {
            return _recursiveInsert(root, word);
        };

    function _recursiveInsert(node, word) {
        if (word.length > 0) {
            var next = word[0],
                nextword = word.length > 1 ? word.substr(1) : "";
            for (var i = 0; i < node.children.length; i++) {
                var nextnode = node.children[i];
                if (nextnode.value == next) {
                    return node.isTerminal || _recursiveInsert(nextnode, nextword);
                }
            }
            var n = new Node(next);
            node.children.push(n);
            return node.isTerminal || _recursiveInsert(n, nextword);
        }
        node.isTerminal = true;
        return false;
    }

    return {
        root: root,
        insert: insert,
        clear: clear
    }
}

var trie = new Trie();
var words = [
    "a",
    "b",
    "c",
    "a 2"
];
for (var i = 0; i < words.length; i ++) {
    if (trie.insert(words[i])) {
        console.log(words[i]);
    }
}