import {ApiService} from "./ApiService.js";


function createGroupCard(group, template) {
    let groupCard = template.clone();

    groupCard.removeAttr("id");
    groupCard.removeClass("d-none");
    if (group.name) groupCard.find(".fullname").text(group.name);
    groupCard.find("#link-group").attr("href", `/community/${group.id}`)
    const api = new ApiService()


    let role = api.getRoleInGroup(group.id);
    role.then((data) => {
        if (data.body) {

            if (data.body === "Administrator") {

            } else if (data.body === "Subscriber") {

                groupCard.find(".unsubscribe").removeClass("d-none");
            }

        } else if (data.error) {

        } else {

            groupCard.find(".subscribe").removeClass("d-none")
        }

    });


    groupCard.find(".unsubscribe").click(() => {
        api.deleteUnSubscribeOnGroup(group.id);
        groupCard.find(".subscribe").removeClass("d-none");
        groupCard.find(".unsubscribe").addClass("d-none")
    })

    groupCard.find(".subscribe").click(() => {
        api.postSubscribeOnGroup(group.id);
        groupCard.find(".unsubscribe").removeClass("d-none");
        groupCard.find(".subscribe").addClass("d-none")
    })

    return groupCard;
}



function addGroupsCards(container, groups, template) {
    for (let group of groups) {
        let groupCard = createGroupCard(group, template);

        container.append(groupCard);
    }
}

export function loadGroups() {
    const apiService = new ApiService();

    let answer = apiService.getGroups();

    answer.then((data) => {
        if (data.body) {
            $("#groups").empty();
            addGroupsCards($("#groups"), data.body, $("#group-card-template"));
        }
    })
}