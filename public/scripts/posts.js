import {ApiService} from "./ApiService.js";
import {validateForm} from "./validation.js";



export function loadPosts(currentPage, parametr) {

    $(".test_api").click(()=>{
        const api = new ApiService();
        let ans = api.getMap();
        ans.then((body)=>{
            console.log(body);
        })
    });


    const apiService = new ApiService();
    let answer
    console.log(parametr)
    console.log(parametr.type)
    delete parametr["page"]
    console.log(parametr)
    let url = $.param(parametr)
    url = url.replace(/%5B%5D/g, '');
    url = url.replace(/%3F/g, '');
    answer = apiService.GetPostsFilter(url+"&page=" + currentPage);
    answer.then((data) => {
        if (data.body) {
            $("#posts").empty();
            addPostsCards($("#posts"), data.body.posts, $("#card-template"));
            addPaginationItems(currentPage, data.body.pagination.count, url);
        }
    });
}

function getPageNumbers(total, max, current) {
    const half = Math.floor(max / 2);
    let to = max;

    if (current + half >= total) {
        to = total;
    } else if (current > half) {
        to = current + half;
    }

    let from = Math.max(to - max, 0);

    return Array.from({length: Math.min(total, max)}, (_, i) => (i + 1) + from);
}

function addPaginationItems(currentPage, pageCount, url) {
    let pagination = $(".pagination");
    let pageNumbers = getPageNumbers(pageCount, 3, currentPage);

    pagination.append(`
        <li class="page-item direction-item">
            <a class="page-link" href="/?${url}&page=${currentPage - 1 >= 1 ? currentPage - 1 : 1}" tabindex="-1" aria-disabled="true" data-link><i class="fas fa-angle-left"></i></a>
        </li>
    `);

    for (let number of pageNumbers) {
        pagination.append(`
            <li class="page-item num-item"><a class="page-link ${number === currentPage ? "active" : ""}" href="/?${url}&page=${number}" data-link>${number}</a></li>
        `);
    }

    pagination.append(`
        <li class="page-item direction-item">
            <a class="page-link" href="/?${url}&page=${currentPage + 1 <= pageCount ? currentPage + 1 : pageCount}" data-link><i class="fas fa-angle-right"></i></a>
        </li>
    `);
}

function addPostsCards(container, posts, template) {
    for (let post of posts) {
        let postCard = createBasicPostCard(post, template);
        postCard.find(".post-link").attr("href", `/post/${post.id}`);
        container.append(postCard);
    }
}



export function createBasicPostCard(movie, template) {
    let post = movie
    let postCard = template.clone();
    postCard.removeAttr("id");
    postCard.removeClass("d-none")
    if (post.title) postCard.find(".post-title").text(post.title);
    postCard.find(".post-photo").attr("src", post.image);

    if (post.author) postCard.find(".author").text(post.author);

    if (post.createTime) {
        const dateString = moment(new Date(post.createTime)).format('DD.MM.YYYY HH:mm')
        postCard.find(".create-time").text(dateString);
    }

    if (post.description) postCard.find(".description").text(post.description);

    var textContainer = postCard.find(".description");
    var readMoreBtn = postCard.find(".readMoreBtn");

    // Получение текста из элемента
    var text = textContainer.text();

    // Ограничение текста до 100 символов
    var truncatedText = text.length > 100 ? text.slice(0, 400) + '...' : text;

    // Обновление текста в элементе
    textContainer.text(truncatedText)

    // Показывать кнопку "Читать полностью" только если текст обрезан
    if (text.length > 100) {
        readMoreBtn.removeClass("d-none")

    }else{
        readMoreBtn.addClass("d-none")
    }

    readMoreBtn.click(() =>{
        textContainer.text(text)
        readMoreBtn.addClass("d-none")
    })

    // Добавление обработчика события для кнопки


    if (post.tags) postCard.find(".tags").text(post.tags.map(tag => " #" + tag.name));
    if (post.readingTime) postCard.find(".time-reading").text(post.readingTime + " мин.");
    if (post.commentsCount) postCard.find(".cnt-comments").text(post.commentsCount);
    if (post.communityName) postCard.find(".community").text(" в сообществе " + post.communityName)
    if (post.likes) postCard.find(".cnt-like").text(post.likes);
    if(post.hasLike){
        postCard.find(".fa-heart").addClass("fas")
        postCard.find(".fa-heart").removeClass("far")
        postCard.find(".fa-heart").click(()=>{
            console.log(123)
            let api = new ApiService();
            if(postCard.find(".fa-heart").hasClass("fas")){
                console.log("лайка  было изначально и удалят")
                postCard.find(".cnt-like").text(post.likes-1)
                postCard.find(".fa-heart").addClass("far")
                postCard.find(".fa-heart").removeClass("fas")
                api.deleteLike(post.id);
            }
            else {
                console.log("лайка было изначально и ставим")
                postCard.find(".cnt-like").text(post.likes)
                postCard.find(".fa-heart").addClass("fas")
                postCard.find(".fa-heart").removeClass("far")
                api.postLike(post.id);
            }
        })
    }
    else{

        postCard.find(".fa-heart").click(()=> {
            let cnt = parseInt(postCard.find(".cnt-like").text())
            console.log(postCard.find(".cnt-like").text())
            let api = new ApiService();
            if(postCard.find(".fa-heart").hasClass("far")){
                console.log("лайка не было изначально и ставим")
                postCard.find(".cnt-like").text( `${cnt+1}`)
                postCard.find(".fa-heart").addClass("fas")
                postCard.find(".fa-heart").removeClass("far")
                api.postLike(post.id);
            }
            else {
                console.log("лайка не было изначально и удаляем")
                console.log(postCard.find(".cnt-like").text())
                postCard.find(".cnt-like").text(cnt-1)
                postCard.find(".fa-heart").addClass("far")
                postCard.find(".fa-heart").removeClass("fas")
                api.deleteLike(post.id);
            }
        })
    }
    return postCard;

}


function addTags(tags){
    let selector = $("#tag-col");
    let clone = $("#tag-template").clone();
    $("#tag-template").remove();
    clone.removeAttr("id")

    for (let tag of tags){
        var newOption = $("<option>").val(tag.id).text(tag.name);
        selector.append(newOption);
    }
}

export function submitFilterForm() {

    const apiService = new ApiService();
    let answer = apiService.GetTags();
    answer.then((data) => {
        if (data.body) {
            addTags(data.body);
        }
    });
    $("form").submit(function (event) {
        event.preventDefault();
        let obj = {tags: $("#tag-col").selectpicker("val")}
        obj['sorting'] = $("#sorting-select").selectpicker("val")
        obj['onlyMyCommunities'] = $("#onlyMyCommunities").prop('checked')
        obj['min'] = $("#min-read-time").val()
        obj['author'] = $("#author").val()
        obj['max'] = $("#max-read-time").val()

        let url = $.param(obj)
        url = url.replace(/%5B%5D/g, '');

        let answer = apiService.GetPostsFilter(url)
        answer.then((data) => {
            if (data.body) {
                $("#posts").empty();
                $(".pagination").empty()
                addPostsCards($("#posts"), data.body.posts, $("#card-template"));
                addPaginationItems(1, data.body.pagination.count, "?"+ url);
            }
        });
    });
}






