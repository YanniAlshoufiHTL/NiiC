function decrementDate() {
    date.setDate(date.getDate() - 1)
}

function incrementDate() {
    date.setDate(date.getDate() + 1)
}

function resetDate() {
    date = new Date(Date.now())
}

function showModulesArea() {
    document.querySelector('.niic-block-module-area')?.classList.remove('niic-block-module-area-hidden')
}
