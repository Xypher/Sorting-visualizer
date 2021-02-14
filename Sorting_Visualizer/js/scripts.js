
const horizontal_offset = 10;
const vertical_offset = 25;
const block_width = 30;
const block_height = 60;
const text_h_offset = 10;
const text_v_offset = block_height;
const numbers = [16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const sx = 20;
const sy = 100;
var texts;
var rects;

$(document).ready(() => {


    var snp = Snap("#main-svg");
    let sx = 100;
    let sy = 100;
    


    init(snp);
    
})


function init(snp){

    rects = [];
    texts = [];
    for(let i = 0; i < 16; ++i){
        let rect = snp.rect(sx + i * (block_width + horizontal_offset), sy, block_width, block_height);
        let text = snp.text(sx + i * (block_width + horizontal_offset) + text_h_offset, 
            sy + text_v_offset, numbers[i] );
        text.attr({fill: "white"})
        rects.push(rect);
        texts.push(text);
    }
}
    

function swap(block1, block2){
    let lx_rect = block1.select("rect:nth-child(1)").attr("x");
    let lx_text = block1.select("text:nth-of-type(1)").attr("x");
    
    let rx_rect = block2.select("rect:nth-child(1)").attr("x");
    let rx_text = block2.select("text:nth-of-type(1)").attr("x");
    let duration = 200;

    block1.select("rect:nth-child(1)").animate({x: rx_rect}, duration);
    block2.select("rect:nth-child(1)").animate({x: lx_rect}, duration);

    block1.select("text:nth-of-type(1)").animate({x: rx_text}, duration);
    block2.select("text:nth-of-type(1)").animate({x: lx_text}, duration);
}   

function move_down(grp, rect_y, text_y){

    let duration = 300;
    rect_y = rect_y + vertical_offset + block_height;
    text_y = text_y + vertical_offset + block_height;
    grp.selectAll("rect").animate({y: rect_y}, duration);
    grp.selectAll("text").animate({y: text_y}, duration);
    

    return {rect_y: rect_y, text_y: text_y};
}


function move_up(grp, rect_y, text_y){

    let duration = 300;
    rect_y = rect_y - vertical_offset - block_height;
    text_y = text_y - vertical_offset - block_height;
    grp.selectAll("rect").animate({y: rect_y}, duration);
    grp.selectAll("text").animate({y: text_y}, duration);
    

    return {rect_y: rect_y, text_y: text_y};
}

void merge(int arr[], int l, int m, int r)
{
    int n1 = m - l + 1;
    int n2 = r - m;
 
    // Create temp arrays
    int L[n1], R[n2];
 
    // Copy data to temp arrays L[] and R[]
    for (int i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
 
    // Merge the temp arrays back into arr[l..r]
 
    // Initial index of first subarray
    int i = 0;
 
    // Initial index of second subarray
    int j = 0;
 
    // Initial index of merged subarray
    int k = l;
 
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
 
    // Copy the remaining elements of
    // L[], if there are any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
 
    // Copy the remaining elements of
    // R[], if there are any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}
 
// l is for left index and r is
// right index of the sub-array
// of arr to be sorted */
void mergeSort(int arr[],int l,int r){
    if(l>=r){
        return;//returns recursively
    }
    int m =l+ (r-l)/2;
    mergeSort(arr,l,m);
    mergeSort(arr,m+1,r);
    merge(arr,l,m,r);
}