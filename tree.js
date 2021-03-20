process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
  input += chunk;
});

// A node. It must support multiple parents because of
// our test's error print ordering rules.
class Node {
  constructor(str) {
    this.value = str;
    this.parents = [];
    this.children = [];
  }
}

// Validates input against disqualification criteria.
// While this could be a single regex check, we could potentially
// clean up the input here before we fed it into the parser to make
// the program more resilient to malformed input.
const isInputFormatInvalid = (str) => {
  return (
    /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/.test(str) ||
    /[a-z]/.test(str) ||
    /\s\s+/.test(str)
  );
};

// Parses the input string. Returns false if we hit dupes.
// We have already done validation so we assume valid input.
const parseInputStringToTupleSet = (str) => {
  let arr = str.split(" ");
  let set = new Set(arr);
  if (set.size < arr.length) {
    return false;
  }
  return set;
};

// Prints the lexicographically smallest S-Expression
// Or, prints a binary search tree in sorted order
// We assume we have a binary search tree due to prior error checking.
const printExpressionRepresentation = (rootNode, treeNodes) => {
  //

  return "";
};

// Hello Optiver!
// And here we go...
process.stdin.on("end", function () {
  let err = [];

  input = "(A,B) (A,C) (B,D) (D,E) (C,F) (E,G)";

  // E1 check - invalid input format
  if (isInputFormatInvalid(input)) {
    console.log("E1");
    return;
  }

  // E2 check - duplicate nodes
  // We are going to bail early to save cycles by using Set to check dupes.
  let tupleSet = parseInputStringToTupleSet(input);
  if (!tupleSet) {
    console.log("E2");
    return;
  }

  // Easy bit is over, now we build the tree. We must build out
  // the entire "tree" even if it is malformed, because bailing
  // out on BST.add() would fail due to error order being important.
  // Instead, we must set error flags, work through the whole tuple
  // set and then bail out afterwards.

  let treeNodes = {};
  let rootNodes = {};

  tupleSet.forEach((tuple) => {
    const ta = tuple.slice(1, tuple.length - 1).split(",");
    const parentValue = ta[0];
    const childValue = ta[1];
    let parentNode;
    let childNode;

    // Find parent in set of processed nodes if it exists.
    // If not, instantiate a new node and assign it.
    if (treeNodes[parentValue]) {
      parentNode = treeNodes[parentValue];
    } else {
      parentNode = new Node(parentValue);
      treeNodes[parentValue] = parentNode;
    }

    // Find child in set of processed nodes if it exists.
    // If not, instantiate a new node and assign it.
    if (treeNodes[childValue]) {
      childNode = treeNodes[childValue];
    } else {
      childNode = new Node(childValue);
      treeNodes[childValue] = childNode;
    }

    // Connect parent and child...
    parentNode.children.push(childNode);
    childNode.parents.push(parentNode);

    // If our tuple's parent node has no parents, add it to the set of root nodes.
    if (!parentNode.parents.length) {
      rootNodes[parentValue] = parentNode;
    }

    // If any node is a child of another, it cannot be a root,
    // so if it exists in the set of root nodes, delete it.
    delete rootNodes[childValue];

    // E3 check - too many children
    // If our tuple's parent node has more than two children,
    // push an E3 to the error array.
    if (parentNode.children.length > 2) {
      err.push(3);
    }
  });

  // E4 check - multiple roots
  // If we have more than one root node, push an E4 to the error array.
  if (Object.keys(rootNodes).length > 1) {
    err.push(4);
  }

  // E5 check - input contains cycle
  // If we have no root nodes, we have a cycle, push an E5 to the error array.
  else if (!Object.keys(rootNodes).length) {
    err.push(5);
  }

  // If errors exist (E3, E4, E5), sort the error array, print the first error, and return.
  if (err.length) {
    console.log(`E${err.sort()[0]}`);
    return;
  }

  // If no errors exist, print the tree.
  printExpressionRepresentation(
    rootNodes[Object.keys(rootNodes)[0]],
    treeNodes
  );
  return;
});
