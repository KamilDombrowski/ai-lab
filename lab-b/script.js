class Todo {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.term = '';
        this.initialize();
        this.draw();
    }

    initialize() {
        document.getElementById('add-task').addEventListener('click', () => this.addTask());
        document.getElementById('search').addEventListener('input', (e) => {
            this.term = e.target.value;
            this.draw();
        });
    }

    addTask() {
        const taskContent = document.getElementById('new-task').value;
        const taskDate = document.getElementById('task-date').value;

        if (taskContent.length < 3 || taskContent.length > 255) {
            alert('Zadanie musi mieć między 3 a 255 znaków.');
            return;
        }
        if (taskDate && new Date(taskDate) < new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        this.tasks.push({ content: taskContent, date: taskDate });
        this.saveTasks();
        this.draw();
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.draw();
    }

    editTask(index) {
        const listItem = document.getElementById(`task-${index}`);
        const taskContent = listItem.querySelector('.task-content');  // Div zawierający treść zadania
        const taskDateElement = listItem.querySelector('.task-date');  // Element <span> zawierający datę zadania
        const originalContent = taskContent.textContent;
        const originalDate = taskDateElement ? taskDateElement.getAttribute('data-date') : '';
    
        // Ustawienie pola edytowalnego dla treści zadania
        taskContent.contentEditable = true;
        taskContent.focus();
    
        // Tworzenie pola daty
        const dateInput = document.createElement('input');
        dateInput.type = 'datetime-local';
        dateInput.value = originalDate ? new Date(originalDate).toISOString().slice(0, 16) : '';
        taskDateElement.replaceWith(dateInput);
    
        // Funkcja zapisująca zmiany po wyjściu z edycji
        const saveChanges = () => {
            taskContent.contentEditable = false;
            const updatedContent = taskContent.textContent.trim();
            const updatedDate = dateInput.value;
    
            if (updatedContent.length < 3 || updatedContent.length > 255) {
                alert('Zadanie musi mieć między 3 a 255 znaków.');
                taskContent.textContent = originalContent;  // Przywróć oryginalną treść
            } else {
                this.tasks[index].content = updatedContent;
            }
    
            // Zapis nowej daty, jeśli jest ustawiona
            if (updatedDate) {
                const newDate = new Date(updatedDate);
                if (newDate < new Date()) {
                    alert('Data musi być w przyszłości.');
                    taskDateElement.textContent = originalDate ? new Date(originalDate).toLocaleString() : '';
                } else {
                    this.tasks[index].date = updatedDate;
                }
            } else {
                this.tasks[index].date = '';  // Wyczyść datę, jeśli pole jest puste
            }
    
            this.saveTasks();
            this.draw();
            document.removeEventListener('click', outsideClickListener);
        };
    
        const outsideClickListener = (event) => {
            if (!listItem.contains(event.target)) saveChanges();
        };
    
        document.addEventListener('click', outsideClickListener);
    }
    
    

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    draw() {
        const listElement = document.getElementById('todo-list');
        listElement.innerHTML = '';
        const filteredTasks = this.getFilteredTasks();
        
        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.setAttribute('id', `task-${index}`);
    
            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');
            taskContent.innerHTML = this.highlightTerm(task.content);  // Podświetlenie wyszukiwanej frazy
    
            listItem.appendChild(taskContent);
    
            // Dodanie daty, jeśli została ustawiona
            if (task.date) {
                const taskDate = document.createElement('span');
                taskDate.classList.add('task-date');
                taskDate.setAttribute('data-date', task.date);  // Przechowywanie daty w atrybucie
                taskDate.textContent = ` (${new Date(task.date).toLocaleString()})`;  // Formatowanie daty
                listItem.appendChild(taskDate);
            }
    
            listItem.addEventListener('click', () => this.editTask(index));  // Ustawienie trybu edycji po kliknięciu na taskContent
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Usuń';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();  // Zapobiega aktywacji trybu edycji podczas usuwania
                this.deleteTask(index);
            });
    
            listItem.appendChild(deleteButton);
            listElement.appendChild(listItem);
        });
    }
    
    
    

    getFilteredTasks() {
        if (this.term.length < 2) {
            return this.tasks;
        }
        return this.tasks.filter(task => task.content.toLowerCase().includes(this.term.toLowerCase()));
    }

    highlightTerm(content) {
        if (!this.term || this.term.length < 2) return content;
        const regex = new RegExp(`(${this.term})`, 'gi');
        return content.replace(regex, '<span class="highlight">$1</span>');
    }
}

// Inicjalizacja listy TODO
document.addEventListener('DOMContentLoaded', () => {
    new Todo();
});
