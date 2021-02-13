


$(document).ready(() => {


    var snp = Snap("#svg");
    
    var recl = snp.rect(100, 100, 50, 120);
    var recr = snp.rect(180, 100, 50, 120);
    recl.attr({
        stroke: "red",
        strokeWidth: "2",
        fill: "blue"
    })

    recr.attr({
        stroke: "yellow",
        strokeWidth: "2",
        fill: "green"
    })

    
    recl.click( () => swap(recl, recr) )
    recr.click(() => {
        let x = parseInt(recr.attr("x"));
        recr.animate({x: x + 10}, 100)
    });
})

    

function swap(el1, el2){
    let lx = el1.attr("x");
    let rx = el2.attr("x");
    let duration = 200;

    el1.animate({x:rx}, duration);
    el2.animate({x:lx}, duration);
}   