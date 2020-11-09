// Michal Franczel
export default class LiveGames {

  constructor(){
    this.liveGames = {
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
                                      innerText: "ID"
                                    },
                                    {
                                        tag: "th",
                                        scope: "col",
                                        innerText: "Score"
                                    },
                                    {
                                      tag: "th",
                                      scope: "col",
                                      innerText: "Watch"
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

insertValues(values) {
    this.resetValues()
    values.forEach((score, index) => {
        this.liveGames.innerTags[0].innerTags[0].innerTags[1].innerTags.push({
            tag: "tr",
            innerTags: [
            {
                tag: "th",
                scope: "row",
                innerText: index + ""
            },
            {
              tag: "td",
              scope: "row",
              id: "id_"+index,
              innerText: score.id
            },
            {
                tag: "td",
                scope: "row",
                innerText: score.score
            },
            {
                tag: "td",
                scope: "row",
                innerTags: [
                  {
                    tag: "button",
                    className: "btn btn-primary",
                    id: "liveBtn"+index,
                    innerText: "Watch"
                  }
                ]
            },
            ]
        }) 
    });
}

resetValues() {
    this.liveGames.innerTags[0].innerTags[0].innerTags[1].innerTags = []
}
}