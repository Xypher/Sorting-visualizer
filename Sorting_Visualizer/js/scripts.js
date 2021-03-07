const horizontal_offset = 10;
const vertical_offset = 25 + 70;
const block_width = 45;
const block_height = 35;
const block_stroke_width = 3;
const max_factor = 80;
const min_factor = -20;
const text_h_offset = 10;
const text_v_offset = block_height;

const sx = 20;
const sy = 100;
const animation_duration = 200;
const duration_increment = 400;
const length_factor = 1.5;

const clr_darker = "#0d335d";
const clr_dark =  "#1a508b";
const clr_lite = "#c1a1d3";
const clr_liter =  "#fff3e6"

var default_numbers = [-10, 15, 14, 13, 12, 1, 1, 9, 15, -5, 6, 5, 4, 3, 300, 1];
var snp;
var texts = [];
var rects = [];
var duration = 0;
var numbers = [-10, 15, 14, 13, 12, 1, 1, 9, 15, -5, 6, 5, 4, 3, 300, 1];
var number_of_elements = 16;
var timeouts = [];
var algorithm = 'merge';

$(document).ready(() => {


    snp = Snap("#main-svg");
    number_of_elements = 10;
    duration = 0;

    let sy = 100;
    
    init();

    $("input:radio[name=number-of-elements]").change(function() {reset(this.value);})
    $("#algorithm-select").change(function() { 
        algorithm = this.value;
        reset(number_of_elements);
    })

    $("#speed-select").change(function() { 
        change_animation_speed(this.value);
    })

    $('#random-btn').click(() => {
        default_numbers = default_numbers.map(num => Math.floor(Math.random() * 100))
        
        numbers = default_numbers.slice(0, number_of_elements);
        reset(number_of_elements);
    })

    $("#start-btn").click(() =>{
            let positions = reset(number_of_elements);
            //
            
            switch(algorithm){

                case 'merge':
                    merge_sort(0, numbers.length - 1, positions, sy , (sy + text_v_offset))
                    break;
                
                case 'selection':
                    selection_sort();
                    break;
            }
        }
    );

})



function change_animation_speed(value){

    switch(value){
        
        case 'slow':
            animation_duration = 650;
            duration_increment = 1200;
            break;    

        case 'medium':
            animation_duration = 400;
            duration_increment = 800;
            break; 
        
        case 'fast':
            animation_duration = 250;
            duration_increment = 500;
            break; 
    }

    reset(number_of_elements);
}


function reset(value){

    duration = 0;
    number_of_elements = parseInt(value);
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
    
    if(number_of_elements > numbers.length){
        numbers = [...numbers, ...default_numbers.slice(numbers.length, number_of_elements)]; 
    }
    else{
        numbers = numbers.slice(0, number_of_elements);
    }

    return init();
}

function init(){

    if(rects.length !== 0){
        rects.forEach(rect => {
            rect.attr({x: 3000});
        });
    
        texts.forEach(text => {
            text.attr({x: 3000});
        });
    
    }
    rects = [];
    texts = [];
    let positions = [];
    for(let i = 0; i < number_of_elements; ++i){
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

        rect.click(() => {
   
            $("#rect-number-input").val(numbers[i]);
            $("#change-number-button").click(() =>{
                let num = $("#rect-number-input").val();
                if(num == "") // if the number entered by the user is empty
                    return;

                numbers[i] =  parseInt(num); // change the number[i] to the number entered by the user
                text.attr({text: num});//change the text of the number[i] to the number entered by the user
                $("#number-change-modal").modal('hide'); // hide the modal
                reset(number_of_elements);
            })
            $("#number-change-modal").modal('show'); // show the modal with the corresponding data of the rect
        });
    }

    return positions;
}
    


function move_down(l, r, rectY, textY){

    let tempRect = rects.slice(l, r + 1);
    let tempText = texts.slice(l, r + 1);

    rectY = rectY + vertical_offset + block_height;
    textY = textY + vertical_offset + block_height;
    

    timeouts.push( setTimeout( () => {
        for(let i = l; i <= r; ++ i){
            let factor =  parseInt(tempRect[i - l].attr("height")) - block_height;
            tempRect[i - l].animate({y: rectY - factor}, animation_duration, mina.linear);
            tempText[i - l].animate({y: textY}, animation_duration, mina.linear);
        }
    }, duration) );
    
    return {rectY: rectY, textY: textY};
}


