// 1. Просто передаем все запросы в сеть (кеша нет, буду добавлять позже когда разберусь)
self.addEventListener('fetch', (event) => {
   event.respondWith(fetch(event.request));
});