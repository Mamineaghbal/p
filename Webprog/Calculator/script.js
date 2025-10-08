document.addEventListener('DOMContentLoaded', () => {
  let currentInput = '';
  const display = document.getElementById('display');

  // Number buttons
  document.querySelectorAll('.btn[data-number]').forEach(button => {
    button.addEventListener('click', () => {
      const num = button.getAttribute('data-number');
      currentInput += num;
      updateDisplay();
    });
  });

  // Operator buttons
  document.querySelectorAll('.btn[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
      const op = button.getAttribute('data-operator');
      currentInput += op;
      updateDisplay();
    });
  });

  // Clear button
  document.getElementById('clear').addEventListener('click', () => {
    currentInput = '';
    updateDisplay();
  });

  // Equals button — RADIANS mode
  document.getElementById('equals').addEventListener('click', () => {
    try {
      let expr = currentInput.trim();
      if (expr === '') {
        currentInput = 'Error';
        updateDisplay();
        return;
      }

      // Normalize decimal comma
      expr = expr.replace(/,/g, '.');

      // Replace symbols
      expr = expr
        .replace(/π/g, Math.PI)           // π → 3.14159...
        .replace(/sqr\(/g, 'Math.sqrt(')  // sqr(9) → Math.sqrt(9)
        .replace(/sin\(/g, 'Math.sin(')   // sin(x) → Math.sin(x)  [x in radians!]
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/×/g, '*')
        .replace(/\^/g, '**');

      // Handle implied multiplication (a(b) → a*(b), 2π → 2*π, etc.)
      expr = expr
        .replace(/(\d|\))(?=\()/g, '$1*')               // 2(3) → 2*(3)
        .replace(/(\d)(?=Math\.(?:sqrt|sin|cos|tan))/g, '$1*') // 2sin(π) → 2*Math.sin(π)
        .replace(/(\d)(?=\))/g, '$1')                   // no change needed
        .replace(/(\d)(?=\d)/g, '$1')                   // no change
        // Handle π cases
        .replace(/(\d)(?=Math\.PI)/g, '$1*')            // 2π → 2*Math.PI
        .replace(/Math\.PI(?=\d)/g, 'Math.PI*')         // π2 → Math.PI*2
        .replace(/(\))Math\.PI/g, ')*Math.PI')          // )π → )*Math.PI
        .replace(/Math\.PI(?=\()/g, 'Math.PI*');        // π( → Math.PI*(

      let result = eval(expr);

      if (!isFinite(result) || isNaN(result)) {
        throw new Error('Invalid');
      }

      currentInput = result.toString().replace(/\./g, ',');
      updateDisplay();
    } catch (error) {
      currentInput = 'Error';
      updateDisplay();
    }
  });

  // Function buttons — append function(
  document.getElementById('sin').addEventListener('click', () => {
    currentInput += 'sin(';
    updateDisplay();
  });

  document.getElementById('cos').addEventListener('click', () => {
    currentInput += 'cos(';
    updateDisplay();
  });

  document.getElementById('tan').addEventListener('click', () => {
    currentInput += 'tan(';
    updateDisplay();
  });

  document.getElementById('sqrt').addEventListener('click', () => {
    currentInput += 'sqr(';
    updateDisplay();
  });

  document.getElementById('power').addEventListener('click', () => {
    currentInput += '^';
    updateDisplay();
  });

  document.getElementById('pi').addEventListener('click', () => {
    currentInput += 'π';
    updateDisplay();
  });

  function updateDisplay() {
    display.value = currentInput;
  }
});