function color_stroke_range(l, r, color){

    let tempRect = rects.slice(l, r + 1);
    timeouts.push( setTimeout( 
        () => tempRect.forEach(rect => rect.attr({stroke: color})),
        duration) );
}

function color_stroke(element, color){
    timeouts.push( setTimeout( 
        () => element.attr({stroke: color}),
        duration) );
}


function move(element, newX, newY, isText){

   timeouts.push( setTimeout( () => element.animate({
            x: newX,
            y: newY - ( (isText) ? (parseInt(element.attr("height")) - block_height) : 0 )
    }, animation_duration, mina.easeinout), duration) );
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


function swap(idx1, idx2){

    let rect1 = rects[idx1], rect2 = rects[idx2];
    let text1 = texts[idx1], text2 = texts[idx2];
    

    timeouts.push( setTimeout( () => {
        rect1.animate({y: parseInt(rect1.attr("y")) + block_height + vertical_offset}
        ,animation_duration);
        
        rect2.animate({y: parseInt(rect2.attr("y")) + block_height + vertical_offset}
        ,animation_duration);
        
        text1.animate({y: parseInt(text1.attr("y")) + block_height + vertical_offset}
        ,animation_duration);
        
        text2.animate({y: parseInt(text2.attr("y")) + block_height + vertical_offset}
        ,animation_duration);

    }, duration) );


    timeouts.push( setTimeout( () => {
        let x1 = parseInt(rect1.attr("x"));
        let x2 = parseInt(rect2.attr("x"));

        rect1.animate({x: x2}
        ,animation_duration);
        
        rect2.animate({x: x1}
        ,animation_duration);
        
        text1.animate({x: x2 + text_h_offset}
        ,animation_duration);
        
        text2.animate({x: x1 + text_h_offset}
        ,animation_duration);
        
    }, duration + duration_increment) );

    
    timeouts.push( setTimeout( () => {
        rect1.animate({y: parseInt(rect1.attr("y")) - block_height - vertical_offset}
        ,animation_duration);
        
        rect2.animate({y: parseInt(rect2.attr("y")) - block_height - vertical_offset}
        ,animation_duration);
        
        text1.animate({y: parseInt(text1.attr("y")) - block_height - vertical_offset}
        ,animation_duration);
        
        text2.animate({y: parseInt(text2.attr("y")) - block_height - vertical_offset}
        ,animation_duration);

    }, duration + 2 * duration_increment) );

    let temp = numbers[idx2];
    numbers[idx2] = numbers[idx1];
    numbers[idx1] = temp;

    temp = rects[idx1];
    rects[idx1] = rects[idx2];
    rects[idx2] = temp;

    temp = texts[idx1];
    texts[idx1] = texts[idx2];
    texts[idx2] = temp;

    
}

function selection_sort() { 
    let min_index; 
    let n = number_of_elements;

    for (let i = 0; i < n-1; i++) { 
        color_stroke(rects[i], "orange");
        duration += duration_increment / 2;
        min_index = i; 
        for (let j = i+1; j < n; j++){
            color_stroke(rects[j], "red");
            duration += duration_increment / 2;
            if (numbers[j] < numbers[min_index]){
                color_stroke(rects[min_index], "green");
                duration += duration_increment / 2;

                color_stroke(rects[j], "orange");
                duration += duration_increment / 2;
                min_index = j;
            }

            else{
                color_stroke(rects[j], "green");
                duration += duration_increment / 2;
                
            }
        }
        

        if(min_index !== i){
            swap(min_index, i); 
            duration += duration_increment * 3;
        }
        color_stroke(rects[i], "grey");
        duration += duration_increment / 2;
    } 

    color_stroke(rects[n - 1], "grey");
    duration += duration_increment / 2;
} 