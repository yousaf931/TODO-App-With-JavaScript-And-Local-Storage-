const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("#total-tasks");
const completedTasks = document.querySelector("#completed-tasks");
const remainingTasks = document.querySelector("#remaining-tasks");
const mainInput = document.querySelector("#todo-form input");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
if (localStorage.getItem('tasks')) {
    tasks.map((task) => createTask(task));
}

todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = mainInput.value;

    if (inputValue == "") {
        return;
    }

    const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    createTask(task);

    todoForm.reset();
    mainInput.focus();
});

function createTask(task) {
    const taskEl = document.createElement("li");
    taskEl.setAttribute("id", task.id);

    if (task.isCompleted) {
        taskEl.classList.add("complete");
    }

    const taskElMarkup = `
        <div class="flex items-center gap-3">
        <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? "checked" : ""}>
        <span ${!task.isCompleted ? 'contenteditable' : "" } class="p-2 rounded-md transition duration-200 ease-in-out cursor-pointer focus:bg-blue-700 focus:outline-none">${task.name}</span>
        </div>
        <button id="remove-task" class="remove-task" title="Remove the ${task.name} task">
        <svg class="custom-svg" fill="#78B8D8" height="15px" width="15px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="512,59.076 452.922,0 256,196.922 59.076,0 0,59.076 196.922,256 0,452.922 59.076,512 256,315.076 452.922,512 512,452.922 315.076,256 "></polygon> </g> </g> </g></svg>
        </button>
    `;

    taskEl.innerHTML = taskElMarkup
    todoList.appendChild(taskEl)
    countTask()

}

function countTask(){
    const completedTaskArray = tasks.filter((task) => task.isCompleted === true)
    totalTasks.textContent = tasks.length
    completedTasks.textContent = completedTaskArray.length
    remainingTasks.textContent = tasks.length - completedTaskArray.length

}

todoList.addEventListener('click', (e) => {
    const clickedElement = e.target.closest('.remove-task')

    if (clickedElement) {
        const taskId = clickedElement.closest('li').id
        removeTask(taskId)
    }
});

todoList.addEventListener('input', (e)=>{
    const taskId = e.target.closest('li').id
    updateTask(taskId, e.target)
    })

function removeTask(taskId){
    tasks = tasks.filter((task)=> task.id !== parseInt(taskId))
    localStorage.setItem('tasks', JSON.stringify(tasks))
    document.getElementById(taskId).remove()
    countTask()
}

function updateTask(taskId, el){
    const task = tasks.find((task)=> task.id === parseInt(taskId))
    console.log(task)

    if(el.hasAttribute('contenteditable')) {
        task.name = el.textContent
    } else {
        const span = el.nextElementSibling
        const parent = el.closest('li')
        task.isCompleted = !task.isCompleted
        console.log(task.isCompleted)

        if(task.isCompleted) {
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        } else {
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('complete')
        }

    }
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
    countTask()
}

todoList.addEventListener("keydown", function (e) {

    if (e.keyCode === 13) {
      e.preventDefault();
    }
  
});
  