// Dynamically load MathJax if educational mode is enabled
(function loadMathJax(){
    if(window.MathJax) return;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    s.defer = true;
    document.head.appendChild(s);
})();
