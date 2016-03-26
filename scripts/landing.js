//refactored Javascript in JQuery
/*
var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
    var transformValue = "scaleX(1) translateY(0)";
                
    var revealPoints = function() {
        for (i = 0; points.length > i; i++) {
            points[i].style.opacity = 1;
            points[i].style.transform = transformValue
            points[i].style.msTransform = transformValue
            points[i].style.WebkitTransform = transformValue
        };
    };

    revealPoints();
};
*/

var animatePoints = function() {
    
    var revealPoint = function() {
       
        $(this).css({
            opacity: 1,
            transform: "scaleX(1) translateY(0)"
        });
    };
    
    $.each($(".point"), revealPoint);
};
   
/*
window.onload = function() { 
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    };
    
    window.addEventListener('scroll', function(event) { 
        if (pointsArray[0].getBoundingClientRect().top <= 500) {
            animatePoints(pointsArray);
        };
*/

//automatically animates the point on a tall screen where scrolling can't trigger the animation   
$(window).load(function() {
    if ($(window).height() > 950) {
        animatePoints();
    }
    
    $(window).scroll(function(event) {
        if ($(window).scrollTop() >= 500) {
            animatePoints();
        }
    });  
});