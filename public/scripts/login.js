import { validateForm } from "./validation.js";
import { getObjectFromInputs, changePage } from "./common.js";
import { ApiService } from "./ApiService.js";


export function submitAuthorizationForm() {
    validateForm();

    const apiService = new ApiService();
    let c
    $("form").submit(function (event) {
        event.preventDefault();
        $(".notification").remove();

        let objectData = getObjectFromInputs();
        if (objectData) {
            let answer;

            switch (event.target.id) {
                case ("login-form"):
                    answer = apiService.login(objectData);
                    break;
                case ("signup-form"):
                    delete objectData.confirm_password;
                    objectData.gender = parseInt($("#gender").val());
                    answer = apiService.register(objectData);
                    break;
            }

            answer.then((data) => {
                if (data.body) {
                    saveToken(data.body);
                } else {
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
