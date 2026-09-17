class Node {

    constructor(data) {

        this.data = data;
        this.next = null;
        this.prev = null;
    }

    getData() { return this.data }
    getNext() { return this.next }
    getPrev() { return this.prev }
}

class LinkedList {

    constructor() {

        this.firstNode = null;
        this.lastNode = null;
    }

    insertAfter(currentNode, newNode) {

        newNode.prev = currentNode;

        if (currentNode.next === null) {

            this.lastNode = newNode;
            return;
        }

        else if (currentNode.next !== null) {

            newNode.next = currentNode.next;
            currentNode.next.prev = newNode;
        }

        currentNode.next = newNode;
    }

    insertBefore(newNode) {

        if (this.lastNode === null) {

            newNode.prev = newNode;
            newNode.after = newNode;
        }

        else if (lasNode !== null) {

            this.insertAfter(this.lastNode, newNode);
        }

        this.lastNode = newNode;
    }

    remove(node) {

        if (node.next === node) {

            this.lastNode = null;
        }
        else {

            node.next.prev = node;
            node.prev.next = node;

            if (node === this.lastNode) { this.lastNode = node.prev }
        }


    }

    traverseForwards() {

        let current = this.firstNode;
        let result = "";

        while (current) {

            result += current.getData() + "->";
            current = current.getNext();
        }
        console.log(result + "null");
    }

    traverseBackwards() {

        let current = this.lastNode;
        let result = "";

        while (current) {

            result += current.getData() + "->";
            current = current.getPrev();
        }
        console.log(result + "null");
    }
}

export { Node, LinkedList }