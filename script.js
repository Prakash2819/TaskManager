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
editForm.addEventListener("submit", (e) => { e.preventDefault() })
form.addEventListener("submit", (event) => {
    let msg = `<i class="fa-solid fa-circle-check"></i><p>Task added successfully</p>`
    event.preventDefault();
    if (validate()) {
        setItem()
        count()
        Notify(msg)
        form.reset()
    }
})
form.addEventListener("reset", () => {
    percent.textContent = "0%"
    resetError()})

function Notify(msg) {
    let toast = document.createElement("div")
    toast.classList.add("toast")
    toast.innerHTML = msg
    notify.appendChild(toast);
    setTimeout(() => toast.remove(), 2000)
}



function count() {
    const highCount = document.querySelectorAll(".High").length
    const mediumCount = document.querySelectorAll(".Medium").length
    const lowCount = document.querySelectorAll(".Low").length
    document.querySelector("#high-count").textContent = highCount
    document.querySelector("#medium-count").textContent = mediumCount
    document.querySelector("#low-count").textContent = lowCount
    document.querySelector("#all-count").textContent = highCount + mediumCount + lowCount
}

//    
const userName = document.querySelector(".user-name")
const taskName = document.querySelector(".task-name")
var taskDescription = document.querySelector("textarea")
const dueDate = document.querySelector(".date")
const dueTime = document.querySelector(".time")
const email = document.querySelector(".email")
const priority = document.querySelector("select")
const hours = document.querySelector(".hour")
const url = document.querySelector(".url")
const userNameError = document.querySelector(".username-error")
const taskNameError = document.querySelector(".taskname-error")
const emailError = document.querySelector(".email-error")
const dateError = document.querySelector(".date-error")
const timeError = document.querySelector(".time-error")
const urlError = document.querySelector(".url-error")
const desError = document.querySelector(".description-error")
const durError = document.querySelector(".duration-error")
const selectError = document.querySelector(".select-error")
const statusError = document.querySelector(".status-error")
const typeError = document.querySelector(".type-error")

// const userPattern =/^(?:[A-Za-z.]{3,}|[A-Za-z]\s(?:[A-Za-z.]{3,}*)|[A-Za-z]{3,}(?:[A-Za-z]{3,})*)$/
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const URLPattern = /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/
const hourPattern = /^[0-9]$/


