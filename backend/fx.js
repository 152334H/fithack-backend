.map(d => {
    const cat = typeof d.category === "string" ? [d.category] : d.category;
    return {name: d.name, id: d.id, category: cat, price: +d.price.USD.default, image: d.image.split("/").pop()}
})
