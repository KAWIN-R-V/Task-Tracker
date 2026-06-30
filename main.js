const form = document.querySelector("#task-form");
const taskName = document.querySelector("#task-name");
const priority = document.querySelector("#priority");
const dueDate = document.querySelector("#due-date");

const taskList = document.querySelector("#task-list");
const summaryBody = document.querySelector("#summary-body");
const prioritySummary = document.querySelector("#priority-summary");

const counter = document.querySelector("#task-counter");

const clearAllBtn = document.querySelector("#clear-all");

const filterAllBtn = document.querySelector("#filter-all");
const filterPendingBtn = document.querySelector("#filter-pending");
const filterDoneBtn = document.querySelector("#filter-done");

const sortDropdown = document.querySelector("#sort-tasks");

// ===============================
// Global Variables
// ===============================

let tasks = [];

let currentFilter = "all";

let currentSort = "priority";

// ===============================
// Load Tasks
// ===============================

loadTasks();

renderTasks();

// ===============================
// Form Submit
// ===============================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = taskName.value.trim();

    const priorityValue = priority.value;

    const due = dueDate.value;

    if (name === "" || due === "") {

        alert("Please fill in all fields.");

        return;

    }

    const task = {

        id: Date.now(),

        name: name,

        priority: priorityValue,

        dueDate: due,

        done: false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    form.reset();

});

// ===============================
// Clear All
// ===============================

clearAllBtn.addEventListener("click", () => {

    if (confirm("Delete all tasks?")) {

        tasks = [];

        saveTasks();

        renderTasks();

    }

});

// ===============================
// Filter Buttons
// ===============================

filterAllBtn.addEventListener("click", () => {

    currentFilter = "all";

    renderTasks();

});

filterPendingBtn.addEventListener("click", () => {

    currentFilter = "pending";

    renderTasks();

});

filterDoneBtn.addEventListener("click", () => {

    currentFilter = "done";

    renderTasks();

});

// ===============================
// Sort Dropdown
// ===============================

sortDropdown.addEventListener("change", () => {

    currentSort = sortDropdown.value;

    renderTasks();

});

// ===============================
// Local Storage
// ===============================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

function loadTasks() {

    const stored = localStorage.getItem("tasks");

    if (stored) {

        tasks = JSON.parse(stored);

    }

}

// ===============================
// Render Tasks
// ===============================

function renderTasks() {

    taskList.innerHTML = "";
    summaryBody.innerHTML = "";
    prioritySummary.innerHTML = "";

    let filteredTasks = [...tasks];

    // ----------------------------
    // Filtering
    // ----------------------------

    if (currentFilter === "pending") {

        filteredTasks = filteredTasks.filter(task => !task.done);

    }

    if (currentFilter === "done") {

        filteredTasks = filteredTasks.filter(task => task.done);

    }

    // ----------------------------
    // Sorting
    // ----------------------------

    if (currentSort === "priority") {

        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        filteredTasks.sort((a, b) =>
            priorityOrder[a.priority] - priorityOrder[b.priority]
        );

    }

    if (currentSort === "dueDate") {

        filteredTasks.sort((a, b) =>
            new Date(a.dueDate) - new Date(b.dueDate)
        );

    }

    // ----------------------------
    // Counter
    // ----------------------------

    counter.textContent =
        `Showing ${filteredTasks.length} of ${tasks.length} tasks`;

    // ----------------------------
    // Today's Date
    // ----------------------------

    const today = new Date().toISOString().split("T")[0];

    // ----------------------------
    // Render Each Task
    // ----------------------------

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        if (task.done) {

            li.classList.add("done");

        }

        if (!task.done && task.dueDate <= today) {

            li.classList.add("overdue");

        }

        li.innerHTML = `

            <div class="task-info">

                <strong>${task.name}</strong>

                <p>
                    Priority:
                    ${task.priority}
                </p>

                <p>
                    Due:
                    ${task.dueDate}
                </p>

            </div>

            <div class="task-actions">

                <button class="done-btn">
                    ${task.done ? "Undo" : "Done"}
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>

        `;

        // ------------------------
        // Done Button
        // ------------------------

        li.querySelector(".done-btn")
            .addEventListener("click", () => {

                task.done = !task.done;

                saveTasks();

                renderTasks();

            });

        // ------------------------
        // Delete Button
        // ------------------------

        li.querySelector(".delete-btn")
            .addEventListener("click", () => {

                tasks = tasks.filter(t => t.id !== task.id);

                saveTasks();

                renderTasks();

            });

        taskList.appendChild(li);

        // ------------------------
        // Summary Table
        // ------------------------

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${task.name}</td>

            <td>${task.priority}</td>

            <td>${task.dueDate}</td>

            <td>${task.done ? "Done" : "Pending"}</td>

        `;

        summaryBody.appendChild(row);

    });

    renderPrioritySummary();

}

// ===============================
// Priority Summary
// ===============================

function renderPrioritySummary() {

    const counts = {

        High: 0,

        Medium: 0,

        Low: 0

    };

    tasks.forEach(task => {

        counts[task.priority]++;

    });

    Object.keys(counts).forEach(priority => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${priority}</td>

            <td>${counts[priority]}</td>

        `;

        prioritySummary.appendChild(row);

    });

}