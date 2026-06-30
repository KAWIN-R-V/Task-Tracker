// ================================
// Task Interface
// ================================

export interface Task {
    id: number;
    name: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    done: boolean;
}

// ================================
// Generic groupBy Function
// ================================

export function groupBy<T, K extends keyof T>(
    array: T[],
    key: K
): Record<string, T[]> {

    return array.reduce((groups, item) => {

        const value = String(item[key]);

        if (!groups[value]) {
            groups[value] = [];
        }

        groups[value].push(item);

        return groups;

    }, {} as Record<string, T[]>);

}

// ================================
// Task Manager Class
// ================================

export class TaskManager {

    private tasks: Task[] = [];

    constructor() {
        this.load();
    }

    // ----------------------------
    // Add Task
    // ----------------------------

    add(data: Omit<Task, "id" | "done">): Task {

        const task: Task = {

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

    getAll(): Task[] {

        return [...this.tasks];

    }

    // ----------------------------
    // Toggle Done
    // ----------------------------

    toggle(id: number): void {

        const task = this.tasks.find(t => t.id === id);

        if (task) {

            task.done = !task.done;

            this.save();

        }

    }

    // ----------------------------
    // Delete Task
    // ----------------------------

    remove(id: number): void {

        this.tasks = this.tasks.filter(task => task.id !== id);

        this.save();

    }

    // ----------------------------
    // Clear All
    // ----------------------------

    clear(): void {

        this.tasks = [];

        this.save();

    }

    // ----------------------------
    // Filter
    // ----------------------------

    filter(status: "all" | "done" | "pending"): Task[] {

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

    sortBy(
        field: keyof Pick<Task, "priority" | "dueDate">
    ): Task[] {

        const sorted = [...this.tasks];

        if (field === "priority") {

            const order = {

                High: 1,

                Medium: 2,

                Low: 3

            };

            sorted.sort(
                (a, b) =>
                    order[a.priority] - order[b.priority]
            );

        }

        if (field === "dueDate") {

            sorted.sort(
                (a, b) =>
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
            );

        }

        return sorted;

    }

    // ----------------------------
    // Save
    // ----------------------------

    private save(): void {

        localStorage.setItem(
            "tasks",
            JSON.stringify(this.tasks)
        );

    }

    // ----------------------------
    // Load
    // ----------------------------

    load(): void {

        const stored = localStorage.getItem("tasks");

        if (stored) {

            this.tasks = JSON.parse(stored);

        }

    }

}