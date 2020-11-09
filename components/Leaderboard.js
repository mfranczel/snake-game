// Michal Franczel
export default class Leaderboard {
    
    constructor(){
        this.leaderboard = {
            tag: "div",
            innerTags: [
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
                                            innerText: "#"
                                        },
                                        {
                                            tag: "th",
                                            scope: "col",
                                            innerText: "Player"
                                        },
                                        {
                                            tag: "th",
                                            scope: "col",
                                            innerText: "Score"
                                        },
                                        {
                                            tag: "th",
                                            scope: "col",
                                            innerText: "Level"
                                        }
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

    insertValues(logs) {
        this.resetValues()
        logs.forEach((log, index) => {
            if (log.username) {
                this.leaderboard.innerTags[0].innerTags[0].innerTags[1].innerTags.push({
                    tag: "tr",
                    innerTags: [
                    {
                        tag: "th",
                        scope: "row",
                        innerText: index + 1 + ""
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: log.username
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: log.score + ""
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: log.level + ""
                    },
                    ]
                }) 
            } else {
                this.leaderboard.innerTags[0].innerTags[0].innerTags[1].innerTags.push({
                    tag: "tr",
                    innerTags: [
                    {
                        tag: "th",
                        scope: "row",
                        innerText: index + 1 + ""
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: log.session
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: log.score + ""
                    },
                    {
                        tag: "td",
                        scope: "row",
                        innerText: log.level + ""
                    },
                    ]
                }) 
            }
        });
    }

    resetValues() {
        this.leaderboard.innerTags[0].innerTags[0].innerTags[1].innerTags = []
    }
}