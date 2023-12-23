import {changePage, getObjectFromInputs} from './common.js';
import {ApiService} from './ApiService.js';

let postId = '';

function submitAnswerCommentForm(input, parentId, form) {
    const apiService = new ApiService();

    form.submit(function (event) {
        event.preventDefault()

        let objectData = {};

        objectData["content"] = input.val();
        objectData["parentId"] = parentId;

        if (objectData) {
            let answer = apiService.postCreateComment(postId, objectData);
            answer.then((data) => {
                if (data.body) {
                    console.log(data);
                } else if (data.error) {
                    console.log(data);
                }
            });
        }
    })
}

function addComentBlock() {
    const apiService = new ApiService();

    let answer = apiService.getProfileInfo();
    answer.then((data) => {

        if (data.body) {
            $('#create-comment').removeClass('d-none');
        } else if (data.error) {
            $('#create-comment').addClass('d-none');
        }
    });
}

function removeComment(commentId) {
    const apiService = new ApiService()
    apiService.deleteComment(commentId);
}

let infoUser = null;

function createMapComment(comments) {
    const apiService = new ApiService()
    let elemtntComments = $("#commentList");
    let templateRoot = $(".template-comment")
    let templateNested = $(".sub-comments")
    let userAnswer = apiService.getProfileInfo();

    userAnswer.then((data) => {
            if (data.body) {
                infoUser = data.body
            }
        }
    )
    for (let comment of comments) {
        let answer = apiService.getNestedComments(comment.id)
        answer.then((data) => {
            if (data.body) {

                let commentCard = createConcreateComment1([comment, data.body], templateRoot, templateNested)
                elemtntComments.append(commentCard);
            }
        });
    }
}

function confirmEditComment(input, commentId, form) {
    const apiService = new ApiService();

    form.submit(function (event) {
        event.preventDefault()

        let objectData = {};

        objectData["content"] = input.val();


        if (objectData) {
            let answer = apiService.putEditComment(commentId, objectData);
            answer.then((data) => {
                if (data.body) {
                    console.log(data);
                } else if (data.error) {
                    console.log(data);
                }
            });
        }
    })
}


