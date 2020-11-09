// Michal Franczel
export default class Navbar {

    constructor() {
        this.navbar = {
            tag: "div",
            innerTags: [
                {
                    tag: "ul",
                    className: "nav",
                    innerTags: [
                        {
                            tag: "li",
                            className: "nav-item mb-3 mt-3",
                            innerTags: [
                                {
                                    tag: "a",
                                    href: "/",
                                    className: "nav-link",
                                    innerText: "Home"
                                }
                            ]
                        },
                        {
                            tag: "li",
                            className: "nav-item mb-3 mt-3",
                            innerTags: [
                                {
                                    tag: "a",
                                    href: "/leaderboard",
                                    className: "nav-link",
                                    innerText: "Leaderboard"
                                }
                            ]
                        },
                        {
                            tag: "li",
                            className: "nav-item mb-3 mt-3",
                            innerTags: [
                                {
                                    tag: "a",
                                    href: "/live",
                                    className: "nav-link",
                                    innerText: "Live"
                                }
                            ]
                        },
                        {
                            tag: "button",
                            type: "button",
                            id: "openLogin",
                            className: "btn btn-primary ml-auto float-xs-right mt-3 mb-3 mr-3",
                            innerText: "Log in"
                        }
                    ]
                }
            ]
        }
    }



    withUser(user) {
        var template = JSON.parse(JSON.stringify(this.navbar))
        template.innerTags[0].innerTags[3] = {
            tag: "li",
            className: "nav-item mb-3 mt-3 float-xs-right",
            innerTags: [
                {
                    tag: "a",
                    href: "/logout",
                    className: "nav-link",
                    innerText: "Log out"
                }
            ]               
        }
        template.innerTags[0].innerTags.splice(3, 0, {
            tag: "p",
            className: "nav-item mb-3 mt-4 ml-auto float-xs-right",
            innerText: user
        });
        return template
    }

    withAdmin() {
        var template = this.withUser('Admin')
        template.innerTags[0].innerTags.splice(3, 0, {
            tag: "li",
            className: "nav-item mb-3 mt-3",
            innerTags: [
                {
                    tag: "a",
                    href: "/admin",
                    className: "nav-link",
                    innerText: "Admin Dashboard"
                }
            ]
        })
        return template
    }


}