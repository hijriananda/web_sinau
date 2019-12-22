<template>
<body>
      <header>
          <div class="logo">
              <a href="">
                  <img class="logo-text" src="../assets/Logo.svg" alt="logo">
              </a>
          </div>
          <ul class="nav">
              <li>
                  <a href="">Find Training</a>
              </li>
              <li>
                  <a href="">Community</a>
              </li>
              <li>
                  <a href="">About us</a>
              </li>
              <li>
                  <a> <i class="fa fa-user"></i> </a>
                  <ul>
                      <li><a href="#">Dashboard</a></li>
                      <li><a href="#">Logout</a></li>
                  </ul>
              </li>
          </ul>
      </header>
      <section class="login-page">
          <form action="" @submit="doSave">
              <div class="box">
                  <div class="form-head">
                      <h2>Login to Sinau Koding</h2>
                      <p>Let We Know Your Partisipant</p>
                  </div>
                  <div class="form-body" >
                      <input v-model="user.username" type="text" placeholder="Username" autofocus
                      class="form-control" :class="{'is-invalid': hasSubmit && user.username.length === 0}"/>
                      <input v-model="user.password" type="password" placeholder="Password"
                      class="form-control" :class="{'is-invalid': hasSubmit && user.password.length === 0}"/>
                  </div>
                  <div class="form-footer">
                      <button type="submit">Submit</button>
                  </div>
              </div>
          </form>
      </section>
  </body>
    <!-- <div class="wrapper">
        <form class="form-login" @submit="doSave">
            <h2 class="form-login-heading">Please login</h2>
            <input v-model="user.username" type="text" placeholder="Username" autofocus
                   class="form-control" :class="{'is-invalid': hasSubmit && user.username.length === 0}"/>
            <input v-model="user.password" type="password" placeholder="Password"
                   class="form-control" :class="{'is-invalid': hasSubmit && user.password.length === 0}"/>
            <label class="checkbox">
                <input v-model="rememberMe" type="checkbox"> Remember me
            </label>
            <button class="btn btn-lg btn-primary btn-block" type="submit">
                <template v-if="isLoading">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span class="sr-only">Loading...</span>
                </template>
                <template v-else>
                    Login
                </template>
            </button>
        </form>
    </div> -->
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import axios from "axios";

  import User from "../entity/User";

  @Component({name: "login"})
  export default class Login extends Vue {

    public user: User = new User();

    public rememberMe: boolean = false;

    public hasSubmit: boolean = false;

    public isLoading: boolean = false;

    public get isValid(): boolean {
      return this.user.username !== "" && this.user.password !== "";
    }

    public mounted() {
            //@ts-ignore
            this.$root.toggleBodyClass("addClass", "login-page");
        }

    public beforeDestroy() {
            //@ts-ignore
            this.$root.toggleBodyClass("removeClass", "login-page");
        }

    public doSave(event: Event): void {
      event.preventDefault();

      this.hasSubmit = true;

      if (!this.isLoading && this.isValid) {
        this.isLoading = true;

        axios.post("http://192.168.0.152:9000/login", {
          username: this.user.username,
          password: this.user.password
        }).then((response) => {
          if (response.data.status == "200") {
            this.hasSubmit = false;

            this.user = new User();

            //@ts-ignore
            this.$doCookieOperation("session", response.data.data);

            this.$notify({
              group: 'default',
              type: 'success',
              title: 'Login',
              text: 'Success Bro!'
            });

            this.$router.push("/home");
          } else {
            this.$notify({
              group: 'default',
              type: 'warn',
              title: 'Login',
              text: 'Gagal Login!'
            });
            // alert("Invalid Login");
          }
        }).catch((error) => {
          this.$notify({
            group: 'default',
            type: 'error',
            title: 'Login',
            text: error.toString()
          });
        }).finally(() => {
          this.isLoading = false;
        });
      }
    }
  }
</script>

<style scoped lang="scss">

@import url('https://fonts.googleapis.com/css?family=Montserrat:500&display=swap');

*{
    box-sizing: border-box 
    ;
}
body{
    padding: 0px;
    margin: 0px;
    background-color: #edf1f8;
    font-family: 'Montserrat', sans-serif;
}

header{
    background:white;
    height: 66px;
}

header * {
    color : #01111c;
}

header .logo{
    float: left;
    height: inherit;
    margin-left: 2em;
}
header .logo img {
    height: 80%;

}
header .logo a{
    text-decoration: none;
}

header .logo-text{
    margin:9px;
}

header ul{
    float: right;
    margin: 0px;
    padding: 0px;
    list-style: none;
    height: inherit;
}

header ul li {
    float: left;
    position: relative;
    height: inherit;
}

header ul li a {
    display: block;
    padding: 21px;
    font-size: 1.1em;
    text-decoration: none;
    height: inherit;
}

header ul li a:hover {
    background: #f24738;
    transition: 0,5s;
    color: #edf1f8;
}

header ul li ul {
    position: absolute;
    top: 66px;
    right: 0px;
    widows: 180px;
    display: none;
}

header ul li:hover ul {
    display: block;
}

header ul li ul li {
    width: 100%;
}

header ul li ul li a.logout {
    background:  white;
    color: red;
}

header ul li ul li a:hover{
    background: rgb(155, 150, 150);
}

.login-page {
    height: 100vh;
    position: relative;
}

.login-page .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    width: 320px;
}

.login-page .box .form-head h2 {
    text-align: center;
    margin: 10px 0px;
    color: #01111c;
    margin-bottom: 2em;
}

.login-page .box .form-head p {
    text-align:  center;
    margin: 10px 0px;
    color: rgb(46, 40, 40);
    margin-bottom: 3rem;
}

.login-page .box .form-body {
    display: flex;
    flex-direction:  column;
}

.login-page .box .form-body input {
    height: 40px;
    margin-bottom: 20px;
    border: 1px solid #ffffff;
    width: 100%;
    border-radius: 5px;
    padding-left: 1rem;
    transition: box-shadow 0.5px ease;
}

.login-page.box .form-body input:focus {
    box-shadow: 0px 0px 10px rgb(86, 255, 86);
}

.login-page.box .form-body input::placeholder {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;    
    color: rgb(214, 210, 210);
}

.login-page .box .form-footer button {
    height: 40px;
    width: 100%;
    border-radius: 5px;
    color: #edf1f8;
    background-color: #df205b;
    border: none;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}

.login-page .box .form-footer button:hover {
    box-shadow: rgb(190, 147, 147);
    background-color: springgreen;
}
    // .wrapper {
    //     margin-top: 80px;
    //     margin-bottom: 80px;

    //     .form-login {
    //         max-width: 380px;
    //         padding: 15px 35px 45px;
    //         margin: 0 auto;
    //         background-color: #fff;
    //         border: 1px solid rgba(0, 0, 0, 0.1);

    //         .form-login-heading, .checkbox {
    //             margin-bottom: 30px;
    //         }

    //         .checkbox {
    //             font-weight: normal;
    //         }

    //         .form-control {
    //             position: relative;
    //             font-size: 16px;
    //             height: auto;
    //             padding: 10px;

    //             &:focus {
    //                 z-index: 2;
    //             }
    //         }

    //         input[type="text"] {
    //             margin-bottom: 15px;
    //         }

    //         input[type="password"] {
    //             margin-bottom: 20px;
    //         }
    //     }
    // }
</style>
