const horizontal_offset = 10;
const vertical_offset = 25 + 50;
const block_width = 45;
const block_height = 35;
const block_stroke_width = 3;
const max_factor = 80;
const min_factor = -20;
const text_h_offset = 10;
const text_v_offset = block_height;
const numbers = [-10, 15, 14, 13, 12, 1, 1, 9, 15, -5, 6, 5, 4, 3, 300, 1];
const sx = 20;
const sy = 100;
const animation_duration = 400;
const duration_increment = 800;
const length_factor = 3;

const clr_darker = "#0d335d";
const clr_dark =  "#1a508b";
const clr_lite = "#c1a1d3";
const clr_liter =  "#fff3e6"


var snp;
var texts;
var rects;
var duration = 0;


$(document).ready(() => {


    snp = Snap("#main-svg");
    let sy = 100;
    let positions = init(snp);
    $("#start-btn").click(() =>{
            duration = 0;
            merge_sort(0, 15, positions, sy , (sy + text_v_offset))
        }
    );

})


function init(snp){

    rects = [];
    texts = [];
    let positions = [];
    for(let i = 0; i < 16; ++i){
        let factor = Math.max(min_factor, Math.min(max_factor, length_factor * numbers[i]));

        let rect = snp.rect(sx + i * (block_width + horizontal_offset),
            sy  -  factor,
            block_width, block_height + factor);

        rect.attr({
            fill: "#1a508b",
            stroke: "green",
            strokeWidth: block_stroke_width
        })

        let text = snp.text(sx + i * (block_width + horizontal_offset) + text_h_offset, 
            sy + text_v_offset, numbers[i] );

        text.attr({fill: "white"})

        rects.push(rect);
        texts.push(text);
        positions.push({
            rectX: sx + i * (block_width + horizontal_offset),
            rectY: sy,
            textX: sx + i * (block_width + horizontal_offset) + text_h_offset,
            textY: sy + text_v_offset
        });
    }

    return positions;
}
    


function move_down(l, r, rectY, textY){

    let tempRect = rects.slice(l, r + 1);
    let tempText = texts.slice(l, r + 1);

    rectY = rectY + vertical_offset + block_height;
    textY = textY + vertical_offset + block_height;
    

    setTimeout( () => {
        for(let i = l; i <= r; ++ i){
            let factor =  parseInt(tempRect[i - l].attr("height")) - block_height;
            tempRect[i - l].animate({y: rectY - factor}, animation_duration, mina.linear);
            tempText[i - l].animate({y: textY}, animation_duration, mina.linear);
        }
    }, duration);
    
    return {rectY: rectY, textY: textY};
}


function color_stroke_range(l, r, color){

    let tempRect = rects.slice(l, r + 1);
    setTimeout( 
        () => tempRect.forEach(rect => rect.attr({stroke: color})),
        duration);
}

function color_stroke(element, color){
    setTimeout( 
        () => element.attr({stroke: color}),
        duration);
}


function move(element, newX, newY, isText){

    setTimeout( () => element.animate({
            x: newX,
            y: newY - ( (isText) ? (parseInt(element.attr("height")) - block_height) : 0 )
    }, animation_duration, mina.easeinout), duration);
}

 
function merge_sort(l, r, org, rectY, textY){
    if(l>=r)
        return;
  

    color_stroke_range(l, r, "red");
    duration += duration_increment / 2;

    let obj = move_down(l, r, rectY, textY);
    duration += duration_increment;
    rectY = obj.rectY;
    textY = obj.textY;

    color_stroke_range(l, r, "green");
    duration += duration_increment / 2;

    
    let m = (l + Math.floor((r-l)/2)) | 0;

    let org_left = [];
    let org_right = [];


    for(let i = 0; i < org.length; ++i){
        org_left.push({
            rectX: org[i].rectX, 
            textX: org[i].textX, 
            rectY: rectY,
            textY: textY
        })

        org_right.push({
            rectX: org[i].rectX, 
            textX: org[i].textX, 
            rectY: rectY,
            textY: textY
        })
    }

    merge_sort(l,m,  org_left, rectY, textY)
    merge_sort(m+1,r, org_right, rectY, textY);
    

    merge(l, m, r, org);

}


function merge(l, m, r, org){

    let n1 = m - l + 1;
    let n2 = r - m;
    

    let L_rects = [], R_rects = [];
    let L_texts = [], R_texts = [];
    let Lnums = [], Rnums = [];

    for (let i = 0; i < n1; i++){
        L_rects.push(rects[l + i]);
        L_texts.push(texts[l + i]);
        Lnums.push(numbers[l + i]);
    }
    for (let j = 0; j < n2; j++){
        R_rects.push(rects[m + 1 + j]);
        R_texts.push(texts[m + 1 + j]);
        Rnums.push(numbers[m + 1 + j]);
    }

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {

        let left = L_rects[i];
        let right = R_rects[j];

        color_stroke(left, "red");
        color_stroke(right, "red");
        duration += duration_increment / 2;

        if (Lnums[i] <= Rnums[j]) {
            
            move(L_rects[i], org[k].rectX, org[k].rectY, true);
            move(L_texts[i], org[k].textX, org[k].textY, false);
            duration += duration_increment;
            
            rects[k] = L_rects[i];
            texts[k] = L_texts[i];
            numbers[k] = Lnums[i];
            i++;
        }
        else {
            move(R_rects[j], org[k].rectX, org[k].rectY, true);
            move(R_texts[j], org[k].textX, org[k].textY, false);
            duration += duration_increment;

            rects[k] = R_rects[j];
            texts[k] = R_texts[j];
            numbers[k] = Rnums[j];
            j++;
        }

        color_stroke(left, "green");
        color_stroke(right, "green");
        duration += duration_increment / 2;

        k++;
    }

    while (i < n1) {

        color_stroke(L_rects[i], "red");
        duration += duration_increment / 2;

        move(L_rects[i], org[k].rectX, org[k].rectY, true);
        move(L_texts[i], org[k].textX, org[k].textY, false);
        duration += duration_increment;

        color_stroke(L_rects[i], "green");
        duration += duration_increment / 2;

        rects[k] = L_rects[i];
        texts[k] = L_texts[i];
        numbers[k] = Lnums[i];
        i++;
        k++;
    }

    while (j < n2) {

        color_stroke(R_rects[j], "red");
        duration += duration_increment / 2;

        move(R_rects[j], org[k].rectX, org[k].rectY, true);
        move(R_texts[j], org[k].textX, org[k].textY, false);
        duration += duration_increment;

        color_stroke(R_rects[j], "green");
        duration += duration_increment / 2;

        rects[k] = R_rects[j];
        texts[k] = R_texts[j];
        numbers[k] = Rnums[j];
        j++;
        k++;
    }
}
