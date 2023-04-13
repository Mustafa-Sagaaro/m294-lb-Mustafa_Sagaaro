 fetch('http://localhost:3000/tasks')
 .then(response => response.json())
 .then(tasks => {
   const firstTasks = tasks.slice(0, 9);
   firstTasks.forEach(task => {
     const taskCard = document.createElement('div');
     taskCard.classList.add('task-card');
     taskCard.innerHTML = `
       <h2>${task.title}</h2>
       <p>Erledigt?: ${task.completed}</p>
       <h1></h1><p>id: ${task.id}</p>`;
     document.querySelector('.task-container').appendChild(taskCard);
   });
 });

 