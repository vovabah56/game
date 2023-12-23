export class ApiService {
/*
    _urlBase = "https://blog.kreosoft.space/api";
*/
    _urlBase = "https://datsblack.datsteam.dev"
    token1 = "e3169945-efcb-4486-b330-74d571cca031"
    async get(url) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'GET',
                headers: {
                    "X-API-Key": `${this.token1}`,
                },
            });

            let data = {};

            if (!response.ok) {
                data.error = response.statusText;
            } else {
                data.body = await response.json();
            }
            return (data);
        } catch (error) {
            console.log(error);
        }
    }

    async post(url) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${this.token1}`,
                },
            });

            let data = {};

            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }

            return (data);
        } catch (error) {
            console.log(error);
        }
    }

    async postWithBody(url, body) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": `${this.token1}`,
                },
                body: JSON.stringify(body)
            });

            let data = {};

            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }

            return (data);
        } catch (error) {
            console.log(error);
        }
    }

    async put(url, body) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(body)
            });

            let data = {};

            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }

            return (data);
        } catch (error) {
            console.log(error);
        }
    }

    async delete(url) {
        try {
            const response = await fetch(`${this._urlBase}${url}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            let data = {};

            if (!response.ok) {
                data.error = response;
            } else {
                data.body = response;
            }

            return (data);
        } catch (error) {
            console.log(error);
        }
    }


    async register(body) {
        let response = await this.postWithBody(`/account/register`, body);
        if (response.body) {
            response.body = await response.body.json();
        } else if (response.error) {
            response.error = await response.error.json();
        }
        return (response);
    }

    async login(body) {
        let response = await this.postWithBody(`/account/login`, body);
        if (response.body) {
            response.body = await response.body.json();
        } else if (response.error) {
            response.error = await response.error.json();
        }
        return (response);
    }

    async GetPostsOnPage(pageNum) {
        return this.get(`/post?page=${pageNum}`);
    }
    async GetPostsFilter(url){
        return this.get(`/post?${url}`);
    }
    logout() {
        return this.post(`/account/logout`);
    }

    getProfileInfo() {
        return this.get(`/account/profile`);
    }

    async GetConcretePost(postId) {
        return this.get(`/post/${postId}`);
    }

    getAuthors() {
        return this.get(`/author/list`);
    }

    GetTags(){
        return this.get(`/tag`)
    }
    getGroups() {
        return this.get(`/community`);
    }

    getRoleInGroup(groupId) {
        return this.get(`/community/${groupId}/role`);
    }

    postCreateComment(postId, body) {
        console.log("попытка комента" + postId);
        return this.postWithBody(`/post/${postId}/comment`, body);
    }


    getScan(){
        return this.get(`/api/scan`);
    }



    getTest(){
        return this.get(`/api/scan`);
    }
    getMap(){
        return this.get(`/api/map`);
    }


    postCommands(body){
        return this.postWithBody(`/api/shipCommand`, body);
    }

    async getOfUrl(url) {
        try{
            const response = await fetch(`${url}`, {
                method: 'GET',
                headers: {
                    "X-API-Key": `${this.token1}`,
                },
            });

            let data = {};

            if (!response.ok) {
                data.error = response.statusText;
            } else {
                data.body = await response.json();
            }
            return (data);
        } catch (error) {
            console.log(error);
        }
    }







    postSubscribeOnGroup(groupId){
        return this.post(`/community/${groupId}/subscribe`);
    }

    deleteUnSubscribeOnGroup(groupId){
        return this.delete(`/community/${groupId}/unsubscribe`);
    }

    postLike(postId){
        return this.post(`/post/${postId}/like`);
    }

    deleteLike(postId){
        return this.delete(`/post/${postId}/like`);
    }


    getNestedComments(commentId){
        return this.get(`/comment/${commentId}/tree`);
    }

    postCreatePost(content){
        return this.postWithBody(`/post`, content)
    }

    deleteComment(commentId){
        return this.delete(`/comment/${commentId}`);
    }

    putEditComment(commentId, editContent){
        return this.put(`/comment/${commentId}`, editContent)
    }

    putEditProfile(objectData){
        return this.put(`/account/profile`, objectData)
    }

    getAddressChain(addressId){
        return this.get(`/address/chain?objectGuid=${addressId}`)
    }

    getCommunity(id){
        return this.get(`/community/${id}`)
    }

    getCommunityPosts(id, param){
        return this.get(`/community/${id}/post?${param}`)
    }

}
