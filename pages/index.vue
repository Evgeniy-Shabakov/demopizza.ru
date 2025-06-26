<script setup>
const route = useRoute();

//нужно для внешней ссылки для установки приложения http://demopizza.ru/?install=true
//т.к. только на главной страницы с большей вероятностью сработает beforeinstallprompt
if (route.query.install) navigateTo('/install')

</script>

<template>
</template>
