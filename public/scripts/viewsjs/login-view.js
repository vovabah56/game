import AbstractView from "./AbstractView.js";
import {submitAuthorizationForm} from "../login.js";
import { loadNavbar } from "../navbar.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Авторизация");
        this.pathName = '/public/views/login.html';
    }

    start() {
        loadNavbar();
        submitAuthorizationForm();
    }
}