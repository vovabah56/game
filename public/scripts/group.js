import {ApiService} from "./ApiService.js";

let groupId =""
function createGroupInfo(group) {
    let groupCard = $("#group-info");
    if (group.name) groupCard.find(".group-name").text(group.name);
    if (group.subscribersCount) groupCard.find(".followers").text(group.subscribersCount);
    if (group.isClosed) {
        groupCard.find(".community-type").text("Открытая")
    } else {
        groupCard.find(".community-type").text("Закрытая")
    }
    if(group.description) groupCard.find(".description").text(group.description);
    if(group.administrators) {


        for (let admin of group.administrators) {
            let adminCard = $("#author-card-template").clone();
            adminCard.removeClass("d-none")
            if (admin.fullName) adminCard.find(".fullname").text(admin.fullName);
            $(".admins").append(adminCard)
        }
    }

}


export function loadPosts(currentPage, id, parametr) {

    const apiService = new ApiService();
    let answer
    console.log(parametr)
    let param = `page=${currentPage}`
    answer = apiService.getCommunityPosts(id,param);
    answer.then((data) => {
        if (data.body) {
            $("#posts").empty();
            addPostsCards($("#posts"), data.body.posts, $("#card-template"));
            addPaginationItems(currentPage, data.body.pagination.count, `community/${id}/post?`);
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
            <a class="page-link" href="/${url}page=${currentPage - 1 >= 1 ? currentPage - 1 : 1}" tabindex="-1" aria-disabled="true" data-link><i class="fas fa-angle-left"></i></a>
        </li>
    `);

    for (let number of pageNumbers) {
        pagination.append(`
            <li class="page-item num-item"><a class="page-link ${number === currentPage ? "active" : ""}" href="/${url}page=${number}" data-link>${number}</a></li>
        `);
    }

    pagination.append(`
        <li class="page-item direction-item">
            <a class="page-link" href="/${url}page=${currentPage + 1 <= pageCount ? currentPage + 1 : pageCount}" data-link><i class="fas fa-angle-right"></i></a>
        </li>
    `);
}


export function loadGroupDetails(id) {
    const apiService = new ApiService()

    let answer = apiService.getCommunity(id)

    answer.then((data) => {
        if (data.body) {
            createGroupInfo(data.body)
        }
    })
    let answerTags = apiService.GetTags()
    answerTags.then((data)=>{
        if(data.body){
            groupId = data.body.id
            addTags(data.body)
        }
    })


}

function addTags(tags){
    let selector = $("#tag-col");

    for (let tag of tags){
        var newOption = $("<option>").val(tag.id).text(tag.name);
        selector.append(newOption);
    }
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
    if (post.tags) postCard.find(".tags").text(post.tags.map(tag => " #" + tag.name));
    if (post.readingTime) postCard.find(".time-reading").text(post.readingTime + " мин.");
    if (post.commentsCount) postCard.find(".cnt-comments").text(post.commentsCount);
    if (post.communityName) postCard.find(".community").text(" в сообществе " + post.communityName)
    if (post.likes) postCard.find(".cnt-like").text(post.likes);
    if(post.hasLike){
        postCard.find(".fa-heart").addClass("fas")
        postCard.find(".fa-heart").removeClass("far")
        postCard.find(".fa-heart").click(()=>{
            let api = new ApiService();
            if(postCard.find(".fa-heart").hasClass("fas")){
                postCard.find(".cnt-like").text(post.likes-1)
                postCard.find(".fa-heart").addClass("far")
                postCard.find(".fa-heart").removeClass("fas")
                api.deleteLike(post.id);
            }
            else {
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
            let api = new ApiService();
            if(postCard.find(".fa-heart").hasClass("far")){
                postCard.find(".cnt-like").text( `${cnt+1}`)
                postCard.find(".fa-heart").addClass("fas")
                postCard.find(".fa-heart").removeClass("far")
                api.postLike(post.id);
            }
            else {

                postCard.find(".cnt-like").text(cnt-1)
                postCard.find(".fa-heart").addClass("far")
                postCard.find(".fa-heart").removeClass("fas")
                api.deleteLike(post.id);
            }
        })
    }
    return postCard;

}



export function submitFilterForm(id) {

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

        obj['page'] = 1;
        let url = $.param(obj)
        url = url.replace(/%5B%5D/g, '');

        let answer = apiService.getCommunityPosts(id, url)
        answer.then((data) => {
            if (data.body) {
                $("#posts").empty();
                $(".pagination").empty()
                addPostsCards($("#posts"), data.body.posts, $("#card-template"));
                let objUrl = {tags: $("#tag-col").selectpicker("val")}
                objUrl['sorting'] = $("#sorting-select").selectpicker("val")
                url = $.param(objUrl)
                url = url.replace(/%5B%5D/g, '');
                addPaginationItems(1, data.body.pagination.count, `community/${id}/post?${url}&`);
            }
        });
    });
}

