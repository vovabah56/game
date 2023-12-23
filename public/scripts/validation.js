export function validateForm() {
    $.validator.addMethod('dateLessCurrent', function(date) {
        return new Date(date) < new Date();
    }, 'Введите корректную дату');

    $.validator.addMethod('correct', function(name) {
        return name.match(/[a-zA-Z0-9]+/);
    }, 'Разрешено вводить только латинские символы');

    $("form").validate({
        rules: {
            fullName: {
                required: true,
                correct: true,
            },
            signupPassword: {
                required: true,
                minlength: 6
            },
            loginPassword: "required",
            email: {
                required: true,
                email: true
            },
            phoneNumber: {
                required: true,
            },
            name: "required",
            birthDate: {
                required: true,
                dateLessCurrent: true
            },
            reviewText: "required",
        },
        messages: {
            fullName: {
                required: "Введите имя",
            },
            signupPassword: {
                required: "Введите пароль",
                minlength: "Минимальная длина пароля - 6 символов"
            },
            loginPassword: "Введите пароль",

            email: {
                required: "Введите email",
                email: "Введите корректный email"
            },
            birthDate: {
                required: "Введите дату рождения",
            },
            phoneNumber:{
                required: "Введите номер телефона"
            },
            reviewText: "Введите текст отзыва",
        }
    });
}
