import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import {submitCreatePostForm} from "../create-post.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Создание поста");
        this.pathName = '/public/views/create-post.html';
    }

    start() {
        loadNavbar();
        submitCreatePostForm()
    }
}