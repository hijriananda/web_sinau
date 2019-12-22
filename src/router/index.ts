import Vue from 'vue';
import VueRouter, {Route, RouteRecord} from 'vue-router';

import Participant from '../views/Participant.vue';
import User from "../entity/User";
import doCookieOperation from "../helper/CookieHelper";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
  {
    path: '/',
    name: 'login',
    meta: {deniedForAuth: true},
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  }, {
    path: '/participant',
    name: 'participant',
    meta: {requiredAuth: true},
    component: () => import(/* webpackChunkName: "home" */ '../views/Participant.vue')
  }, 
  // {
  //   path: '/about',
  //   name: 'about',
  //   meta: {requiredAuth: true},
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }, 
  // {
  //   path: '/note',
  //   name: 'note',
  //   meta: {requiredAuth: true},
  //   component: () => import(/* webpackChunkName: "note" */ '../views/Note.vue')
  // }
  ]
});

/**
 * Router middleware to validate auth user to access page
 */
router.beforeEach((to: Route, from: Route, next: Function) => {
  const user: void | null | User = doCookieOperation("session");

  const requiredAuth: boolean = to.matched.some((record: RouteRecord) => record.meta.requiredAuth);
  const deniedForAuth: boolean = to.matched.some((record: RouteRecord) => record.meta.deniedForAuth);

  if (requiredAuth && (!user || !user.token)) {
    return next({path: `/`});
  } else if (deniedForAuth && user) {
    return next({path: `/participant`});
  }

  return next();
});

export default router;