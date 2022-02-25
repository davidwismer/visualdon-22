const rect = document.querySelector(".rect");
const donut = document.querySelector(".donut");

rect.addEventListener("click", evt =>{
    if(rect.style.fill == "red"){
        rect.style.fill = "blue";
    }else{
        rect.style.fill = "red";
    }
})

donut.addEventListener("mouseenter", evt => {
    donut.querySelector(".ext").setAttribute("r", "70");
})
donut.addEventListener("mouseover", evt => {
    donut.querySelector(".ext").setAttribute("r", "60");
})