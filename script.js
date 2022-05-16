//declarar variáveis
let inTask = document.getElementById('inTask');
let btAdd = document.getElementById('btAdd');
let outList = document.getElementById('outList');
let editScreen = document.querySelector('.editScreen');
let inEdit = document.getElementById('inEdit');
let btEdit = document.getElementById('btEdit');

//essa variável vai receber o id de qual task foi clicada, para quando o usuário
//confirmar a edição da task, esse id ser utilizado para editar a task exata no array
let taskToEditIndex;

//declara array que vai armazenar as tasks como objetos (texto da task e status de concluído ou não)
let tasks = [];

//se já houver tasks salvas em local storage, pega e coloca no array tasks
const getData = () => {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    } else {
        setData(tasks);
    }
}

//salva o array em localStorage com a chave 'tasks' que será utilizada na função getData
const setData = (array) => {
    localStorage.setItem('tasks', JSON.stringify(array));
}

//pega o que estiver digitado no campo, pega o array tasks, adiciona a ele a tarefa digitada com status vazio
//em seguida salva o array em localStorage e chama a função refresh
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

//essa função pega o array que está salvo em localStorage e monta as tasks na tela (antes, limpa as que já estiverem para que não se repitam)
const refresh = () => {
    getData();

    clearOutput();

    for (i in tasks) {
        //cria o texto da task, que foi o previamente digitado, adiciona o estilo de cursor 'pointer' para o usuário saber que é clicável
        //a esse click, associa a função 'checkTask' e se o status da task no array tasks for 'checked', passa uma classe no CSS com line-through
        let taskText = document.createElement('p');
        taskText.textContent = tasks[i].task;
        taskText.style.cursor = 'pointer';
        taskText.addEventListener('click', checkTask);
        if(tasks[i].status == 'checked'){
            taskText.className = 'checked';
        }

        //cria o botão que vai ser "irmão" do texto da task e associa a ele a função removeTask
        let taskBtRemove = document.createElement('button');
        taskBtRemove.addEventListener('click', removeTask);
        taskBtRemove.textContent = 'X';

        let taskBtEdit =document.createElement('button');
        taskBtEdit.addEventListener('click', openEditScreen);
        taskBtEdit.textContent = '/';

        //cria a div pai do texto e do botão da task e associa a ela a classe no CSS e o id, que vai ser a posição dela no array tasks
        let taskDiv = document.createElement('div');
        taskDiv.setAttribute('id', Number(i));
        taskDiv.className = 'task';

        taskDiv.appendChild(taskText);
        taskDiv.appendChild(taskBtEdit);
        taskDiv.appendChild(taskBtRemove);

        outList.appendChild(taskDiv);
    }
}

//checa se tem elementos div no output, se houver, remove eles do fim até o começo
const clearOutput = () => {
    let currentTasks = outList.getElementsByTagName('div');

    for (i = currentTasks.length - 1; i >= 0; i--) {
        outList.removeChild(currentTasks[i]);
    }
}

//essa função é ativada no botão 'X', pega o id do elemento pai desse botão, que é a div
//task e então remove essa div do array e chama a função refresh para montar a tela novamente
const removeTask = (event) => {
    let taskId = event.target.parentElement.id;

    getData();

    tasks.splice(taskId, 1);

    setData(tasks);

    refresh();
}

//essa função é ativada quando se clica no texto da task, pega o id do elemento pai
//e então muda a propriedade status dessa task no array 'tasks', depois salva e chama a função refresh
//que vai ler o novo status e passar a class com line-through
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
    getData();

    tasks[taskToEditIndex].task = inEdit.value;

    setData(tasks);

    editScreen.style.display = 'none';
    inEdit.value = '';

    refresh();
}

btEdit.addEventListener('click', confirmEdit);

//associa ao botão Add a função addTask
btAdd.addEventListener('click', addTask);

//chama o refresh ao iniciar a página, para verificar se há um array com tasks previamente salvas e montar a tela
refresh();