function createConcreateComment1(commentRootAndNested, templateRoot, templateNested) {
    let commentCard = templateRoot.clone()
    commentCard.removeClass("d-none")
    let root = commentRootAndNested[0]
    if (root.deleteDate) {
        commentCard.find(".author-comment").text("[Комментарий удален]");
        commentCard.find(".content-comment").text("[Комментарий удален]");
    } else {
        if (root.modifiedDate) {
            commentCard.find(".is-edit").removeClass("d-none")
            commentCard.find('.is-edit').attr('data-date', moment(new Date(root.modifiedDate)).format('DD.MM.YYYY'));
        }
        if (root.author) commentCard.find(".author-comment").text(root.author);
        if (root.content) commentCard.find(".content-comment").text(root.content);
        if (infoUser.id === root.authorId) {
            commentCard.find(".myComment").removeClass("d-none")
            commentCard.find(".remove-comment").click(() => {
                removeComment(root.id)
            })
            commentCard.find(".edit-comment").click(() => {
                    commentCard.find(".commentEditForm").removeClass("d-none");
                    commentCard.find(".edit-row").text(root.content)
                }
            )
            confirmEditComment(commentCard.find(".edit-row"), root.id, commentCard.find(".commentEditForm"))
        }
    }
    if (root.createTime) {
        const dateString = moment(new Date(root.createTime)).format('DD.MM.YYYY HH:mm')
        commentCard.find(".create-time-comment").text(dateString);
    }
    if (infoUser != null) {
        commentCard.find(".answer-comment").removeClass("d-none")
        commentCard.find(".answer-comment").click(() => {
                commentCard.find(".commentReplyForm").removeClass("d-none");
            }
        )
        submitAnswerCommentForm(commentCard.find(".answer-row"), root.id, commentCard.find(".commentReplyForm"));
    }

    let nestedElements = commentRootAndNested[1]

    for (let nestedElement of nestedElements) {
        if (commentCard.find(".open-sub-comment").hasClass("d-none")) {
            commentCard.find(".open-sub-comment").removeClass("d-none")
        }
        commentCard.find(".openBtn").click(() => {
            nestedCard.removeClass("d-none")
            commentCard.find(".openBtn").addClass("d-none")
            commentCard.find(".closeBtn").removeClass("d-none")
        });
        commentCard.find(".closeBtn").click(() => {
            nestedCard.addClass("d-none")
            commentCard.find(".openBtn").removeClass("d-none")
            commentCard.find(".closeBtn").addClass("d-none")
        });

        let nestedCard = templateNested.clone()
        nestedCard.attr("id", nestedElement.id)

        if (infoUser != null) {
            nestedCard.find(".answer-comment-nested").removeClass("d-none")
            nestedCard.find(".answer-comment-nested").click(() => {
                    nestedCard.find(".commentReplyForm-nested").removeClass("d-none");
                }
            )

            submitAnswerCommentForm(nestedCard.find(".answer-row"), nestedElement.id, nestedCard.find(".commentReplyForm-nested"))
            if (infoUser.id == nestedElement.authorId) {
                nestedCard.find(".myComment").removeClass("d-none");
                nestedCard.find(".edit-comment").click(() => {
                        nestedCard.find(".commentEditForm-nested").removeClass("d-none");
                        nestedCard.find(".edit-row").text(nestedElement.content)
                    }
                )
                confirmEditComment(nestedCard.find(".edit-row"), nestedElement.id, nestedCard.find(".commentEditForm-nested"))
            }
        }
        if (nestedElement.deleteDate) {
            nestedCard.find(".author-comment").text("[Комментарий удален]");
            nestedCard.find(".content-comment").text("[Комментарий удален]");
        } else {
            if (nestedElement.modifiedDate) {
                nestedCard.find(".is-edit").removeClass("d-none")
                nestedCard.find('.is-edit').attr('data-date', moment(new Date(nestedElement.modifiedDate)).format('DD.MM.YYYY'));
            }
            if (nestedElement.author) nestedCard.find(".author-comment").text(nestedElement.author);
            if (nestedElement.content) nestedCard.find(".content-comment").text(nestedElement.content);
            if (infoUser.id === nestedElement.authorId) {
                nestedCard.find(".myComment").removeClass("d-none")
                nestedCard.find(".remove-comment").click(() => {
                    removeComment(nestedElement.id)
                })
            }
        }

        if (nestedElement.createTime) {
            const dateString = moment(new Date(nestedElement.createTime)).format('DD.MM.YYYY HH:mm')
            nestedCard.find(".create-time-comment").text(dateString);
        }
        commentCard.append(nestedCard)
    }
    return commentCard;
}


export function loadPostDetails(id) {
    postId = id;
    const apiService = new ApiService();

    let answer = apiService.GetConcretePost(postId);
    answer.then((data) => {
        if (data.body) {
            addPostDetails(data.body);
            createMapComment(data.body.comments)
            addComentBlock()
        }
    });
}

export function submitCommentForm() {
    const apiService = new ApiService();

    $("form").submit(function (event) {
        event.preventDefault()
        let objectForm = getObjectFromInputs();

        if (objectForm) {
            let answer = apiService.postCreateComment(postId, objectForm);
            answer.then((data) => {
                if (data.body) {
                    console.log(data);

                } else if (data.error) {
                    console.log(data);

                }
            });
        }

    })


}


function addPostDetails(post) {

    let postCard = $('#post-info');

    if (post.title) {
        postCard.find('.post-title').text(post.title);
        document.title = post.title
    }

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
    if (post.addressId) {
        postCard.find(".loc-div").removeClass("d-none")
        getLocation(postCard, post.addressId)
    }
}

function getLocation(postCard, addressId) {
    const apiService = new ApiService();

    let answer = apiService.getAddressChain(addressId);
    answer.then((data) => {
        if (data.body) {
            let text = "";
            for (let elementAddr of data.body) {
                text = text + elementAddr.text + ", "
            }
            postCard.find(".location").text(text)
        }

    })

}
