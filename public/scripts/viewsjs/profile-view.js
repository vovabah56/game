import AbstractView from "./AbstractView.js";

import { loadNavbar } from "../navbar.js";
import {loadProfile, registerEditProfileEvent, registerSaveProfileEvent} from "../profile.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Профиль");
        this.pathName = '/public/views/profile.html';
    }

    start() {
        loadNavbar();
        registerEditProfileEvent();
        registerSaveProfileEvent();
        loadProfile();
    }
}