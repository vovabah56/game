import {ApiService} from "./ApiService.js";
import {getObjectFromInputs} from "./common.js";



function getGuidAddress(){
    let guid = null;

    for (let i = 0; i < 5; i++ ){
        var infoValue = $(`#level-${i}`).val()
        var foundElement = $('[value="' + infoValue + '"]');

        var d = JSON.stringify(foundElement.data("value"));


        if(d !== undefined){
            d = JSON.parse(d)
            console.log(d.objectGuid)
            guid =d.objectGuid
        }

    }
    return guid



}


export function submitCreatePostForm() {
    addressSubmit()

    const apiService = new ApiService();
    let answerTags = apiService.GetTags();
    answerTags.then((data) => {
        if (data.body) {
            addTags(data.body);
        }
    });




    $("form").submit(function (event) {
        event.preventDefault();
        let objectData = getObjectFromInputs();
        objectData["addressId"] = getGuidAddress()



        let answer = apiService.postCreatePost(objectData)
        answer.then((data) => {
            if (data.body) {

            }
            else {
                console.log(data.error)
            }
        });


    });
}
function addTags(tags){
    let selector = $("#tags");


    for (let tag of tags){
        var newOption = $("<option>").val(tag.id).text(tag.name);
        selector.append(newOption);

    }
}
function  addressSubmit() {
    $('.select2').select2();


    const InputSubject = document.getElementById('level-0');
    const divAddress = document.getElementById('address');

    let token;
    let level = 0;
    let objectGuid = '';

    const urlSearchAddress = 'https://blog.kreosoft.space/api/address/search?parentObjectId=';

    function makeSelect() {
        level += 1;
        const divElement = document.createElement('div');
        divElement.classList.add('form-group', 'mt-3');
        divElement.id = `divLevel-${level}`;


// Создание элемента label
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', divElement.id);
        labelElement.textContent = 'Следующий элемент';

// Создание элемента select
        const selectElement = document.createElement('select');
        selectElement.classList.add('select2', 'form-control');
        selectElement.id = `level-${level}`;//zapro


// Создание элемента option
        const optionElement = document.createElement('option');
        optionElement.value = '0';

// Добавление option в select
        selectElement.appendChild(optionElement);

// Добавление label и select в div
        divElement.appendChild(labelElement);
        divElement.appendChild(selectElement);
        $(selectElement).select2();

        return divElement;
    }


    function handleInputChange(select, div, line) {

        $(`#level-${line}`).on('select2:open', function () {
            let inputValue = $(this).data('select2').$dropdown.find('.select2-search__field');
            let parentValue = $('#level-' + (line - 1)).val();
            inputValue.off('input').on('input', function () {


                console.log('Введенные данные улицы:', $(this).val(), parentValue);
                getAddress(parentValue, $(`#level-${line}`).get(0), $(this).val())
            });
        });


        $(`#level-${line}`).change(function () {
            let optionData = JSON.parse(select.options[select.selectedIndex].getAttribute("data-value"));
            console.log(div.id);
            const divsToRemove = divAddress.querySelectorAll('div');

            divsToRemove.forEach(divElement => {
                const divId = divElement.id;
                const idNumber = parseInt(divId.match(/\d+/)[0]); // Извлекаем число из id
                const currentLevel = parseInt(div.id.match(/\d+/)[0]);
                if (idNumber > currentLevel) {
                    divAddress.removeChild(divElement);
                    level = currentLevel;
                }
            })

            if (select.value !== 0) {
                const optionToRemove = select.querySelector("option[value='0']");
                if (optionToRemove) {
                    optionToRemove.remove();
                }
                console.log(1, optionData.objectLevelText);

                div.querySelector('label').textContent = optionData.objectLevelText;
                div.querySelector('label').setAttribute("for", optionData.objectLevelText);
            }
            if (optionData.objectLevel !== "Building") {
                objectGuid = '';
                inputAddress(optionData.objectId);
            } else {
                objectGuid = optionData.objectGuid;
            }
        });


    }

    function inputAddress(InputValue) {
        let div = makeSelect();
        let select = div.querySelector('select');
        console.log(select.id);

        divAddress.appendChild(div);
        getAddress(InputValue, select);
        handleInputChange(select, div, level);

    }


    $("#level-0").change(function () {
        let InputSubjectValue = InputSubject.value;
        console.log("Выбранное значение: " + InputSubjectValue);
        if (InputSubject.value !== 0) {
            InputSubject.querySelector('option').remove();

            inputAddress(InputSubjectValue);
        }

    });

    async function getAddress(parentObjectId, select, name) {
        try {
            let url = urlSearchAddress + parentObjectId;
            if (name) {
                url = url + "&query=" + name;
                console.log(url);
                while (select.options.length > 0) {
                    select.remove(0);
                }
            }
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                const option = document.createElement("option");
                option.value = data[i].objectId;
                option.text = data[i].text;
                option.setAttribute("data-value", JSON.stringify(data[i]));
                select.appendChild(option);

            }
        } catch (error) {
            console.log(error);
        }
    }


}