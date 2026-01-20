const taskcardContainer = document.querySelector(".taskcard-container")
const form = document.querySelector("#form")
const editForm = document.querySelector(".edit-form")
const notify = document.querySelector(".notify-box")

const editRange = document.querySelector("#edit-range");
const slider = document.querySelector(".color-range");
const percent = document.querySelector(".percentage");
const editPercent = document.querySelector(".edit-percent");

slider.addEventListener("input", () => Slider(slider, percent));
editRange.addEventListener("input", () => Slider(editRange, editPercent));

function Slider(rangeEl, textEl) {
    textEl.textContent = rangeEl.value + "%";
}


document.addEventListener("DOMContentLoaded", () => {
    showItem()
    count()
})
editForm.addEventListener("submit",(e)=>{e.preventDefault()})
form.addEventListener("submit", (event) => {
    let msg =`<i class="fa-solid fa-circle-check"></i><p>Task added successfully</p>`
    event.preventDefault();
    setItem();
    count()
    Notify(msg)
})
form.addEventListener("reset",()=>percent.textContent="0%")

function Notify(msg){
    let toast = document.createElement("div")
    toast.classList.add("toast")
    toast.innerHTML = msg
    notify.appendChild(toast);
    setTimeout(()=>toast.remove(),2000)
}



function count(){
const highCount = document.querySelectorAll(".High").length
const mediumCount = document.querySelectorAll(".Medium").length
const lowCount = document.querySelectorAll(".Low").length
document.querySelector("#high-count").textContent = highCount
document.querySelector("#medium-count").textContent = mediumCount
document.querySelector("#low-count").textContent = lowCount
document.querySelector("#all-count").textContent = highCount + mediumCount + lowCount
}

// Local Storage
function setItem() {
    const userName = document.querySelector(".user-name").value.trim()
    const taskName = document.querySelector(".task-name").value.trim()
    var taskDescription = document.querySelector("textarea").value.trim()
    const dueDate = document.querySelector(".date").value
    const dueTime = document.querySelector(".time").value
    const email = document.querySelector(".email").value
    const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const priority = document.querySelector("select").value
    const hours = document.querySelector(".hour").value
    const url = document.querySelector(".url").value
    const status = document.querySelector(".radio:checked")?.value
    if (taskDescription == "") {
        taskDescription = "No Description"
    }
    const type = {
        bugFix: document.getElementById("check1").checked,
        feature: document.getElementById("check2").checked,
        enhancement: document.getElementById("check3").checked
    }
    const task = {
        id: Date.now(),
        user: userName,
        name: taskName,
        email: email,
        dueDate: dueDate,
        date: formattedDate,
        time: dueTime,
        priority: priority,
        duration: hours,
        url: url,
        percent: slider.value,
        description: taskDescription,
        status: status,
        type: type
    }
    localStorage.setItem(`${task.id}`, JSON.stringify(task))
    createTask(task);
}

function showItem() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        createTask(value);
    }
}
// Task Card Create
function createTask(value) {
    const taskcard = document.createElement("div")
    taskcard.classList.add("task-card", value.priority)
    taskcard.dataset.id = value.id
    taskcard.innerHTML = `<h4>${value.name} <i class='far fa-trash-alt'></i> <i class='far fa-edit'></i></h4><br>
        <p>${value.description}</p>
        <p></p>
        <p><img class="calender-img" src="calender.png"> Due: ${value.date}</p>
        <p><img class="contact-img" src="contact.jpg"> ${value.user}</p><br> 
        <div class="level-container">
            <label class="${value.priority.toLowerCase()}"><span>&#9679</span> ${value.priority}</label>
            <label class="${value.status.toLowerCase()}"><small>&#9679</small> ${value.status}</label>
        </div>`
    taskcardContainer.appendChild(taskcard)
}
//Update Task Card UI
function updateTaskCard(id) {
    const taskCard = document.querySelector(`.task-card[data-id="${id}"]`);
    const task = JSON.parse(localStorage.getItem(id));

    taskCard.className = `task-card ${task.priority}`;
    taskCard.innerHTML = `
        <h4>${task.name} 
            <i class='far fa-trash-alt'></i> 
            <i class='far fa-edit'></i>
        </h4><br>
        <p>${task.description}</p>
        <p><img class="calender-img" src="calender.png"> Due: ${task.date}</p>
        <p><img class="contact-img" src="contact.jpg"> ${task.user}</p><br> 
        <div class="level-container">
            <label class="${task.priority.toLowerCase()}">
                <span>&#9679</span> ${task.priority}
            </label>
            <label class="${task.status.toLowerCase()}">
                <small>&#9679</small> ${task.status}
            </label>
        </div>
    `;
}

