import AbstractView from "./AbstractView.js";

import { loadNavbar } from "../navbar.js";
import {loadAuthors} from "../authors.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Авторы");
        this.pathName = '/public/views/author.html';
    }

    start() {
        loadNavbar();
        loadAuthors();
    }
}