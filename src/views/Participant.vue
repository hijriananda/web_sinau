<template>
    <div class="participant">

        <div v-if="!participant" class="table-wrapper">
            <div class="logout-wrapper">
                <button @click="doLogout">Logout</button>
            </div>
          <div class="sidebar">
            <div class="brand">
                <img src="../assets/Logo.svg" alt="Logo" class="logo-text" />
            </div>
            <ul>
                <li>
                    <a href=""><i class="fas fa-home"></i>Dashboard</a>
                </li>
            </ul>
            <ul>
                <li class="active">
                    <a href=""><i class="fas fa-user"></i>Participant</a>
                </li>
            </ul>
            <ul>
                <li>
                    <a href=""><i class="fas fa-calendar"></i>Schedule</a>
                </li>
            </ul>
            <ul>
                <li>
                    <a href=""><i class="fas fa-graduation-cap"></i>Participant class</a>
                </li>
            </ul>
        </div>

        <div class="main_content">
            <div class="container">
                <div class="semua">
                    <div class="header-table">
                        <div class="title">
                            <h2> Add Participant</h2>
                        </div>
                        <div class="button">
                            <input type="text" class="head-search" placeholder="Search" />
                            <button class="btn btn-sm btn-success" @click="() => doAddOrEdit()"> Add Participant</button>
                        </div>
                    </div>
                    <table class="content-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="4">
                        <span v-if="isLoading">Ooops</span>
                        <span v-else>You don’t have participants</span>
                    </td>
                </tr>
                <tr v-else v-for="(item, index) in data" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.phone}}</td>
                    <td>{{item.address}}</td>
                    <td class="button-action" width="20%">
                        <button class="btn btn-sm btn-info" @click="() => doAddOrEdit(item)">Edit</button>
                        <button class="btn btn-sm btn-danger" @click="() => doDelete(item)">Delete</button>
                    </td>
                </tr>
                </tbody>
            </table>


                </div>
            </div>
        </div>
            
        </div>

        <form v-else class="form-participant" @submit="doSave">
            <div class="box">
                <div class="form-add">
                     <h2 class="form-participant-heading">
                      {{participant.id ? "Change participant" : "Add new participant"}}
                     </h2>
                     <br>
                     <br>
                     <label> Insert Full Name</label>
                      <input v-model="participant.name" type="text" placeholder="Full Name" autofocus
                            class="form-control" :class="{'is-invalid': hasSubmit && participant.name.length === 0}"/>
                      <label> Phone Number</label>
                      <input v-model="participant.phone" type="text" placeholder="Phone Number"
                            class="form-control" :class="{'is-invalid': hasSubmit && participant.phone.length === 0}"/>
                      <label>Address</label>
                      <textarea v-model="participant.address" type="text" placeholder="Address"
                                class="form-control" :class="{'is-invalid': hasSubmit && participant.address.length === 0}"/>
                      <br>
                      <div class="btn-submit text-lg-right">
                          <button class="btn btn-m btn-dark" type="button" @click="doReset">Cancel</button>
                          <button class="btn btn-m btn-primary" type="submit"> Simpan
                              <template v-if="isLoading">
                                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                  <span class="sr-only">Loading...</span>
                              </template>
                              <template v-else>
                                  <span v-if="participant.id">Update</span>
                                  <span v-else>Save</span>
                              </template>
                          </button>
                      </div>
                   </div>
               </div>
        </form>
    </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import axios from "axios";


  import Participant from '../entity/Participant';
  import User from "../entity/User";

  @Component({name: "participant-page"})
  export default class ParticipantPage extends Vue {

    public data: Array<Participant> = [];

    public participant: Participant | null = null;

    public isLoading: boolean = false;

    public hasSubmit: boolean = false;

    public get isValid(): boolean {
      return this.participant != null && this.participant.name !== "" && this.participant.phone !== "" && this.participant.address !== "";
    }

    public mounted() {
      this.doReset();
    }

    public doReset() {
      this.hasSubmit = false;
      this.isLoading = false;

      this.participant = null;

      this.doFind();
    }

    public doFind() {
      this.isLoading = true;

      //@ts-ignore
      const user: User = this.$doCookieOperation("session");

      axios.get("http://192.168.0.152:9000/participants", {
        headers: {"Authorization": user.token}
      }).then((response) => {
        if (response.data.status == "200" && Array.isArray(response.data.data)) {
          this.data = response.data.data;
        }
      }).finally(() => {
        this.isLoading = false;
      });
    }

    public doAddOrEdit(participant?: Participant) {
      this.participant = participant ? participant : new Participant();
    }

    public doDelete(participant: Participant) {
      if (!this.isLoading && participant.id) {
        if (confirm("are you sure to delete " + participant.name + " ?")) {
          this.isLoading = true;

          //@ts-ignore
          const user: User = this.$doCookieOperation("session");

          axios.delete("http://192.168.0.152:9000/participants/" + participant.id, {
            headers: {"Authorization": user.token}
          }).then(() => {
            this.$notify({
              group: 'default',
              type: 'success',
              title: 'Participant',
              text: 'Success!'
            });

            this.doReset();
          }).catch((error) => {
            this.$notify({
              group: 'default',
              type: 'error',
              title: 'Participant',
              text: error.toString()
            });
          });
        }
      }
    }

    public doSave(event: Event): void {
      event.preventDefault();

      this.hasSubmit = true;

      if (!this.isLoading && this.participant != null) {
        if (this.isValid) {
          this.isLoading = true;

          //@ts-ignore
          const user: User = this.$doCookieOperation("session");

          axios.request({
            url: "http://192.168.0.152:9000/participants",
            method: this.participant.id ? "PUT" : "POST",
            headers: {"Authorization": user.token},
            data: this.participant,
          }).then(() => {
            this.$notify({
              group: 'default',
              type: 'success',
              title: 'Participant',
              text: 'Success!'
            });

            this.doReset();
          }).catch((error) => {
            this.$notify({
              group: 'default',
              type: 'error',
              title: 'Participant',
              text: error.toString()
            });
          });
        } else {
          this.$notify({
            group: 'default',
            type: 'error',
            title: 'Participant',
            text: 'Please fill all field'
          });
        }
      }
    }

  }
