import AbstractView from "./AbstractView.js";

import { loadNavbar } from "../navbar.js";
import {loadGroups} from "../groups.js";
export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Группы");
        this.pathName = '/public/views/groups.html';
    }

    start() {
        loadNavbar();
        loadGroups();
    }
}