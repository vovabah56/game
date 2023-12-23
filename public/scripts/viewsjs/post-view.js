import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { loadPostDetails, submitCommentForm } from "../post.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Пост");
        this.pathName = "/public/views/post.html";
    }

    start() {
        loadNavbar()
        submitCommentForm();
        console.log(this.params)
        loadPostDetails(this.params.id);
    }
}