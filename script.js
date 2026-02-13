const taskcardContainer = document.querySelector(".taskcard-container")
const form = document.querySelector("#form")
const editForm = document.querySelector(".edit-form")
const notify = document.querySelector(".notify-box")

const viewMoreBtn = document.querySelector('.viewmore-btn')
const subsection2 = document.querySelector(".sub-section2")
const subsection1 = document.querySelector(".sub-section1")
const subNav = document.querySelector(".sub-section2-navbar")
const main = document.querySelector(".main-section")
const closeView = document.querySelector(".close-view")
const filter = document.querySelector(".task-filters")
const emptyState = document.querySelector(".empty-state")

// Check TaskCard OverFlow
function checkOverflow() {
    const contentHeight = taskcardContainer.clientHeight;
    const visibleHeight = subsection1.clientHeight - 90;
    if (visibleHeight == -90) return;
    if (contentHeight > visibleHeight) {
        viewMoreBtn.style.display = 'block';
    } else {
        viewMoreBtn.style.display = 'none';
    }
}
// Window Resize 
function resize() {
    requestAnimationFrame(() => {
        syncHeights();
        checkOverflow();
    });
}
function syncHeights() {
    const height = subsection1.getBoundingClientRect().height;
    subsection2.style.height = `${height}px`;
}
function filterClick() {
    requestAnimationFrame(checkOverflow)
}

// Edit Box Slider
const editRange = document.querySelector("#edit-range");
const editPercent = document.querySelector(".edit-percent");
editRange.addEventListener("input", () => Slider(editRange, editPercent));
function Slider(rangeEl, textEl) {
    textEl.textContent = rangeEl.value + "%";
}
// On Window Load 
document.addEventListener("DOMContentLoaded", () => {
    showItem()
    count()
    EmptyTaskPage()
    handleNavigation()
})
window.addEventListener("resize", syncHeights)

// Navigation
function handleNavigation() {
    const section = location.hash.replace("#", "") || "dashboard";
    if (section == "tasks") tasks()
    if (section == "dashboard") dashboard()
    if (section == "profile") profile()

    document.querySelectorAll(".links a").forEach(a => a.classList.remove("active"));
    document.querySelector(`.links a[href="#${section}"]`)?.classList.add("active");
}
window.addEventListener("hashchange", handleNavigation);

//Pages
function dashboard() {
    window.addEventListener("resize", syncHeights)
    main.classList.remove("hide")
    main.classList.remove("full-width")
    document.querySelector(".search-bar").style.display = "none"
    document.querySelector(".profile-page").style.display = "none"
    subsection2.style.height = ""
    subsection2.classList.remove("expand")
    subNav.classList.remove("expand")
    emptyState.classList.remove("expand")
    taskcardContainer.classList.remove("expand")
    document.querySelector(".title-name").innerText = "Task Dashboard"
    viewMoreBtn.addEventListener("click", () => {
        window.location.hash = "tasks"
    })
    filter.addEventListener("click", filterClick)
    requestAnimationFrame(() => {
        syncHeights();
        checkOverflow();
    });
    resetSearch()
    applyFilters()
}
function tasks() {
    window.removeEventListener("resize", syncHeights)
    main.classList.remove("hide")
    main.classList.add("full-width")
    subsection2.style.height = "fit-content"
    subsection2.classList.add("expand")
    filter.removeEventListener("click", filterClick)
    viewMoreBtn.style.display = "none"
    document.querySelector(".title-name").innerText = "Tasks"
    document.querySelector(".search-bar").style.display = "block"
    document.querySelector(".profile-page").style.display = "none"
    subNav.classList.add("expand")
    taskcardContainer.classList.add("expand")
    emptyState.classList.add("expand")
}
function profile() {
    document.querySelector(".title-name").innerText = "Profile"
    main.classList.remove("full-width")
    main.classList.add("hide")
    document.querySelector("#user-count").innerText = userCount()
    document.querySelector(".search-bar").style.display = "none"
    document.querySelector(".profile-page").style.display = "flex"
    resetSearch()
    applyFilters()
}

