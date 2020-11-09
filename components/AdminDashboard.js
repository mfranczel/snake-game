// Michal Franczel
export default class AdminDashboard {
    constructor () {
        this.adminDashboard = {
                tag: "div",
                innerTags: [
                    {
                        tag: "div",
                        className: "row justify-content-center mt-5",
                        innerTags: [
                        {
                            tag: "div",
                            className: "mb-3",
                            innerTags: [
                                {
                                    tag: "a",
                                    id: "export",
                                    className: "mr-3",
                                    innerText: "Export CSV"
                                },
                                {
                                    tag: "input",
                                    id: "csvImportInput",
                                    className: "mr-3",
                                    type: "file"
                                },
                                {
                                    tag: "button",
                                    id: "import",
                                    className: "btn btn-primary",
                                    innerText: "Import CSV"
                                },
                            ]
                        }
                    ]
                    },
                    {
                        tag: "div",
                        className: "row justify-content-center mt-5",
                        innerTags: [
                            {
                                tag: "table",
                                className: "table ml-3 mr-3",
                                innerTags: [
                                    {
                                        tag: "thead",
                                        innerTags: [
                                        {
                                            tag: "tr",
                                            innerTags: [
                                            {
                                                tag: "th",
                                                scope: "col",
                                                innerText: "Name"
                                            },
                                            {
                                              tag: "th",
                                              scope: "col",
                                              innerText: "Session"
                                            },
                                            {
                                                tag: "th",
                                                scope: "col",
                                                innerText: "Pin"
                                            },
                                            
                                            ]
                                        }
                                        ]
                                    },
                                    {
                                        tag: "tbody",
                                        innerTags: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
    }
    resetValues() {
        this.adminDashboard.innerTags[1].innerTags[0].innerTags[1].innerTags = []
    }

    populateTable(users, games) {
        this.resetValues()
        users.forEach(user => {
            var game = games.find(game => game.userID === user.id)
            if (game) {
                var sessions = game.sessionID.join(' ')
                this.adminDashboard.innerTags[1].innerTags[0].innerTags[1].innerTags.push({
                    tag: "tr",
                    innerTags: [
                    {
                        tag: "th",
                        scope: "row",
                        innerText: user.username
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: sessions
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: game.code
                    }]
                })
            } else {
                this.adminDashboard.innerTags[1].innerTags[0].innerTags[1].innerTags.push({
                    tag: "tr",
                    innerTags: [
                    {
                        tag: "th",
                        scope: "row",
                        innerText: user.username
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: "N/A"
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: "N/A"
                    }
                    ]
                })
            }
        });

        games.forEach(game => {
            if(!users.find(user => game.userID === user.id)) {
                var sessions = game.sessionID.join(' ')
                this.adminDashboard.innerTags[1].innerTags[0].innerTags[1].innerTags.push({
                    tag: "tr",
                    innerTags: [
                    {
                        tag: "th",
                        scope: "row",
                        innerText: "N/A"
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: sessions
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: game.code
                    }]
                })
            }
        })
    }
}