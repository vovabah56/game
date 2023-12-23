import {ApiService} from "./ApiService.js";
import {changePage, getObjectFromInputs} from "./common.js";
import {validateForm} from "./validation.js";


function addInfoProfile(body) {
    if(body.gender.toString() === "Male"){
        $("#user-avatar").attr("src", "public/images/man.jpg")
    }
    else{
        $("#user-avatar").attr("src", "public/images/womann.jpg")
    }

    let profileDetails = $("#profile-form");
    profileDetails.find("#fullName").val(body.fullName);
    profileDetails.find("#email").val(body.email);
    const apiDate = new Date(body.birthDate);

// Получение только даты в формате "YYYY-MM-DD"
    const formattedDate = apiDate.toISOString().split('T')[0];
    profileDetails.find("#birthDate").val(formattedDate);
    profileDetails.find("#gender").val(body.gender);
    profileDetails.find("#phoneNumber").val(body.phoneNumber);
}

export function loadProfile(){
    const apiService = new ApiService();

    $('#phoneNumber').inputmask({ mask: '+7 (999) 999-99-99' });

    let answer = apiService.getProfileInfo();

    answer.then((data) => {
        if(data.body){
            addInfoProfile(data.body);
        }
    })

}


export function registerEditProfileEvent() {
    $("#editBtn").click(function() {
        enableFields($("#profile-form"));
        $(this).addClass("d-none");
        $("#saveBtn").removeClass("d-none");
    });
}

export function registerSaveProfileEvent() {
    validateForm();

    $("#profile-form").submit(function (event) {
        event.preventDefault();

        const apiService = new ApiService();
        let objectData = getObjectFromInputs();

        if (objectData) {

            objectData.gender = $("#gender").val();
            console.log(objectData)
            let answer = apiService.putEditProfile(objectData);
            answer.then((data) => {
                if (data.body) {
                    disableFields($(this));
                    $("#saveBtn").addClass("d-none");
                    $("#editBtn").removeClass("d-none");
                    loadProfile();
                } else if (data.error) {

                }
            });
        }
    });
};

function enableFields(form) {
    form.find("#email").removeAttr("readonly");
    form.find("#phoneNumber").removeAttr("readonly");
    form.find("#avatarLink").removeAttr("readonly");
    form.find("#fullName").removeAttr("readonly");
    form.find("#birthDate").removeAttr("readonly");
    form.find("#gender").removeAttr("disabled");
}

function disableFields(form) {
    form.find("#email").attr("readonly", "readonly");
    form.find("#avatarLink").attr("readonly", "readonly");
    form.find("#fullName").attr("readonly", "readonly");
    form.find("#birthDate").attr("readonly", "readonly");
    form.find("#gender").attr("disabled", "readonly");
    form.find("#phoneNumber").attr("readonly", "readonly");
}