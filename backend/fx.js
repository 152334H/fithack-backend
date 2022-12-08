.map(d => {
    const cat = typeof d.category === "string" ? [d.category] : d.category;
    /*
    while (cat.at(-1).indexOf('-') !== -1)
        cat.pop();
    */

    return {
        name: d.name, id: d.id,
        category: cat[0],//cat.at(-1),
        price: +d.price.USD.default,
        image: d.image.split("/").pop()
    }
})