// Form SubMission
editForm.addEventListener("submit", (e) => { e.preventDefault() })
form.addEventListener("submit", (event) => {
    let msg = `<i class="fa-solid fa-circle-check"></i><p>Task added successfully</p>`
    event.preventDefault();
    if (validate()) {
        setItem()
        count()
        applyFilters()
        checkOverflow()
        Notify(msg)
        form.reset()
        EmptyTaskPage()
    }
})
// Mobile Menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelectorAll(".links a");
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        menuToggle.checked = false
    })
})


// Reset event
form.addEventListener("reset", () => {
    resetError()
})
// Notification
function Notify(msg) {
    let toast = document.createElement("div")
    toast.classList.add("toast")
    toast.innerHTML = msg
    notify.appendChild(toast);
    setTimeout(() => toast.remove(), 2000)
}
// Task card count
function count() {
    const activePriority = document.querySelector('input[name="priority"]:checked')?.id
    const allCards = document.querySelectorAll(".task-card");
    const highCount = document.querySelectorAll(".High").length
    const mediumCount = document.querySelectorAll(".Medium").length
    const lowCount = document.querySelectorAll(".Low").length
    const total = highCount + mediumCount + lowCount
    let visibleHigh = 0, visibleMedium = 0, visibleLow = 0, visibleAll = 0;
    allCards.forEach(card => {
        if (card.style.display !== "none") {
            if (card.classList.contains("High")) visibleHigh++
            if (card.classList.contains("Medium")) visibleMedium++
            if (card.classList.contains("Low")) visibleLow++
            visibleAll++
        }
    })
    document.querySelector("#high-count").textContent = activePriority == "High" ? visibleHigh : highCount
    document.querySelector("#medium-count").textContent = activePriority == "Medium" ? visibleMedium : mediumCount
    document.querySelector("#low-count").textContent = activePriority == "Low" ? visibleLow : lowCount
    document.querySelector("#all-count").textContent = activePriority == "All" ? visibleAll : total
    document.querySelector("#task-count").textContent = total
}
// Empty Task Button
const emptyButton = document.querySelector(".empty-button")
emptyButton.addEventListener("click", () => {
    if (location.hash == "#tasks") {
        location.hash = "dashboard"
        setTimeout(() => userName.focus(), 5)
    }
    userName.focus()
})
// Empty Task Page View
function EmptyTaskPage() {
    const taskcards = document.querySelectorAll(".task-card")
    const emptyState = document.querySelector(".empty-state")
    const activetask = document.querySelector('input[name="priority"]:checked').id
    const visibleCards = Array.from(taskcards).filter(
        card => card.style.display !== "none")
    emptyState.style.display = "none"
    emptyButton.classList.add("hide")
    if (taskcards.length == 0 && activetask == "All" && activeStatus == "All") {
        emptyState.style.display = "flex"
        emptyButton.classList.remove("hide")
        document.querySelector(".empty-img").src = "no-task.png"
        document.querySelector(".empty-text1").innerText = "No Tasks Yet!"
        document.querySelector(".empty-text2").innerText = "You have no tasks. Add a new task to get started."
    }
    if (visibleCards.length == 0 && activeStatus != "All" || activetask !== "All") {
        const count = document.querySelectorAll(`.task-card.${activetask}`).length
        if (count == 0 || visibleCards.length == 0) {
            emptyState.style.display = "flex"
            document.querySelector(".empty-img").src = "no-task-match.png"
            document.querySelector(".empty-text1").innerText = "No Matching Tasks"
            document.querySelector(".empty-text2").innerText = "we couldn't find any tasks for your selected filter."
        }
    }
    if (visibleCards.length == 0 && activeStatus == "All" && activetask == "All" && taskcards.length !== 0) {
        emptyState.style.display = "flex"
        document.querySelector(".empty-img").src = "no-task-match.png"
        document.querySelector(".empty-text1").innerText = "No Matching Tasks"
        document.querySelector(".empty-text2").innerText = "we couldn't find any tasks for your selected filter."
    }
}
document.querySelectorAll('input[name="priority"]').forEach(radio => {
    radio.addEventListener("change", () => {
        EmptyTaskPage()
    });
});

