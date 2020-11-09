// Michal Franczel
export default class RegisterModal {

    constructor() {
      this.registerModal = {
        tag: "div",
        className: "modal fade",
        id: "registerModal",
        innerTags: [
          {
            tag: "div",
            className: "modal-dialog",
            innerTags: [
              {
                tag: "div",
                className: "modal-content",
                innerTags: [
                  {
                    tag: "div",
                    className: "modal-header",
                    innerTags: [
                      {
                        tag: "h5",
                        className: "modal-title",
                        innerText: "Register"
                      }
                    ]
                  },
                  {
                    tag: "div",
                    className: "modal-body",
                    innerTags: [
                      {
                        tag: "form",
                        id: "registerForm",
                        action: "/register",
                        method: "POST",
                        innerTags: [
                            {
                                tag: "div",
                                className: "form-group",
                                innerTags: [
                                  {
                                    tag: "label",
                                    innerText: "E-mail"
                                  },
                                  {
                                    tag: "input",
                                    id: "regEmailField",
                                    type: "email",
                                    name: "email",
                                    className: "form-control",
                                  }
                                ]
                            },
                            {
                            tag: "div",
                            className: "form-group",
                            innerTags: [
                              {
                                tag: "label",
                                innerText: "Username"
                              },
                              {
                                tag: "input",
                                id: "regUsernameField",
                                type: "username",
                                name: "username",
                                className: "form-control",
                              }
                            ]
                          },
                          {
                            tag: "div",
                            className: "form-group",
                            innerTags: [
                              {
                                tag: "label",
                                innerText: "Password"
                              },
                              {
                                tag: "input",
                                id: "regPasswordField",
                                type: "password",
                                name: "password",
                                className: "form-control",
                              }
                            ]
                          },
                          {
                            tag: "p",
                            id: "registerMessage",
                            className: "",
                            innerText: ""
                          },
                          {
                            tag: "button",
                            id: "registerSubmit",
                            type: "submit",
                            className: "btn btn-primary",
                            innerText: "Submit"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
}