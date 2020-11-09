// Michal Franczel
export default class Home {
    constructor(){
        this.home = {
            tag: "div",
            innerTags: [
                {
                    tag: "div",
                    className: "row justify-content-center mt-5",
                    innerTags: [
                        {
                            tag: "p",
                            className: "mr-1",
                            innerText: "Score: "
                        },
                        {
                            tag: "p",
                            id: "score",
                            className: "mr-5",
                            innerText: ""
                        },
                        {
                            tag: "p",
                            className: "mr-1",
                            innerText: "Lives: "
                        },
                        {
                            tag: "p",
                            id: "lives",
                            className: "mr-5",
                            innerText: ""
                        },
                        {
                            tag: "p",
                            className: "mr-1",
                            innerText: "Max score: "
                        },
                        {
                            tag: "p",
                            className: "mr-5",
                            id: "maxScore",
                            innerText: 0
                        },
                        {
                            tag: "p",
                            className: "mr-1",
                            innerText: "Max level: "
                        },
                        {
                            tag: "p",
                            id: "maxLevel",
                            innerText: 0
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center mt-5",
                    innerTags: [
                        {
                            tag: "canvas",
                            id: "game"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center mt-3",
                    innerTags: [
                        {
                            tag: "button",
                            className: "btn btn-primary mr-3",
                            id: "saveButton",
                            innerText: "Save game"
                        },
                        {
                            tag: "button",
                            className: "btn btn-primary mr-3",
                            id: "loadButton",
                            innerText: "Load game"
                        },
                        {
                            tag: "button",
                            className: "btn btn-primary",
                            id: "playButton",
                            innerText: "Play music"
                        }

                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center",
                    innerTags: [
                        {
                            tag: "p",
                            id: "msg",
                            innerText: ""
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center mt-5",
                    innerTags: [
                        {
                            tag: "button",
                            className: "btn btn-primary p-5",
                            id: "upButton",
                            innerText: "⇧"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center md-5 mt-1",
                    innerTags: [
                        {
                            tag: "button",
                            className: "btn btn-primary p-5 mr-1",
                            id: "leftButton",
                            innerText: "⇦"
                        },
                        {
                            tag: "button",
                            className: "btn btn-primary p-5",
                            id: "downButton",
                            innerText: "⇩"
                        },
                        {
                            tag: "button",
                            className: "btn btn-primary p-5 ml-1",
                            id: "rightButton",
                            innerText: "⇨"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center mt-5",
                    innerTags: [
                        {
                            tag: "p",
                            className: "align-middle",
                            innerText: "Enter code to join: "
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center ",
                    innerTags: [
                        {
                            tag: "input",
                            className: "align-middle",
                            type: "text",
                            id: "codeInput"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center ",
                    innerTags: [
                        {
                            tag: "button",
                            className: "btn btn-primary align-middle mt-3",
                            id: "joinButton",
                            innerText: "Join game"
                        }
                    ]
                },
                {
                    tag: "div",
                    className: "row justify-content-center mt-3",
                    innerTags: [
                        {
                            tag: "p",
                            className: "align-middle mr-3",
                            innerText: "Your code: "
                        },
                        {
                            tag: "p",
                            className: "align-middle",
                            id: "code",
                            innerText: ""
                        }
                    ]
                }
            ]
        }
    }

}