// Create Task Inputs  
const userName = document.querySelector(".user-name")
const taskName = document.querySelector(".task-name")
var taskDescription = document.querySelector("textarea")
const dueDate = document.querySelector(".date")
const dueTime = document.querySelector(".time")
const email = document.querySelector(".email")
const priority = document.querySelector("select")
const hours = document.querySelector(".hour")
const url = document.querySelector(".url")
// Task Input Errors
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

const userPattern = /^(?:[A-Za-z.]{3,}|[A-Za-z](?:[A-Za-z.\s]{3,})*)$/
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
const URLPattern = /^https?:\/\/[\w.-]+(\.[\w.-]+)+([/#?].*)?$/i
const hourPattern = /^[0-9]$/
const userNameValidator = /^[A-Za-z0-9\s.]+$/
//Error Logo
const logo = `<i class="fa-solid fa-circle-exclamation"></i>`

// Validation
function validate() {
    let isValid = true;
    let focusError = null
    if (!userName.value.trim()) {
        userNameError.innerHTML = `${logo}<p>Assignee name is required</p>`
        focusError ??= userName
        isValid = false
    } else if (!userNameValidator.test(userName.value.trim())) {
        userNameError.innerHTML = `${logo}<p>Assignee name should not contain special characters</p>`
        focusError ??= userName
        isValid = false
    }
    else if (userName.value.trim().startsWith(".") || userName.value.trim().endsWith(".")) {
        userNameError.innerHTML = `${logo}<p>Assignee name should not start or end with a dot</p>`;
        focusError ??= userName;
        isValid = false;
    }
    else if (/\d/.test(userName.value.trim())) {
        userNameError.innerHTML = `${logo}<p>Characters a-z only</p>`
        focusError ??= userName
        isValid = false
    }
    else if (userName.value.trim().length < 3) {
        userNameError.innerHTML = `${logo}<p>Assignee name must be at least 3 characters long</p>`
        focusError ??= userName;
        isValid = false;
    }
    else if (!userPattern.test(userName.value)) {
        userNameError.innerHTML = `${logo}<p>Invalid Assignee name</p>`
        focusError ??= userName
        isValid = false
    }
    if (!taskName.value.trim()) {
        taskNameError.innerHTML = `${logo}<p>Task name is required</p>`
        focusError ??= taskName
        isValid = false
    }
    else if (taskName.value.trim()) {
        let name = taskName.value.trim()
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const value = JSON.parse(localStorage.getItem(key))
            if (name == value.name) {
                taskNameError.innerHTML = `${logo}<p>Task name already exists</p>`
                focusError ??= taskName
                isValid = false
            }
        }
    }
    if (!email.value.trim()) {
        emailError.innerHTML = `${logo}<p>Assignee email is required</p>`
        focusError ??= email
        isValid = false
    }
    else if (!email.value.trim().includes("@")) {
        emailError.innerHTML = `${logo}<p>Email address must include '@' and a domain</p>`
        focusError ??= email
        isValid = false
    }

    else if (!emailPattern.test(email.value.trim())) {
        emailError.innerHTML = `${logo}<p>Enter a valid email (example: name@email.com)</p>`
        focusError ??= email
        isValid = false
    }
    if (!dueDate.value) {
        dateError.innerHTML = `${logo}<p>Due date is required</p>`
        focusError ??= dueDate
        isValid = false
    }
    if (!dueTime.value) {
        timeError.innerHTML = `${logo}<p>Due time is required</p>`
        focusError ??= dueTime
        isValid = false
    }
    else if (dueDate.value === getToday()) {
        const time = getCurrentTime()
        if (dueTime.value < time) {
            timeError.innerHTML = `${logo}<p>You cannot select a past time</p>`
            focusError ??= dueTime
            isValid = false
        }
    }
    if (!url.value.trim()) {
        urlError.innerHTML = `${logo}<p>Project URL is required</p>`
        focusError ??= url
        isValid = false
    }
    else if (!/^https?:\/\//i.test(url.value.trim())) {
        urlError.innerHTML = `${logo}<p>Please include http:// or https:// in the URL</p>`;
        focusError ??= url;
        isValid = false;
    }
    else if (!URLPattern.test(url.value.trim())) {
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
        durError.innerHTML = `${logo}<p>Please enter the estimated hours</p>`
        focusError ??= hours
        isValid = false
    }
    else if (hours.value == 0) {
        durError.innerHTML = `${logo}<p>Hours must be more than 0</p>`
        focusError ??= hours
        isValid = false
    }
    if (!taskDescription.value.trim()) {
        desError.innerHTML = `${logo}<p>Please add a task description</p>`
        focusError ??= taskDescription
        isValid = false
    }
    const radio = document.querySelector(".radio:checked")
    if (!radio) {
        statusError.innerHTML = `${logo}<p>Please choose a task status</p>`
        focusError ??= document.querySelector(".radio")
        isValid = false
    }
    const checkbox = document.querySelectorAll(".check:checked").length
    if (checkbox === 0) {
        typeError.innerHTML = `${logo}<p>Please select at least one task type</p>`
        focusError ??= document.querySelector(".check")
        isValid = false
    }
    if (focusError) {
        focusError.focus()
        focusError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    return isValid;
}
// Clearing error on input
url.addEventListener("input", () => urlError.innerText = "")
userName.addEventListener("input", () => userNameError.innerText = "")
taskName.addEventListener("input", () => taskNameError.innerText = "")
email.addEventListener("input", () => emailError.innerText = "")
priority.addEventListener("change", () => { selectError.innerText = "" })
dueDate.addEventListener("change", () => { dateError.innerText = "" })
dueTime.addEventListener("change", () => { timeError.innerText = "" })
hours.addEventListener("input", () => {
    durError.innerText = ""
    if (hours.value === "") return
    if (hours.value < 0) hours.value = 0
    if (hours.value > 150) {
        hours.value = 150
        durError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><p>Maximum hours reached</p>`
        setTimeout(() => durError.innerText = "", 1000)
    }
})
hours.addEventListener("keydown", (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
    }
})
taskDescription.addEventListener("input", () => { desError.innerText = "" })
document.querySelectorAll('.check').forEach(e => { e.addEventListener("change", () => typeError.innerText = "") })
document.querySelectorAll('.radio').forEach(e => { e.addEventListener("change", () => statusError.innerText = "") })
// Reset Error
function resetError() {
    const err = document.querySelectorAll(".error")
    err.forEach(e => e.innerText = "")
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
        percent: 0,
        description: taskDescription.value.trim(),
        status: status,
        type: type
    }
    localStorage.setItem(`${task.id}`, JSON.stringify(task))
    createTask(task);
}
// Retrieve object from storage 
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
    let status;
    if (value.status == "In Progress") {
        status = value.status.split(" ")[1]
    }
    else { status = value.status }
    taskcard.classList.add("task-card", value.priority, status)
    taskcard.dataset.id = value.id
    taskcard.innerHTML = `<div class="taskcard-header"><h4>${value.name} </h4><div><i class='far fa-trash-alt'></i> <i class='far fa-edit'></i></div></div>
        <p class="task-desc">${value.description}</p>
        <p></p>
        <p><img class="calender-img" src="calender.png"> Due: ${value.date}</p>
        <p><img class="contact-img" src="contact.jpg"> ${value.user}</p><br> 
        <div class="level-container">
            <label class="${value.priority.toLowerCase()}"><span>&#9679</span> ${value.priority}</label>
            <label class="${value.status.toLowerCase()}"><small>&#9679</small> ${value.status}</label>
        </div>`
    taskcardContainer.prepend(taskcard)
}


// Edit Popup Box
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
//close
function closePopup() {
    const popupBox = document.querySelector(".popup-box")
    popupBox.style.visibility = "hidden"
    overlay.style.display = "none"
    resetError()
}
//open
function openPopup() {
    const popupBox = document.querySelector(".popup-box")
    popupBox.style.visibility = "visible"
    popupBox.style.animation = "fadeIn 0.5s"
    overlay.style.display = "block"
    overlay.addEventListener("click", () => {
        popupBox.style.animation = "none"
        popupBox.style.visibility = "hidden"
        overlay.style.display = "none"
    })
}

// Edit Box Inputs 
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
// Edit Box Errors
const editUserError = document.querySelector(".editUser-error")
const editTaskError = document.querySelector(".editTask-error")
const editEmailError = document.querySelector(".editEmail-error")
const editDateError = document.querySelector(".editDate-error")
const editTimeError = document.querySelector(".editTime-error")
const editHourError = document.querySelector(".editHour-error")
const editUrlError = document.querySelector(".editURL-error")
const editDesError = document.querySelector(".editDesc-error")
const editTypeError = document.querySelector(".editType-error")

// Store input values from storage to edit box
function storeValue(value){
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
}
function check(obj) {
    document.getElementById("edit-check1").checked = obj.bugFix
    document.getElementById("edit-check2").checked = obj.feature
    document.getElementById("edit-check3").checked = obj.enhancement
}
function EditItem(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        const saveBtn = document.querySelector(".save-btn")
        if (value.id == id) {
            storeValue(value)
            // Save Button
            saveBtn.onclick = () => {
                if (editValidate(value.id, value.time)) {
                    let msg = `<i class="fa-solid fa-circle-check"></i>
                <p>Your changes have been saved</p>`
                    updateItem(value.id)
                    updateTaskCard(value.id)
                    count()
                    applyFilters()
                    checkOverflow()
                    EmptyTaskPage()
                    closePopup()
                    Notify(msg)
                }
            }
        }
    }
}

// Edit Box Validation
function editValidate(currentId, time) {
    let isValid = true
    let focusError = null
    let isTimeChanged = editTime.value !== time

    if (!editUser.value.trim()) {
        editUserError.innerHTML = `${logo}<p>User name is required</p>`
        focusError ??= editUser
        isValid = false
    } else if (!userNameValidator.test(editUser.value.trim())) {
        editUserError.innerHTML = `${logo}<p>User name should not contain special characters</p>`
        focusError ??= editUser
        isValid = false
    }
    else if (editUser.value.trim().startsWith(".") || editUser.value.trim().endsWith(".")) {
        editUserError.innerHTML = `${logo}<p>User name should not start or end with a dot</p>`;
        focusError ??= editUser;
        isValid = false;
    }
    else if (/\d/.test(editUser.value.trim())) {
        editUserError.innerHTML = `${logo}<p>Characters a-z only</p>`
        focusError ??= editUser
        isValid = false
    }
    else if (editUser.value.trim().length < 3) {
        editUserError.innerHTML = `${logo}<p>User name must be at least 3 characters long</p>`
        focusError ??= editUser
        isValid = false
    }
    else if (!userPattern.test(editUser.value)) {
        editUserError.innerHTML = `${logo}<p>Invalid user name</p>`
        focusError ??= editUser
        isValid = false
    }
    if (!editName.value.trim()) {
        editTaskError.innerHTML = `${logo}<p>Task name is required</p>`
        focusError ??= editName
        isValid = false
    }
    else if (editName.value.trim()) {
        let name = editName.value.trim()
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const value = JSON.parse(localStorage.getItem(key))
            if (name == value.name && value.id !== currentId) {
                editTaskError.innerHTML = `${logo}<p>Task name already exists</p>`
                focusError ??= editName
                isValid = false
            }
        }
    }
    if (!editEmail.value.trim()) {
        editEmailError.innerHTML = `${logo}<p>Assignee email is required</p>`
        focusError ??= editEmail
        isValid = false
    }
    else if (!editEmail.value.trim().includes("@")) {
        editEmailError.innerHTML = `${logo}<p>Email address must include '@' and a domain</p>`
        focusError ??= editEmail
        isValid = false
    }
    else if (!emailPattern.test(editEmail.value.trim())) {
        editEmailError.innerHTML = `${logo}<p>Enter a valid email (example: name@email.com)</p>`
        focusError ??= editEmail
        isValid = false
    }
    if (!editDate.value) {
        editDateError.innerHTML = `${logo}<p>Due date is required</p>`
        focusError ??= editDate
        isValid = false
    }
    if (isTimeChanged) {
        if (!editTime.value) {
            editTimeError.innerHTML = `${logo}<p>Due time is required</p>`
            focusError ??= editTime
            isValid = false
        }
        else if (editDate.value === getToday()) {
            const time = getCurrentTime()
            if (editTime.value < time) {
                editTimeError.innerHTML = `${logo}<p>You cannot select a past time</p>`
                focusError ??= editTime
                isValid = false
            }
        }
    }
    if (!editHour.value) {
        editHourError.innerHTML = `${logo}<p>Please enter the estimated hours</p>`
        focusError ??= editHour
        isValid = false
    }
    else if (editHour.value == 0) {
        editHourError.innerHTML = `${logo}<p>Hours must be more than 0</p>`
        focusError ??= editHour
        isValid = false
    }
    if (!editUrl.value.trim()) {
        editUrlError.innerHTML = `${logo}<p>Project URL is required</p>`
        focusError ??= editUrl
        isValid = false
    }
    else if (!/^https?:\/\//i.test(editUrl.value.trim())) {
        editUrlError.innerHTML = `${logo}<p>Please include http:// or https:// in the URL</p>`;
        focusError ??= editUrl;
        isValid = false;
    }
    else if (!URLPattern.test(editUrl.value.trim())) {
        editUrlError.innerHTML = `${logo}<p>Invalid URL</p>`
        focusError ??= editUrl
        isValid = false
    }
    if (!editDescription.value.trim()) {
        editDesError.innerHTML = `${logo}<p>Task description is required</p>`
        focusError ??= editDescription
        isValid = false
    }
    const checkbox = document.querySelectorAll(".edit-check:checked").length
    if (checkbox === 0) {
        editTypeError.innerHTML = `${logo}<p>Select at least one task type</p>`
        focusError ??= document.querySelector(".edit-check")
        isValid = false
    }

    if (focusError) {
        focusError.focus();
        focusError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    clearError(editUser)
    clearError(editName)
    clearError(editEmail)
    clearError(editDescription)
    clearError(editUrl)
    return isValid
}

// Edit Box Error Clearing
function clearError(e) {
    const error = e.nextElementSibling
    e.addEventListener("input", () => { error.innerText = "" })
}
editDate.addEventListener("change", () => { editDateError.innerText = "" })
editTime.addEventListener("change", () => { editTimeError.innerText = "" })
editHour.addEventListener("input", () => {
    editHourError.innerText = ""
    if (editHour.value === "") return
    if (editHour.value < 0) editHour.value = 0
    if (editHour.value > 150) {
        editHour.value = 150
        editHourError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i><p>Maximum hours reached</p>`
        setTimeout(() => editHourError.innerText = "", 1000)
    }
})
document.querySelectorAll('.edit-check').forEach(e => { e.addEventListener("change", () => editTypeError.innerText = "") })

// Storing New Edited Value 
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

//Update Task Card UI
function updateTaskCard(id) {
    const taskCard = document.querySelector(`.task-card[data-id="${id}"]`);
    const task = JSON.parse(localStorage.getItem(id));
    let status;
    if (task.status == "In Progress") {
        status = task.status.split(" ")[1]
    }
    else { status = task.status }
    taskCard.className = `task-card ${task.priority} ${status}`;
    taskCard.innerHTML = `
        <div class="taskcard-header"><h4>${task.name} </h4><div>
        <i class='far fa-trash-alt'></i> <i class='far fa-edit'></i></div>
        </div>
        <p class="task-desc">${task.description}</p>
        <p></p>
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


// Task Card Info View 
function taskcardView(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        if (id == value.id) {
            document.querySelector(".modal-taskName").innerText = value.name
            document.querySelector(".modal-description").innerText = value.description
            document.querySelector(".modal-progress").value = value.percent
            document.querySelector(".modal-percent").innerText = `${value.percent}%`
            document.querySelector(".modal-userEmail").innerHTML = `<p>${value.user}<br><span>${value.email}</span></p>`
            document.querySelector(".modal-date").innerText = `📆 ${value.date}`
            document.querySelector(".modal-hours").innerText = `${value.duration} hours`
            document.querySelector(".modal-url").href = value.url
            document.querySelector(".modal-time").innerText = toAmPm(value.time)
            function toAmPm(time24) {
                if (!time24) return "";

                let [h, m] = time24.split(":");
                h = Number(h);

                const ampm = h >= 12 ? "PM" : "AM";
                h = h % 12 || 12;

                return `${h}:${m} ${ampm}`;
            }
            let dot = `<span>&#9679;</span> `
            const badge = document.querySelector(".modal-status")
            const modalLevel = document.querySelector(".modal-level")
            // reset all status colors first
            badge.classList.remove("orange", "green", "blue")
            modalLevel.classList.remove("red", "green", "orange")
            // Status
            if (value.status == "Pending") {
                badge.classList.add("orange")
                badge.innerHTML = `${dot} Pending`
            }
            if (value.status == "In Progress") {
                badge.classList.add("blue")
                badge.innerHTML = `${dot} In Progress`
            }
            if (value.status == "Completed") {
                badge.classList.add("green")
                badge.innerHTML = `${dot} Completed`
            }
            // Priority level
            if (value.priority == "High") {
                modalLevel.classList.add("red")
                modalLevel.innerHTML = `${dot} High`
            }
            if (value.priority == "Medium") {
                modalLevel.classList.add("orange")
                modalLevel.innerHTML = `${dot} Medium`
            }
            if (value.priority == "Low") {
                modalLevel.classList.add("green")
                modalLevel.innerHTML = `${dot} Low`
            }
            // Task Types 
            const types = value.type
            const modalTaskTypes = document.querySelector(".modal-taskTypes")
            modalTaskTypes.innerHTML = ""
            if (types.bugFix) { modalTaskTypes.innerHTML += `<p><i class="fa-solid fa-circle-check"></i> Bug fix</p>` }
            if (types.feature) { modalTaskTypes.innerHTML += `<p><i class="fa-solid fa-circle-check"></i> Feature</p>` }
            if (types.enhancement) { modalTaskTypes.innerHTML += `<p><i class="fa-solid fa-circle-check"></i> Enhancement</p>` }
        }
    }
}
// Task Info Box
const taskModal = document.querySelector(".task-modal")
const overlay = document.querySelector(".task-overlay")
//close
document.querySelector(".close-btn").addEventListener("click", () => {
    taskModal.style.display = "none"
    overlay.style.display = "none"
})
//open
document.addEventListener("click", (event) => {
    if (event.target.closest(".fa-edit, .fa-trash-alt")) {
        return
    }
    const taskCard = event.target.closest(".task-card")
    if (!taskCard) return
    const id = taskCard.dataset.id
    taskcardView(id)
    taskModal.style.display = "block"
    overlay.style.display = "block"
    overlay.addEventListener("click", () => {
        taskModal.style.display = "none"
        overlay.style.display = "none"
    })
})

// Delete Option

let taskCard = null
let id = null
let taskname = null

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-trash-alt")) {
        taskCard = event.target.closest(".task-card")
        taskname = taskCard.querySelector(".taskcard-header").innerText
        document.querySelector("#delete-task-name").innerText = taskname
        id = taskCard.dataset.id

        document.querySelector(".confirm-box").style.display = "flex";
        overlay.style.display = "block";
        overlay.addEventListener("click", () => {
            id = null
            taskCard = null
            document.querySelector(".confirm-box").style.display = "none";
            overlay.style.display = "none";
        })
    }
})
document.querySelector(".confirm").addEventListener("click", () => {
    let msg = `<i class="fa-solid fa-trash-arrow-up"></i>
    <p class="trash">Task deleted successfully</p>`
    removeItem(id)
    taskCard.remove()
    count()
    checkOverflow()
    Notify(msg)
    EmptyTaskPage()
    id = null
    taskCard = null
    document.querySelector(".confirm-box").style.display = "none";
    overlay.style.display = "none";
})
document.querySelector(".cancel").addEventListener("click", () => {
    id = null
    taskCard = null
    document.querySelector(".confirm-box").style.display = "none";
    overlay.style.display = "none";
})

// Remove object on storage
function removeItem(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        if (value.id == id) { localStorage.removeItem(key); break }
    }
}

// Estimated Hours prevent key actions
editHour.addEventListener("keydown", (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
    }
})
// Disable Past Date and Time 
function getToday() {
    return new Date().toISOString().split("T")[0]
}
function getCurrentTime() {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, "0")
    const m = String(now.getMinutes()).padStart(2, "0")
    return `${h}:${m}`
}

