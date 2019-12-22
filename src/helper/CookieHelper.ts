import Vue from 'vue';
import Cookies from 'js-cookie';

/**
 * Hanya digunakan di router/index.ts dan main.ts
 * ketika dicomponent, maka gunakan this.$root.doCookieOperation
 * @param key
 * @param value
 */
export default function doCookieOperation(key: string, value?: any): any {
  // remove cookie ketika parameter value bernilai null
  if (value === null) {
    if (key === "session") {
      // dynamic prototyping property for all vue instance
      Vue.prototype.$isLogin = false;
    }

    return Cookies.remove(key);
  }

  // add cookie ketika parameter value tidak null dan tidak undefined
  if (value) {
    if (key === "session") {
      // dynamic prototyping property for all vue instance
      Vue.prototype.$isLogin = true;
    }

    return Cookies.set(key, JSON.stringify(value));
  }

  let result: any = Cookies.get(key);
  result = result ? JSON.parse(result) : null;

  if (key === "session") {
    // dynamic prototyping property for all vue instance
    Vue.prototype.$isLogin = result;
  }

  // default is return object di cookie atau null jika belum ada
  return result;

}