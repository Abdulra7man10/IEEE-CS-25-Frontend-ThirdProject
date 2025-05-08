

// Select elements
const taskInput = document.getElementById("Task-input");
const submitBtn = document.getElementById("submit-btn");
const taskBox = document.querySelector(".all-Tasks-box");
const form = document.querySelector("form");

// Load tasks from local storage when page loads
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Handle form submission
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const newTask = {
            id: Date.now(),
            text: taskText,
            status: "None",
            time: getCurrentDateTime()
        };
        tasks.push(newTask);
        saveToLocalStorage();
        renderTasks();
        taskInput.value = "";
    }
});

// Get current date & time
function getCurrentDateTime() {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
}

// Save tasks to local storage
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render all tasks
function renderTasks() {
    taskBox.innerHTML = ""; // Clear previous content
    if (tasks.length === 0) {
        taskBox.innerHTML = "<h2>No tasks yet</h2>";
        return;
    }

    tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        taskDiv.innerHTML = `
            <div class="txt-box">
                <h2 contenteditable="false">${task.text}</h2>
                <p>${task.time}</p>
            </div>
            <div class="inner-box">
                <div class="status">
                    <label>Status :</label>
                    <select>
                        <option ${task.status === "None" ? "selected" : ""}>None</option>
                        <option ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                        <option ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                    </select>
                </div>
                <div class="icons">
                    <i class="fa-solid fa-trash" style="color: #ff1414;" data-id="${task.id}"></i>
                    <i class="fa-solid fa-pen-to-square" style="color: #FFD43B;" data-id="${task.id}"></i>
                </div>
            </div>
        `;

        // Status change handler
        taskDiv.querySelector("select").addEventListener("change", (e) => {
            task.status = e.target.value;
            saveToLocalStorage();
        });

        // Delete handler
        taskDiv.querySelector(".fa-trash").addEventListener("click", (e) => {
            const id = +e.target.dataset.id;
            const confirmDelete = confirm("Are you sure you want to delete this task?");
            if (confirmDelete) {
                tasks = tasks.filter(t => t.id !== id);
                saveToLocalStorage();
                renderTasks();
            }
        });

        // Edit handler
        taskDiv.querySelector(".fa-pen-to-square").addEventListener("click", (e) => {
            const id = +e.target.dataset.id;
            const taskTitle = taskDiv.querySelector("h2");
            taskTitle.contentEditable = true;
            taskTitle.focus();

            taskTitle.addEventListener("blur", () => {
                const newText = taskTitle.innerText.trim();
                if (newText !== "") {
                    const taskToUpdate = tasks.find(t => t.id === id);
                    taskToUpdate.text = newText;
                    saveToLocalStorage();
                }
                taskTitle.contentEditable = false;
            }, { once: true });
        });

        taskBox.prepend(taskDiv);
    });
}
