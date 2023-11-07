/*
Filename: ComplexCode.js

This code is a complex implementation of a task scheduler that handles multiple tasks and dependencies between them. It utilizes a graph data structure and topological sorting algorithm to order the tasks based on their dependencies, ensuring that dependent tasks are executed before their dependents. Each task is represented as a node in the graph, and edges represent the dependencies between tasks.

The code also includes implementations of various helper functions for manipulating the graph, adding tasks, adding dependencies, and executing the tasks in the correct order.

Please note that this code is purely for demonstrating complexity and creativity in writing JavaScript code. It may not be optimized or suitable for real-world use.

*/

// Graph data structure implementation
class Graph {
  constructor() {
    this.nodes = new Map(); // Stores nodes as "task name" -> "task node" mapping
    this.edges = new Map(); // Stores edges as "dependent task node" -> "list of dependency task nodes" mapping
  }

  addNode(name, callback) {
    this.nodes.set(name, {
      name,
      callback,
      dependencies: new Set(),
      dependents: new Set(),
    });
  }

  addEdge(from, to) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error('Invalid nodes');
    }
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);
    fromNode.dependents.add(toNode);
    toNode.dependencies.add(fromNode);
    this.edges.set(toNode, toNode.dependencies);
  }

  removeEdge(from, to) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error('Invalid nodes');
    }
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);
    fromNode.dependents.delete(toNode);
    toNode.dependencies.delete(fromNode);
    if (toNode.dependencies.size === 0) {
      this.edges.delete(toNode);
    }
  }

  hasNode(name) {
    return this.nodes.has(name);
  }

  sort() {
    const sortedNodes = [];
    const visited = new Set();

    const dfs = (node) => {
      visited.add(node);
      for (const dependent of node.dependents) {
        if (!visited.has(dependent)) {
          dfs(dependent);
        }
      }
      sortedNodes.unshift(node);
    };

    for (const node of this.nodes.values()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return sortedNodes;
  }
}

// Task scheduler implementation
class TaskScheduler {
  constructor() {
    this.graph = new Graph();
  }

  addTask(name, callback) {
    this.graph.addNode(name, callback);
  }

  addDependency(from, to) {
    this.graph.addEdge(from, to);
  }

  removeDependency(from, to) {
    this.graph.removeEdge(from, to);
  }

  execute() {
    const sortedTasks = this.graph.sort();
    for (const task of sortedTasks) {
      task.callback();
    }
  }
}

// Usage example
const scheduler = new TaskScheduler();

scheduler.addTask('Task 1', () => {
  console.log('Executing Task 1');
});

scheduler.addTask('Task 2', () => {
  console.log('Executing Task 2');
});

scheduler.addTask('Task 3', () => {
  console.log('Executing Task 3');
});

scheduler.addDependency('Task 1', 'Task 2');
scheduler.addDependency('Task 2', 'Task 3');

scheduler.execute();