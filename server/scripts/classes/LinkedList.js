class Node {

    constructor(value) {

        this.value = value;
        this.next = null;
    }

    getValue() { return this.value }
    getNext() { return this.next }
}

class LinkedList {

    constructor() {

        this.head = null;
    }

    append(value) {

        let node = new Node(value);

        if (!this.head) {

            this.head = node;
            return;
        }

        let current = this.head;

        while (current.next) {
            current = current.next;
        }
        current.next = node;
    }

    delete(value) {

        if (!this.head) {

            console.log("HEAD IS EMPTY");
            return;
        }
        else if (this.head.value === value) {

            this.head = this.head.next;
        }

        let prev = null;
        let current = this.head;

        while (current && current.value !== value) {

            prev = current;
            current = current.next;
        }
        if (!current) {

            console.log("CANNOT FIND VALUE.")
            return;
        }
        prev.next = current.next;
    }

    printList() {

        let current = this.head;
        let result = "";

        while (current) {

            result += current.getValue() + "->";
            current = current.getNext();
        }
        console.log(result + "null");
    }
}

export { Node, LinkedList }