import {validateForm} from "./validation.js";
import {getObjectFromInputs, changePage} from "./common.js";
import {ApiService} from "./ApiService.js";



export function submitSignUpForm() {
    validateForm();

    const apiService = new ApiService();

    $("form").submit(function (event) {
        event.preventDefault();
        $(".notification").remove();

        let objectData = getObjectFromInputs();
        if (objectData) {
            let answer;

            objectData.gender = $("#gender").val();
            answer = apiService.register(objectData);


            answer.then((data) => {
                if (data.body) {
                    saveToken(data.body);
                } else {
                    addError(event.target.id);
                }
            });
        }
    });
};

function saveToken(data) {
    localStorage.setItem("token", data.token);
    changePage("/");
}

function addError(id) {
    let errorMessage = {
        "login-form": "Неверный логин или пароль",
        "signup-form": "Пользователь с таким логином уже существует"
    };

    $("form").append(`
        <p class="notification error mt-3">${errorMessage[id]}</p>
    `);
}
