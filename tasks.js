// ================================
// Task Interface
// ================================
// ================================
// Generic groupBy Function
// ================================
export function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const value = String(item[key]);
        if (!groups[value]) {
            groups[value] = [];
        }
        groups[value].push(item);
        return groups;
    }, {});
}
// ================================
// Task Manager Class
// ================================
export class TaskManager {
    tasks = [];
    constructor() {
        this.load();
    }
    // ----------------------------
    // Add Task
    // ----------------------------
    add(data) {
        const task = {
            id: Date.now(),
            name: data.name,
            priority: data.priority,
            dueDate: data.dueDate,
            done: false
        };
        this.tasks.push(task);
        this.save();
        return task;
    }
    // ----------------------------
    // Get All Tasks
    // ----------------------------
    getAll() {
        return [...this.tasks];
    }
    // ----------------------------
    // Toggle Done
    // ----------------------------
    toggle(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.done = !task.done;
            this.save();
        }
    }
    // ----------------------------
    // Delete Task
    // ----------------------------
    remove(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.save();
    }
    // ----------------------------
    // Clear All
    // ----------------------------
    clear() {
        this.tasks = [];
        this.save();
    }
    // ----------------------------
    // Filter
    // ----------------------------
    filter(status) {
        switch (status) {
            case "done":
                return this.tasks.filter(task => task.done);
            case "pending":
                return this.tasks.filter(task => !task.done);
            default:
                return [...this.tasks];
        }
    }
    // ----------------------------
    // Sort
    // ----------------------------
    sortBy(field) {
        const sorted = [...this.tasks];
        if (field === "priority") {
            const order = {
                High: 1,
                Medium: 2,
                Low: 3
            };
            sorted.sort((a, b) => order[a.priority] - order[b.priority]);
        }
        if (field === "dueDate") {
            sorted.sort((a, b) => new Date(a.dueDate).getTime() -
                new Date(b.dueDate).getTime());
        }
        return sorted;
    }
    // ----------------------------
    // Save
    // ----------------------------
    save() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }
    // ----------------------------
    // Load
    // ----------------------------
    load() {
        const stored = localStorage.getItem("tasks");
        if (stored) {
            this.tasks = JSON.parse(stored);
        }
    }
}
