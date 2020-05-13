module.exports = {
    getHelpPage(request, response) {
        response.render('tableSize', {
            title: 'Table size',
            layout: 'salePage',
            titlePage:'Таблица размеров'
        });
    }
};
