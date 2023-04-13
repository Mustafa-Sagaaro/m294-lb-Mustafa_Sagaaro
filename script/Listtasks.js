function searchTasks() {
  const searchValue = document.getElementById('search').value;

  fetch('http://localhost:3000/tasks')
    .then((response) => response.json())
    .then((tasks) => {
      const filteredTasks = tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(suche.toLowerCase()) ||
          task.id.toString().includes(suche)
        );
      });

      Taskanzeigen(filteredTasks);
    });
}

function Taskanzeigen(tasks) {
  const taskContainer = document.querySelector('.taskcontainer');
  taskContainer.innerHTML = '';

  tasks.forEach((task) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('taskcard');
    taskCard.innerHTML = `
      <h2>${task.title}</h2>
      <p>Erledigt?: ${task.completed}</p>
      <h1></h1><p>id: ${task.id}</p>`;
    taskContainer.appendChild(taskCard);
  });
}

fetch('http://localhost:3000/tasks')
  .then((response) => response.json())
  .then((tasks) => {
    const firstTasks = tasks.slice(0, 9);
    Taskanzeigen(firstTasks);
  });
