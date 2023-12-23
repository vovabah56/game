import AbstractView from "./AbstractView.js";
import { loadNavbar } from "../navbar.js";
import {submitSignUpForm} from "../signup.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Регистрация");
        this.pathName = '/public/views/signup.html';
    }

    start() {
        loadNavbar();
        submitSignUpForm()
    }
}