//Delete Option
document.addEventListener("click", (event) => {
    let msg = `<i class="fa-solid fa-trash-arrow-up"></i>
    <p class="trash">Task deleted successfully</p>`
    if (event.target.classList.contains("fa-trash-alt")) {
        const taskCard = event.target.closest(".task-card")
        const id = taskCard.dataset.id
        removeItem(id)
        taskCard.remove()
        count()
        Notify(msg)
    }
})

function removeItem(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        if (value.id == id) { localStorage.removeItem(key); break }
    }
}

// Edit Box
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-edit")) {
        const taskCard = event.target.closest(".task-card")
        const id = taskCard.dataset.id
        openPopup()
        EditItem(id)
    }
})
const close = document.querySelector(".close")
close.addEventListener("click", closePopup)
document.querySelector(".cancel-btn").addEventListener("click", closePopup)
function closePopup() {
    const popupBox = document.querySelector(".popup-box")
    popupBox.style.visibility = "hidden"
}
function openPopup() {
    const popupBox = document.querySelector(".popup-box")
    popupBox.style.visibility = "visible"
}
// Popup Box Inputs 
const editUser = document.querySelector("#edit-userName")
const editName = document.querySelector("#edit-taskName")
const editEmail = document.querySelector("#edit-email")
const editDate = document.querySelector("#edit-date")
const editTime = document.querySelector("#edit-time")
const editLevel = document.querySelector(".edit-priority")
const editHour = document.querySelector("#edit-estimatedHours")
const editUrl = document.querySelector("#edit-url")
const editDescription = document.querySelector("#edit-description")
const editStatus = document.querySelectorAll(".edit-radio")

function updateItem(taskKey) {
    const TextDate = new Date(editDate.value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    const estatus = document.querySelector(".edit-radio:checked")?.value
    const type = {
        bugFix: document.getElementById("edit-check1").checked,
        feature: document.getElementById("edit-check2").checked,
        enhancement: document.getElementById("edit-check3").checked
    }
    const task = {
        id: taskKey,
        user: editUser.value.trim(),
        name: editName.value.trim(),
        email: editEmail.value,
        dueDate: editDate.value,
        date: TextDate,
        time: editTime.value,
        priority: editLevel.value,
        duration: editHour.value,
        url: editUrl.value,
        percent: editRange.value,
        description: editDescription.value.trim(),
        status: estatus,
        type: type
    }
    localStorage.setItem(`${taskKey}`, JSON.stringify(task))
}

function EditItem(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        const saveBtn = document.querySelector(".save-btn")
        if (value.id == id) {
            editUser.value = value.user
            editName.value = value.name
            editDate.value = value.dueDate
            editTime.value = value.time
            editEmail.value = value.email
            editLevel.value = value.priority
            editHour.value = value.duration
            editUrl.value = value.url
            editDescription.value = value.description
            editRange.value = value.percent
            editPercent.textContent = value.percent + "%"
            editStatus.forEach(el => el.checked = el.value === value.status)
            check(value.type)
            saveBtn.onclick = () => {
                let msg = `<i class="fa-solid fa-circle-check"></i>
                <p>Your changes have been saved</p>`
                updateItem(value.id)
                updateTaskCard(value.id)
                closePopup()
                Notify(msg)
            }
        }
    }
}
function check(obj) {
    document.getElementById("edit-check1").checked = obj.bugFix
    document.getElementById("edit-check2").checked = obj.feature
    document.getElementById("edit-check3").checked = obj.enhancement
}