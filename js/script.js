document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // 2. Academic Planner Functionality
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const courseSelect = document.getElementById("courseSelect");
  const taskList = document.getElementById("taskList");
  const plannerError = document.getElementById("plannerError");
  const totalCount = document.getElementById("totalCount");
  const completedCount = document.getElementById("completedCount");
  const pendingCount = document.getElementById("pendingCount");

  if (taskForm && taskList) {
    // Load saved tasks or initialize with default COS 106 coursework
    let tasks = JSON.parse(localStorage.getItem("mivaTasks")) || [
      { id: 1, text: "Complete COS 106 Term Project Website", course: "COS 106", completed: false },
      { id: 2, text: "Push source code to GitHub repository", course: "COS 106", completed: false }
    ];

    function saveAndRenderTasks() {
      localStorage.setItem("mivaTasks", JSON.stringify(tasks));
      renderTasks();
    }

    function renderTasks() {
      taskList.innerHTML = "";

      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
          <span class="task-text"><strong>[${task.course}]</strong> ${task.text}</span>
          <div class="task-actions">
            <button type="button" class="btn-small btn-complete" data-id="${task.id}">
              ${task.completed ? "Undo" : "Complete"}
            </button>
            <button type="button" class="btn-small btn-delete" data-id="${task.id}">
              Delete
            </button>
          </div>
        `;

        taskList.appendChild(li);
      });

      // Update counters
      const completed = tasks.filter((t) => t.completed).length;
      totalCount.textContent = tasks.length;
      completedCount.textContent = completed;
      pendingCount.textContent = tasks.length - completed;
    }

    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = taskInput.value.trim();

      if (!text) {
        plannerError.textContent = "Please enter an academic task before adding.";
        return;
      }

      plannerError.textContent = "";
      tasks.push({
        id: Date.now(),
        text: text,
        course: courseSelect.value,
        completed: false
      });

      taskInput.value = "";
      saveAndRenderTasks();
    });

    taskList.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      if (!id) return;

      if (e.target.classList.contains("btn-complete")) {
        tasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveAndRenderTasks();
      }

      if (e.target.classList.contains("btn-delete")) {
        tasks = tasks.filter((task) => task.id !== id);
        saveAndRenderTasks();
      }
    });

    renderTasks();
  }

  // 3. Contact Form Validation
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const phoneError = document.getElementById("phoneError");
      const messageError = document.getElementById("messageError");
      const formSuccess = document.getElementById("formSuccess");

      // Reset messages
      nameError.textContent = "";
      emailError.textContent = "";
      phoneError.textContent = "";
      messageError.textContent = "";
      formSuccess.hidden = true;

      let isValid = true;

      // Validate Name
      if (fullName === "") {
        nameError.textContent = "Name is required.";
        isValid = false;
      }

      // Validate Email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email === "") {
        emailError.textContent = "Email address is required.";
        isValid = false;
      } else if (!emailPattern.test(email)) {
        emailError.textContent = "Please enter a valid email address.";
        isValid = false;
      }

      // Validate Phone (Digits only)
      const digitsOnlyPattern = /^\d+$/;
      if (phone === "") {
        phoneError.textContent = "Phone number is required.";
        isValid = false;
      } else if (!digitsOnlyPattern.test(phone)) {
        phoneError.textContent = "Phone number must contain only digits (0-9).";
        isValid = false;
      }

      // Validate Message
      if (message === "") {
        messageError.textContent = "Message cannot be empty.";
        isValid = false;
      }

      if (isValid) {
        formSuccess.textContent = `Thank you, ${fullName}! Your message has been validated and sent to Emmanuel Samuel Edem.`;
        formSuccess.hidden = false;
        contactForm.reset();
      }
    });
  }
});
