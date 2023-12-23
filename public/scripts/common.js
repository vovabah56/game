
export function getObjectFromInputs() {
    let inputs = $(".form-control");
    let objectData = {};

    for (let input of inputs) {
        if ($(input).hasClass("error")) {
            return null;
        }
        let key = $(input).attr("id");
        let value = $(input).val()
        objectData[key] = value;
    }
    return objectData;
}

export function changePage(to) {
    history.pushState(null, null, to);
    location.reload();
}