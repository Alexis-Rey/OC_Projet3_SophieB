export function filterWorks(works,word){

    const worksFiltered = works.filter(function(works){
        return works.category.name === word;
    })
    return worksFiltered;
};








