document.addEventListener("DOMContentLoaded", () => {
  // DOMContentLoaded means the HTML has been completely loaded and parsed
  const taskInput = document.querySelector("#task-input");
  const addTaskBtn = document.querySelector("#add-task-btn");
  const taskList = document.getElementById("task-list");
  const emptyImage = document.querySelector(".empty-img");
  const todosContainer = document.querySelector(".todos-container");

  const saveTasksToLocalStorage = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
      const text = li.querySelector("span").textContent;
      const completed = li.querySelector(".checkbox").checked;
      tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTask(task.text, task.completed));
  };

  const updateEmptyState = () => {
    if (taskList.children.length === 0) {
      emptyImage.style.display = "block";
    } else {
      emptyImage.style.display = "none";
    }
    // todosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    if (taskList.children.length > 0) {
      todosContainer.style.width = "100%";
    } else {
      todosContainer.style.width = "50%";
    }
  };

  const addTask = (text, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
      return;
    }
    const li = document.createElement("li");
    li.innerHTML = `
               <input type="checkbox" class="checkbox" ${
                 completed ? "checked" : ""
               }>
               <span>${taskText}</span>
               <div class="task-button">
                   <button class="edit-btn"><i class="fas fa-edit"></i></button>
                   <button class="delete-btn"><i class="fas fa-trash"></i></button>
               </div>
           `;
    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
      li.classList.add("completed");
      editBtn.disabled = true;
      editBtn.style.opacity = 0.5;
      editBtn.style.pointerEvents = "none";
    }
    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
      li.classList.toggle("completed", isChecked);
      editBtn.disabled = isChecked;
      editBtn.style.opacity = isChecked ? 0.5 : 1;
      editBtn.style.pointerEvents = isChecked ? "none" : "auto";
      checkAllCompletedAndCelebrate();
      saveTasksToLocalStorage();
    });

    editBtn.addEventListener("click", () => {
      if (!checkbox.checked) {
        taskInput.value = li.querySelector("span").textContent;
        li.remove();
        updateEmptyState();
        saveTasksToLocalStorage();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      li.remove();
      updateEmptyState();
      saveTasksToLocalStorage();
    });
    taskList.appendChild(li);
    taskInput.value = "";
    updateEmptyState();
    saveTasksToLocalStorage();
  };
  //   addTaskBtn.addEventListener("click", () => addTask());
  addTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
  });
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission if inside a form
      addTask();
    }
  });

  function checkAllCompletedAndCelebrate() {
    const checkboxes = taskList.querySelectorAll(".checkbox");
    if (
      checkboxes.length > 0 &&
      Array.from(checkboxes).every((cb) => cb.checked)
    ) {
      Confetti();
    }
  }
  loadTasksFromLocalStorage();
});

const Confetti = () => {
  const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
};
//  // Another confetti style
//     const defaults = {
//   spread: 360,
//   ticks: 50,
//   gravity: 0,
//   decay: 0.94,
//   startVelocity: 30,
//   shapes: ["star"],
//   colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
// };

// function shoot() {
//   confetti({
//     ...defaults,
//     particleCount: 40,
//     scalar: 1.2,
//     shapes: ["star"],
//   });

//   confetti({
//     ...defaults,
//     particleCount: 10,
//     scalar: 0.75,
//     shapes: ["circle"],
//   });
// }

// setTimeout(shoot, 0);
// setTimeout(shoot, 100);
// setTimeout(shoot, 200);
// }
