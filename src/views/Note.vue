<template>
    <div class="note">
        <h1>Todo Notes</h1>

        <div v-if="!note" class="table-wrapper">
            <button class="btn btn-sm btn-success" @click="() => doAddOrEdit()">Add</button>
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Content</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="data.length === 0">
                    <td colspan="4">
                        <span v-if="isLoading">Memuat data...</span>
                        <span v-else>No data found</span>
                    </td>
                </tr>
                <tr v-else v-for="(item, index) in data" :key="index">
                    <td>{{item.title}}</td>
                    <td>{{item.description}}</td>
                    <td>{{item.content}}</td>
                    <td class="button-action" width="20%">
                        <button class="btn btn-sm btn-info" @click="() => doAddOrEdit(item)">Edit</button>
                        <button class="btn btn-sm btn-danger" @click="() => doDelete(item)">Delete</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <form v-else class="form-note" @submit="doSave">
            <h2 class="form-note-heading">
                {{note.id ? "Change note" : "Add new note"}}
            </h2>
            <input v-model="note.title" type="text" placeholder="Title" autofocus
                   class="form-control" :class="{'is-invalid': hasSubmit && note.title.length === 0}"/>
            <input v-model="note.description" type="text" placeholder="Description"
                   class="form-control" :class="{'is-invalid': hasSubmit && note.description.length === 0}"/>
            <textarea v-model="note.content" type="text" placeholder="Content here"
                      class="form-control" :class="{'is-invalid': hasSubmit && note.content.length === 0}"/>
            <div class="btn-submit text-lg-right">
                <button class="btn btn-m btn-dark" type="button" @click="doReset">Cancel</button>
                <button class="btn btn-m btn-primary" type="submit">
                    <template v-if="isLoading">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span class="sr-only">Loading...</span>
                    </template>
                    <template v-else>
                        <span v-if="note.id">Update</span>
                        <span v-else>Save</span>
                    </template>
                </button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import axios from "axios";

  import Note from "../entity/Note";
  import User from "../entity/User";

  @Component({name: "note-page"})
  export default class NotePage extends Vue {

    public data: Array<Note> = [];

    public note: Note | null = null;

    public isLoading: boolean = false;

    public hasSubmit: boolean = false;

    public get isValid(): boolean {
      return this.note != null && this.note.title !== "" && this.note.description !== "" && this.note.content !== "";
    }

    public mounted() {
      this.doReset();
    }

    public doReset() {
      this.hasSubmit = false;
      this.isLoading = false;

      this.note = null;

      this.doFind();
    }

    public doFind() {
      this.isLoading = true;

      //@ts-ignore
      const user: User = this.$doCookieOperation("session");

      axios.get("http://192.168.0.152:9000/notes", {
        headers: {"Authorization": user.token}
      }).then((response) => {
        if (response.data.status == "200" && Array.isArray(response.data.data)) {
          this.data = response.data.data;
        }
      }).finally(() => {
        this.isLoading = false;
      });
    }

    public doAddOrEdit(note?: Note) {
      this.note = note ? note : new Note();
    }

    public doDelete(note: Note) {
      if (!this.isLoading && note.id) {
        if (confirm("are you sure to delete " + note.title + " ?")) {
          this.isLoading = true;

          //@ts-ignore
          const user: User = this.$doCookieOperation("session");

          this.handleResponse(axios.delete("http://192.168.0.152:9000/notes/" + note.id, {
            headers: {"Authorization": user.token}
          }));
        }
      }
    }

    public doSave(event: Event): void {
      event.preventDefault();

      this.hasSubmit = true;

      if (!this.isLoading && this.note != null) {
        if (this.isValid) {
          this.isLoading = true;

          //@ts-ignore
          const user: User = this.$doCookieOperation("session");

          this.handleResponse(axios.request({
            url: "http://192.168.0.152:9000/notes",
            method: this.note.id ? "PUT" : "POST",
            headers: {"Authorization": user.token},
            data: this.note,
          }));
        } else {
          this.$notify({
            group: 'default',
            type: 'error',
            title: 'Note',
            text: 'Please fill all field'
          });
        }
      }
    }

    public handleResponse(promise: Promise<any>) {
      promise.then(() => {
        this.$notify({
          group: 'default',
          type: 'success',
          title: 'Note',
          text: 'Success!'
        });

        this.doReset();
      }).catch((error) => {
        this.$notify({
          group: 'default',
          type: 'error',
          title: 'Note',
          text: error.toString()
        });
      });
    }
  }
</script>

<style lang="scss" scoped>
    .note {
        width: 80%;
        margin: 0 auto;

        h1 {
            text-align: center;
        }

        .table-wrapper {
            .btn-success {
                margin-bottom: 15px;
            }

            table {
                thead th:last-child {
                    text-align: center;
                }

                td {
                    padding-left: .75rem;
                    padding-right: .75rem;
                    vertical-align: middle;
                }

                td[colspan]:not([colspan="1"]) {
                    text-align: center;
                }

                .button-action {
                    text-align: center;

                    button {
                        margin: 5px;
                    }
                }
            }
        }

        .form-note {
            max-width: 80%;
            padding: 15px 35px 15px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid rgba(0, 0, 0, 0.1);

            .form-note-heading {
                margin-bottom: 20px;
            }

            .form-control {
                position: relative;
                font-size: 16px;
                height: auto;
                padding: 10px;

                &:focus {
                    z-index: 2;
                }
            }

            input, textarea {
                margin-bottom: 15px;
            }

            .btn-submit button {
                margin: 5px;
            }
        }
    }
</style>
