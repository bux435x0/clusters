const square = document.getElementById('square');
let angle = 0;

function rotateSquare() {
    angle += 1;
    square.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(rotateSquare);
}

rotateSquare();