</script>


<style scoped lang="scss">

@import url('https://fonts.googleapis.com/css?family=Montserrat:500&display=swap');
* {
    margin : 0;
    padding : 0;
    box-sizing: border-box;
    list-style: none;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
}
.participant{
    // padding: 0px;
    // margin: 0px;
    background-color: rgb(60, 196, 196);
}
.table-wrapper{
    display: flex;
    position: relative;
}
.table-wrapper .sidebar{
    width: 250px;
    height: 100%;
    background: antiquewhite;
    padding: 30px 0px;
    position: fixed;
}
.table-wrapper .sidebar .brand{
    color: whitesmoke;
    display: block;
    margin-left: 1.2em;
    margin-right: 0.9em;
    margin-bottom: 4em;
}
.table-wrapper .sidebar img{
    height:30px;

}
.table-wrapper .sidebar ul li {
    padding: 20px;
}
.table-wrapper .sidebar ul li.active a{
color:brown;
}
.table-wrapper.sidebar ul li a{
    color: rgb(60, 196, 196);
    display: block;   
}
.table-wrapper .sidebar ul li:hover{
    background-color:brown;;
}
.table-wrapper .sidebar ul li:hover a{
   color:white ;   
}
.table-wrapper .main_content{
    width: 100%;
    margin-left: 260px;
}
.table-wrapper .main_content .container{
    margin: 60px;
    line-height: 25px;
    color:black; 
}
.table-wrapper .main_content .container div{
    margin-bottom: 30px;
}
.container .semua{
    background-color: white;
    border-radius: 7px;
    position: relative;
    padding-bottom: 30px ;
}
.container .semua .header-table{
    background : antiquewhite;
    height: 80px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
}
.container .title{
    float: left;
    height: inherit;
    padding:21px;
}
.container .button{
    float: right;
    width: 50%;
    padding : 21px;
    list-style: none;
    height: inherit;
    display: flex;
    flex-direction: row;
}
.header-table .button input {
    height: 40px;
    margin-bottom: 20px ;
    border: 1px solid antiquewhite;
    width: 80%;
    border-radius: 5px;
    padding-left: 1rem;
    transition: box-shadow 0.5s ease;
    margin-left: 15px;  
}
.header-table .button input::placeholder{
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: brown;
    font-weight: bold;
}
.header-table .button button {
    height: 40px;
    width: 70%;
    border-radius: 5px;
    padding:auto;
    color: white;
    background-color: rgb(60, 196, 196);
    border: none;
    font-size: none;
    font-weight: bold;
    cursor: pointer;
    transition: box-shadow 0.5s ease;
}
.header-table .button button:hover{
    box-shadow: 0px 0px 10px brown;
    background-color: aqua;
}
.container .title h2{
    margin :9px;
    color: black;
}
.content-table{
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 0.9em;
    min-width: 400px;
    background-color: white;
    overflow: hidden;
}
.content-table thead tr {
    text-align: left;
}

.form-participant .form-add {
    display: flex;
    flex-direction: column;
    width: 70%;
}
.form-participant .box .form-add{
    margin-left:10%;
}
.form-participant .form-add input{
    height: 40px;
    margin-bottom: 20px;
    margin-top: 10px;
    border: 1px solid lightgray;
    width: 80%;
    border-radius: 5px;
    padding-left: 1rem;
    transition: box-shadow 0.5s ease;
}
.form-participant .form-add textarea{
    height: 40px;
    margin-bottom: 20px;
    margin-top: 10px;
    border: 1px solid lightgray;
    width: 80%;
    border-radius: 5px;
    padding-left: 1rem;
    transition: box-shadow 0.5s ease;
}
.form-participant .form-add input:focus{
    box-shadow: 0px 0px 10px lightseagreen;
    
}
.form-participant .form-add textarea:focus{
    box-shadow: 0px 0px 10px lightseagreen;
}
.form-participant .form-add input::placeholder{
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    color: darkgrey;
}
.form-participant .form-add textarea::placeholder{
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    color: darkgrey;
}
.form-participant .form-add button{
    margin-left: 10%;
    background-color:antiquewhite; ;
    padding: 9px;
    width: 130px;
    border-radius: 5px;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    color:black;
    font-weight: bold;
    cursor: pointer;
    transition: box-shadow 0.5s ease;
    border: none;
    text-decoration: none;
    } 
</style>