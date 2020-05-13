
module.exports = {
    getSalePage(request, response) {
        response.render('sale', {
            title: 'Sale',
            layout: 'salePage',
            titlePage:'Акции!'
        });
    }
};
