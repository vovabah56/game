import Login from './viewsjs/login-view.js';
import postView from "./viewsjs/post-view.js";
import postsView from "./viewsjs/posts-view.js";
import authorsView from "./viewsjs/autors-view.js";
import groupsView from "./viewsjs/groups-view.js";
import profileView from "./viewsjs/profile-view.js";
import signupView from "./viewsjs/signup-view.js";
import groupView from "./viewsjs/group-view.js";
import createPost from "./viewsjs/create-post-view.js";

$(window).bind('popstate', router);


$(document).ready(function () {
    preventDefaultLinksBehaviour();
    router();
});

function navigateTo(url) {
    history.pushState(null, null, url);
    router();
}

function pathToRegex(path) {
    return new RegExp(
        '^' +
        path
            .replace(/\//g, '\\/')
            .replace(':page', '([1-9]+[0-9]*)')
            .replace(':id', '([0-9a-f-]*)') +
        '$',
    );
}

function getParams(match) {

     const values = match.resultMatch.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[1]);
    const values1 = match.resultMatch.slice(2);
    const keys1 = Array.from(match.route.path.matchAll(/:(\w+)/g)).map((result) => result[2]);
    console.log(values)
    console.log(keys)
    console.log(values1)
    let s = new URLSearchParams( window.location.search)
    console.log(s.get("page"))
    console.log(Array.from( s.entries()))

    let data = Object.fromEntries(
        keys.map((key, i) => {
            return [key, values[i]];
        }),
    );
    let arr = Array.from( s.entries())
    for (let i = 0; i < arr.length; i++){
        data[arr[i][0]] = arr[i][1]
    }
    console.log(data )
    return data;
}

const routes = [
    {path: '/', view: postsView},
    {path: '/:page', view: postsView},
    {path: '/post/:id', view: postView},
    {path: '/login', view: Login},
    {path: '/authors', view: authorsView},
    {path: '/groups', view: groupsView},
    {path: '/profile', view: profileView},
    {path: '/register', view: signupView},
    {path: '/community/:id', view: groupView},
    {path: '/community/:id/post', view: groupView},
    {path: '/post/create', view: createPost}
];

async function router() {
    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            resultMatch: location.pathname.match(pathToRegex(route.path)),
        };
    });

    let match = potentialMatches.find((potentialMatch) => potentialMatch.resultMatch != null);

    if (!match) {
        match = {
            route: routes[0],
            resultMatch: location.pathname,
        };
    }

    let view = new match.route.view(getParams(match));

    let html = await view.getHtml();
    $('main').html(html);
    view.start();
}

function preventDefaultLinksBehaviour() {
    $('body').click((e) => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.href);
        }

        if ($(e.target).hasClass('nav-link')) {
            $('.nav-link').removeClass('active');
            $(e.target).addClass('active');
        }
    });
}