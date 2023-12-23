import {ApiService} from "./ApiService.js";

export function loadAuthors() {
    const apiService = new ApiService();

    let answer = apiService.getAuthors();


    answer.then((data) => {
        if (data.body) {
            $("#authors").empty();
            addAuthorsCards($("#authors"), data.body, $("#author-card-template"));
        }
    })
}

function createBasicAuthorCard(author, template) {
    let authorCard = template.clone();

    authorCard.removeAttr("id");
    authorCard.removeClass("d-none");
    if (author.fullName) authorCard.find(".fullname").text(author.fullName);
    if (author.created) authorCard.find(".created").text(moment(new Date(author.created)).format('DD.MM.YYYY HH:mm'));
    if (author.birthDate) authorCard.find(".birth-date").text(moment(new Date(author.birthDate)).format('DD.MM.YYYY'));
    if (author.posts) authorCard.find(".post-value").text(author.posts);
    if (author.likes) authorCard.find(".like-value").text(author.likes);
    if (author.gender.toString() === "Male") {
        authorCard.find(".author-avatar").attr("src", "/public/images/man.jpg");
    } else {
        authorCard.find(".author-avatar").attr("src", "/public/images/womann.jpg");
    }


    return authorCard;
}

function addAuthorsCards(container, authors, template) {
    console.log(authors)

    let top = addCrown(authors);


    for (let author of authors) {
        let authorCard = createBasicAuthorCard(author, template);
        authorCard.find(".author-link").attr("href", `/?author=${author.fullName}`)
        if(Object.values(top).includes(author)){
            switch (Object.values(top).indexOf(author)){
                case 0:
                    authorCard.find(".gold").removeClass("d-none");
                    break;
                case 1:
                    authorCard.find(".gray").removeClass("d-none");
                    break;
                case 2:
                    authorCard.find(".black").removeClass("d-none");
                    break;

            }
        }
        container.append(authorCard);
    }
}

function sortByPostsAndLikesDescending(a, b) {
    // Сравниваем по posts
    if (a.posts > b.posts) {
        return -1;
    } else if (a.posts < b.posts) {
        return 1;
    } else {
        // Если posts равны, сравниваем по likes
        if (a.likes > b.likes) {
            return -1;
        } else if (a.likes < b.likes) {
            return 1;
        } else {
            return 0;
        }
    }
}
function addCrown(authors){
    const sortedData = [...authors].sort(sortByPostsAndLikesDescending);
    let data = {}

    for (let i in sortedData){
        if(i>2){
            return data
        }
        data[i] = sortedData[i]
    }
    return data
}