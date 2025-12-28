document.addEventListener('DOMContentLoaded', () => {
    let todoInput = document.getElementById('task-input');
    let addTaskButton = document.getElementById('task-add-btn');
    let todoList = document.getElementById('todo-list');

    let taskStore = JSON.parse(localStorage.getItem('tasks')) || [];
    taskStore.forEach(element => {
        renderTasks(element);
    });

    // Add task 
    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") {
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        taskStore.push(newTask);
        saveTask();
        renderTasks(newTask);
        todoInput.value = ""
    })

    // save task to local storage
    function saveTask() {
        localStorage.setItem('tasks', JSON.stringify(taskStore))
    }

    function renderTasks(task) {
        const li = document.createElement('li');
        li.setAttribute('task-li', task.id);
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
        <span>${task.text}</span>
        <button>Delete</button>
        `;

        li.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveTask();
        });

        li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            taskStore = taskStore.filter(t => t.id !== task.id);
            li.remove();
            saveTask();
        })

        todoList.appendChild(li);
    }
})