// Validation
function validate() {
    let isValid = true;
    let focusError = null
    const logo =`<i class="fa-solid fa-circle-exclamation"></i>`
    if (!userName.value.trim()) {
        userNameError.innerHTML = `${logo}<p>User name is required</p>`
        focusError ??= userName
        isValid = false
    }else if(/\d/.test(userName.value.trim())){
        userNameError.innerHTML = `${logo}<p>Characters a-z only</p>`
        focusError ??= userName
        isValid = false   
    }
    else if(!userPattern.test(userName.value)){
        userNameError.innerHTML = `${logo}<p>Invalid user name</p>`
        focusError ??= userName
        isValid = false 
    }
    if (!taskName.value.trim()) {
        taskNameError.innerHTML = `${logo}<p>Task name is required</p>`
        focusError ??= taskName
        isValid = false
    }
    else if(taskName.value.trim()){
        let name = taskName.value.trim()
        for(let i=0;i<localStorage.length;i++){
            const key = localStorage.key(i)
            const value = JSON.parse(localStorage.getItem(key))
            if(name==value.name){
            taskNameError.innerHTML =`${logo}<p>Name already exists</p>`
            focusError ??= taskName
            isValid = false    
            }
            break
        }
    }
    if (!email.value.trim()) {
        emailError.innerHTML = `${logo}<p>Assignee email is required</p>`
        focusError ??= email
        isValid = false
    }
    else if(!emailPattern.test(email.value.trim())){
        emailError.innerHTML = `${logo}<p>Invalid email</p>`
        focusError ??= email
        isValid = false
    }
    if (!dueDate.value) {
        dateError.innerHTML = `${logo}<p>Due date is required</p>`
        focusError ??= dueDate
        isValid = false
    }else{
        let today=new Date()
        let date =new Date(dueDate.value)
        if(date < today){
        dateError.innerHTML = `${logo}<p>Due date cannot be in the past</p>`;
        focusError ??= dueDate;
        isValid = false;
        }
    }
    if (!dueTime.value) {
        timeError.innerHTML = `${logo}<p>Due time is required</p>`
        focusError ??= dueTime
        isValid = false
    }
    if (!url.value.trim()) {
        urlError.innerHTML = `${logo}<p>Project URL is required</p>`
        focusError ??= url
        isValid = false
    }else if(!URLPattern.test(url.value.trim())){
        urlError.innerHTML = `${logo}<p>Invalid URL</p>`
        focusError ??= url
        isValid = false  
    }
    if (!priority.value) {
        selectError.innerHTML = `${logo}<p>Please select a priority level</p>`
        focusError ??= priority
        isValid = false
    }
    if (!hours.value) {
        durError.innerHTML = `${logo}<p>Estimated hour is required</p>`
        focusError ??= hours
        isValid = false
    }
    else if(hours.value == 0) {
        durError.innerHTML = `${logo}<p>Estimated hour must be greater than 0</p>`
        focusError ??= hours
        isValid = false
    }
    if (!taskDescription.value.trim()) {
        desError.innerHTML = `${logo}<p>Task description is required</p>`
        focusError ??= taskDescription
        isValid = false
    }
    const radio = document.querySelector(".radio:checked")
    if(!radio){
        statusError.innerHTML = `${logo}<p>Please select task status</p>`
        focusError ??= document.querySelector(".radio")
        isValid = false
    }
    const checkbox = document.querySelectorAll(".check:checked").length
    if(checkbox===0){
        typeError.innerHTML = `${logo}<p>Select at least one task type</p>`
        focusError ??= document.querySelector(".check")
        isValid = false
    }
    if (focusError) {
        focusError.focus();
        focusError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return isValid;
}
url.addEventListener("input",()=>urlError.innerText="")
userName.addEventListener("input",()=>userNameError.innerText="")
taskName.addEventListener("input",()=>taskNameError.innerText="")
email.addEventListener("input",()=>emailError.innerText="")
priority.addEventListener("change",()=>{selectError.innerText=""})
dueDate.addEventListener("change",()=>{dateError.innerText=""})
dueTime.addEventListener("change",()=>{timeError.innerText=""})
hours.addEventListener("input",()=>{
    durError.innerText=""
    if(hours.value==="") return
    if(hours.value < 0) hours.value = 0
    if(hours.value > 100){
        hours.value =100
        durError.innerHTML=`<i class="fa-solid fa-circle-exclamation"></i><p>Maximum hours reached</p>`
        setTimeout(()=>durError.innerText="",1000)
    }
})
hours.addEventListener("keydown", (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
    }})
taskDescription.addEventListener("input",()=>{desError.innerText=""})
document.querySelectorAll('.check').forEach(e=>{e.addEventListener("change",()=>typeError.innerText="")})
document.querySelectorAll('.radio').forEach(e=>{e.addEventListener("change",()=>statusError.innerText="")})

function resetError(){
    const err = document.querySelectorAll(".error")
    err.forEach(e => e.innerText="")
}

// Local Storage
function setItem() {
    const formattedDate = new Date(dueDate.value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    const status = document.querySelector(".radio:checked")?.value
    const type = {
        bugFix: document.getElementById("check1").checked,
        feature: document.getElementById("check2").checked,
        enhancement: document.getElementById("check3").checked
    }
    const task = {
        id: Date.now(),
        user: userName.value.trim(),
        name: taskName.value.trim(),
        email: email.value,
        dueDate: dueDate.value,
        date: formattedDate,
        time: dueTime.value,
        priority: priority.value,
        duration: hours.value,
        url: url.value,
        percent: slider.value,
        description: taskDescription.value.trim(),
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