function dateTime(date) {
    date.min = getToday();
    if (date.value && date.value < date.min) {
        date.value = "";
        time.value = "";
    }
}
dateTime(dueDate)
dateTime(editDate)

// footer
const footer = document.querySelector("footer")
footer.addEventListener("click", (e) => {
    e.preventDefault()
})

// Copyright Year
document.querySelector(".copyright-year").innerText = new Date().getFullYear()

// Custom filter Function
const optionMenu = document.querySelector(".sub-section2-title");
const selectBtn = optionMenu.querySelector(".select-btn");
const options = optionMenu.querySelectorAll(".option");
const sBtn_text = optionMenu.querySelector(".sbtn-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption = option.querySelector(".option-text").innerText
        let icon;
        const iconClass = option.dataset.icon
        icon = `<i class="${iconClass}"></i>`
        if (iconClass == "") icon = `<span>&#9989;</span>`
        sBtn_text.innerHTML = `${icon} ${selectedOption}`
        optionMenu.classList.remove("active");
    });
});

// Filtering
let activePriority = "All";
let activeStatus = "All";
let activeSearch = "";

function applyFilters() {
    document.querySelectorAll(".task-card").forEach(card => {
        const matchPriority =
            activePriority === "All" ||
            card.classList.contains(activePriority);

        const matchStatus =
            activeStatus === "All" ||
            card.classList.contains(activeStatus);

        const matchSearch =
            activeSearch === "" ||
            card.innerText.toLowerCase().includes(activeSearch);

        if (matchPriority && matchStatus && matchSearch) {
            card.style.display = "flex"
        } else card.style.display = "none"
    })
    count()
    EmptyTaskPage();
    checkOverflow();
}

// Priority
document.querySelectorAll('input[name="priority"]').forEach(radio => {
    radio.addEventListener("change", e => {
        activePriority = e.target.id;
        applyFilters();
    });
});

// Status
document.addEventListener("change", e => {
    if (!e.target.matches('input[name="status-filter"]')) return;
    activeStatus = e.target.value;
    applyFilters();
});
// Search box
const searchInput = document.querySelector(".search-bar")

searchInput.addEventListener("input", () => {
    activeSearch = searchInput.value.toLowerCase().trim();
    applyFilters();
});

function resetSearch() {
    searchInput.value = ""
    activeSearch = ""
    applyFilters()
}
// User count
function userCount() {
    const unique = new Set()
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        const value = JSON.parse(localStorage.getItem(key))
        unique.add(value.user.trim().toLowerCase())
    }
    return unique.size
}
