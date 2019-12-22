<template>
    <div id="app">
        <!-- <div v-if="$isLogin" id="nav"> -->
            <!-- <router-link v-if="$route.path !== '/home'" to="/home">Home</router-link>
            <router-link v-if="$route.path !== '/about'" to="/about">About</router-link>
            <router-link v-if="$route.path !== '/note'" to="/note">Note</router-link> -->
        <!-- </div> -->
        <router-view></router-view>
    </div>
        <!-- <notifications group="default" /> -->
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:500&display=swap');
</style>
