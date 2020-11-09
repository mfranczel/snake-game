// Michal Franczel
export default class LoginModal {

    constructor() {
      this.loginModal = {
        tag: "div",
        className: "modal fade",
        id: "loginModal",
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
                        innerText: "Log in"
                      }
                    ]
                  },
                  {
                    tag: "div",
                    className: "modal-body",
                    innerTags: [
                      {
                        tag: "form",
                        id: "loginForm",
                        action: "/login",
                        method: "POST",
                        innerTags: [
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
                                id: "usernameField",
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
                                id: "passwordField",
                                type: "password",
                                name: "password",
                                className: "form-control",
                              }
                            ]
                          },
                          {
                            tag: "p",
                            id: "loginMessage",
                            className: "",
                            innerText: ""
                          },
                          {
                            tag: "a",
                            id: "openRegister",
                            innerText: "Register"
                          },
                          {
                            tag: "button",
                            id: "loginSubmit",
                            type: "submit",
                            className: "btn btn-primary float-right",
                            innerText: "Log in"
                          },
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