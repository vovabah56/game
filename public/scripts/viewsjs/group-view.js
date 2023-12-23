import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import { loadPostDetails, submitCommentForm } from "../post.js";
import {loadGroupDetails, loadPosts, submitFilterForm} from "../group.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Группа");
        this.pathName = "/public/views/group.html";
    }

    start() {
        loadNavbar()
        loadGroupDetails(this.params.id)

        loadPosts(this.params.page ? parseInt(this.params.page) : 1, this.params.id, this.params)
        submitFilterForm(this.params.id)
    }
}