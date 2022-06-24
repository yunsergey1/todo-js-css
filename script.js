const taskInput = document.querySelector('.task-input input'); // получаем доступ к инпуту
const taskDesk = document.querySelector('.task-desk'); // получаем доступ к доске задач, куда выводятся значения todo
const filters = document.querySelectorAll('.filters span');
const clearAll = document.querySelector('.controls .clear-all');

let editId;
let isEditedTask = false;
// вытаскиваем из LS JSON файл по ключу todo-list и парсим его в массив.
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelector("span.active").classList.remove("active");
		btn.classList.add("active");
		console.log(btn.id)
		showTodo(btn.id);
	});
})

// Создаем функция для вывода новых задач
function showTodo(filter) {
	let li = "";
	if (todos) {
		todos.forEach((todo, id) => {
			let isCompleted = todo.status == "completed"
				? "checked"
				: "";
			if (filter === todo.status || filter == 'all') {
				li += `
					<li class="task-desk__item">
						<label for="${id}">
							<input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
							<p class=${isCompleted}>${todo.name}</p>
						</label>
						<div class="settings">
							<i onclick="showSettingsMenu(this)" class="uil uil-ellipsis-h"></i>
							<ul class="settings__menu">
								<li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen">
									Редактировать
								</i></li>
								<li onclick="deleteTask(${id})"><i class="uil uil-trash">
									Удалить
								</i></li>
							</ul>
						</div>
					</li>
				`;
			}
		});
	}
	taskDesk.innerHTML = li || '<span>У вас нет текущих задач.</span>';
};

showTodo("all");

function showSettingsMenu(selectedTask) {
	let settingsMenu = selectedTask.parentElement.lastElementChild;
	settingsMenu.classList.add('show');
	document.addEventListener("click", e => {
		// Удаление класса show при клике на свободное поле веб-страницы
		if (e.target.tagName != "I" || e.target != selectedTask) {
			settingsMenu.classList.remove('show');
		}
	})
}

function editTask(taskId, taskName) {
	editId = taskId;
	isEditedTask = true;
	taskInput.value = taskName;
};

function deleteTask(deleteId) {
	// Удаляем задачу из массива
	todos.splice(deleteId, 1);
	localStorage.setItem("todo-list", JSON.stringify(todos)); // помещаем в LS в ключ todo-list массив в формате JSON
	showTodo("all"); // заново выводим задачи на экран
}

clearAll.addEventListener("click", () => {
		// Удаляем все задачи из массива
		todos.splice(0, todos.length);
		localStorage.setItem("todo-list", JSON.stringify(todos)); // помещаем в LS в ключ todo-list массив в формате JSON
		showTodo("all"); // заново выводим задачи на экран
})

function updateStatus(selectedTask) {
	let taskName = selectedTask.parentElement.lastElementChild; // выбираем последний элемент
	if (selectedTask.checked) {
		taskName.classList.add('checked');
		todos[selectedTask.id].status = "completed"; // меняем статус задачи
	} else {
		taskName.classList.remove('checked');
		todos[selectedTask.id].status = "pending"; // меняем статус задачи
	}
	localStorage.setItem("todo-list", JSON.stringify(todos)); // помещаем в LS в ключ todo-list массив в формате JSON
}

taskInput.addEventListener("keyup", e => {
	let userTask = taskInput.value.trim(); // получаем значение инпута + обрезаем лишние пробелы с краев
	if (e.key == "Enter" && userTask) {
		// Получаем массив todos из localStorage по ключу todo-list

		if (!isEditedTask) { // Если задачу не редактировали
			// Если todos не существует, то создаем пустой массив
			if (!todos) { 
				todos = [];
			}
			// Создаем объект в который помещаем значение инпута и статус "Активные"
			let taskInfo = {
				name: userTask,
				status: "pending",
			};
			todos.push(taskInfo); // добавляем объект с задачей в массив todos
		} else {
			isEditedTask = false;
			todos[editId].name = userTask;
		}
		taskInput.value = "";
		localStorage.setItem("todo-list", JSON.stringify(todos)); // помещаем в LS в ключ todo-list массив в формате JSON
		showTodo("all");
	};
});


