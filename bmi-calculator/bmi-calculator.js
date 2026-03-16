document.addEventListener('DOMContentLoaded', function() {
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');
    const bmiValue = document.getElementById('bmiValue');
    const bmiInterpretation = document.getElementById('bmiInterpretation');
    const exerciseLink = document.getElementById('exerciseLink');

    bmiForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const sex = document.getElementById('sex').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m

        if (!sex || !weight || !height) {
            alert('Te rugăm să completezi toate câmpurile!');
            return;
        }

        // Calculate BMI
        const bmi = weight / (height * height);
        const roundedBMI = bmi.toFixed(1);

        // Display result
        bmiValue.textContent = roundedBMI;
        bmiResult.classList.add('show');

        // Determine category and color
        let category, interpretation, showExerciseLink = false;

        if (bmi < 18.5) {
            category = 'good';
            interpretation = 'Subponderal - Ai un BMI sub normal. Consideră consultarea unui specialist.';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'good';
            interpretation = 'Normal - Ai un BMI în intervalul normal. Continuă să menții un stil de viață sănătos!';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'warning';
            interpretation = 'Supraponderal - Ai un BMI ușor peste normal. Consideră exerciții fizice regulate și o alimentație echilibrată.';
        } else {
            category = 'danger';
            interpretation = 'Obezitate - Ai un BMI peste normal. Este recomandat să consulți un specialist și să începi un program de exerciții.';
            showExerciseLink = true;
        }

        // Apply styling
        bmiResult.className = 'bmi-result show ' + category;
        bmiInterpretation.textContent = interpretation;

        // Show exercise link if needed
        if (showExerciseLink) {
            exerciseLink.style.display = 'inline-block';
        } else {
            exerciseLink.style.display = 'none';
        }
    });
});

