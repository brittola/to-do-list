let inTask = document.getElementById('inTask');
let btAdd = document.getElementById('btAdd');
let outList = document.getElementById('outList');
let editScreen = document.querySelector('.editScreen');
let inEdit = document.getElementById('inEdit');
let btEdit = document.getElementById('btEdit');

let taskToEditIndex;

let tasks = [];

const getData = () => {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        setData(tasks);
    }
}

const setData = (array) => {
    localStorage.setItem('tasks', JSON.stringify(array));
}

const addTask = () => {
    if (inTask.value == '') {
        alert('Digite uma tarefa para adicionar.');
        inTask.focus();
        return;
    }

    getData();

    let newTask = inTask.value;

    tasks.push({task: newTask, status: ''});

    setData(tasks);

    refresh();

    inTask.value = '';
    inTask.focus();
}

const refresh = () => {
    getData();

    clearOutput();

    for (i in tasks) {
        let taskText = document.createElement('p');
        taskText.textContent = tasks[i].task;
        taskText.style.cursor = 'pointer';
        taskText.addEventListener('click', checkTask);
        if(tasks[i].status == 'checked'){
            taskText.className = 'checked';
        }

        let taskBtRemove = document.createElement('button');
        taskBtRemove.addEventListener('click', removeTask);
        taskBtRemove.textContent = 'X';

        let taskBtEdit =document.createElement('button');
        taskBtEdit.addEventListener('click', openEditScreen);
        taskBtEdit.textContent = '/';

        let taskDiv = document.createElement('div');
        taskDiv.setAttribute('id', Number(i));
        taskDiv.className = 'task';

        taskDiv.appendChild(taskText);
        taskDiv.appendChild(taskBtEdit);
        taskDiv.appendChild(taskBtRemove);

        outList.appendChild(taskDiv);
    }
}

const clearOutput = () => {
    let currentTasks = outList.getElementsByTagName('div');

    for (i = currentTasks.length - 1; i >= 0; i--) {
        outList.removeChild(currentTasks[i]);
    }
}

const removeTask = (event) => {
    let taskId = event.target.parentElement.id;

    getData();

    tasks.splice(taskId, 1);

    setData(tasks);

    refresh();
}

const checkTask = (event) => {
    let taskId = event.target.parentElement.id;

    getData();

    if(tasks[taskId].status == ''){
        tasks[taskId].status = 'checked';
    }else{
        tasks[taskId].status = '';
    }

    setData(tasks);

    refresh();
}

const openEditScreen = (event) => {
    editScreen.style.display = 'flex';
    taskToEditIndex = event.target.parentElement.id;
    inEdit.value = tasks[taskToEditIndex].task;
    inEdit.focus();
}

const confirmEdit = () => {
    if(inEdit.value == ''){
        alert('Experimente excluir a tarefa para não deixá-la vazia.');
        editScreen.style.display = 'none';
        inEdit.value = '';
        return;
    }
    
    getData();
    
    tasks[taskToEditIndex].task = inEdit.value;

    setData(tasks);

    editScreen.style.display = 'none';
    inEdit.value = '';

    refresh();
}

inEdit.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        confirmEdit();
    }
});
btEdit.addEventListener('click', confirmEdit);
inTask.addEventListener('keypress', (e) => {
    if(e.key === 'Enter'){
        addTask();
    }
});
btAdd.addEventListener('click', addTask);

refresh();
