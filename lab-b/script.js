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
        const taskContent = listItem.querySelector('.task-content');  // Dodajemy klasę do samej treści zadania
        const originalContent = taskContent.textContent;
    
        taskContent.contentEditable = true;
        taskContent.focus();
    
        const saveChanges = () => {
            taskContent.contentEditable = false;
            const updatedContent = taskContent.textContent.trim();
            if (updatedContent.length < 3 || updatedContent.length > 255) {
                alert('Zadanie musi mieć między 3 a 255 znaków.');
                taskContent.textContent = originalContent;  // przywróć oryginalną treść
            } else {
                this.tasks[index].content = updatedContent;
                this.saveTasks();
                this.draw();
            }
            document.removeEventListener('click', outsideClickListener);
        };
    
        const outsideClickListener = (event) => {
            if (!taskContent.contains(event.target)) saveChanges();
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
            taskContent.innerHTML = this.highlightTerm(task.content);  // podświetlenie wyszukiwanej frazy
    
            listItem.appendChild(taskContent);
    
            // Dodanie daty, jeśli została ustawiona
            if (task.date) {
                const taskDate = document.createElement('span');
                taskDate.classList.add('task-date');
                taskDate.textContent = ` (${new Date(task.date).toLocaleString()})`;  // Formatowanie daty na lokalny format
                listItem.appendChild(taskDate);
            }
    
            listItem.addEventListener('click', () => this.editTask(index));  // ustawienie trybu edycji po kliknięciu na taskContent
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Usuń';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();  // zapobiega aktywacji trybu edycji podczas usuwania
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
