let currentStep = 1;
const totalSteps = 4;

function getCurrentUser() {
  try {
    var raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function nextStep(step) {
  if (!validateStep(currentStep)) {
    alert('Te rugăm să completezi toate câmpurile obligatorii!');
    return;
  }

  document.getElementById('step' + currentStep).classList.remove('active');
  var stepEl = document.querySelector('.step[data-step="' + currentStep + '"]');
  if (stepEl) {
    stepEl.classList.remove('active');
    stepEl.classList.add('completed');
  }

  currentStep = step;
  document.getElementById('step' + step).classList.add('active');
  stepEl = document.querySelector('.step[data-step="' + step + '"]');
  if (stepEl) stepEl.classList.add('active');

  var backButton = document.querySelector('#step' + step + ' .btn-secondary');
  if (backButton && step > 1) backButton.disabled = false;
}

function prevStep(step) {
  document.getElementById('step' + currentStep).classList.remove('active');
  var stepEl = document.querySelector('.step[data-step="' + currentStep + '"]');
  if (stepEl) stepEl.classList.remove('active');

  currentStep = step;
  document.getElementById('step' + step).classList.add('active');
  stepEl = document.querySelector('.step[data-step="' + step + '"]');
  if (stepEl) {
    stepEl.classList.add('active');
    stepEl.classList.remove('completed');
  }
}

function validateStep(step) {
  var form = document.getElementById('step' + step);
  if (!form) return true;
  var requiredInputs = form.querySelectorAll('input[required], select[required]');
  for (var i = 0; i < requiredInputs.length; i++) {
    if (!requiredInputs[i].value) return false;
  }
  return true;
}

function previewImage(input, previewId) {
  var preview = document.getElementById(previewId);
  if (!preview) return;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = '<img src="' + e.target.result + '" style="max-width: 200px; max-height: 200px; margin-top: 1rem; border-radius: 5px;">';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function loadProgressHistory() {
  var user = getCurrentUser();
  var notice = document.getElementById('progressLoginNotice');
  var historySection = document.getElementById('progressHistorySection');
  var historyList = document.getElementById('progressHistoryList');

  if (!user) {
    if (notice) notice.style.display = 'block';
    if (historySection) historySection.style.display = 'none';
    return;
  }

  if (notice) notice.style.display = 'none';

  if (!window.VitaFitAPI || !historyList) return;

  VitaFitAPI.getProgress(user.id)
    .then(function (records) {
      if (!records || records.length === 0) {
        if (historySection) {
          historySection.style.display = 'block';
          historyList.innerHTML = '<p class="loading-text">Nu ai încă nicio înregistrare. Completează formularul mai jos.</p>';
        }
        return;
      }
      if (historySection) historySection.style.display = 'block';
      historyList.innerHTML = '';
      records.forEach(function (r) {
        var dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString('ro-RO') : '';
        var weightStr = r.current_weight != null ? r.current_weight + ' kg' : '—';
        var targetStr = r.target_weight != null ? r.target_weight + ' kg' : '—';
        var contentBase = (window.VitaFitAPI && window.VitaFitAPI.contentBaseUrl) ? window.VitaFitAPI.contentBaseUrl : '';
        var photoUrl = function (path) {
          if (!path || typeof path !== 'string') return null;
          if (path.indexOf('data:') === 0) return path;
          return contentBase ? contentBase + '/content/' + encodeURIComponent(path) : null;
        };
        var thumb = '';
        var u = photoUrl(r.photo_front_url) || photoUrl(r.photo_side_url) || photoUrl(r.photo_back_url);
        if (u) thumb = '<img src="' + u.replace(/"/g, '&quot;') + '" alt="Fotografie progres" class="progress-history-thumb">';
        var card = document.createElement('div');
        card.className = 'progress-history-card';
        card.innerHTML =
          '<div class="progress-history-card-header">' +
          '<strong>' + dateStr + '</strong>' +
          '</div>' +
          '<div class="progress-history-card-body">' +
          (thumb ? '<div class="progress-history-thumbs">' + thumb + '</div>' : '') +
          '<p>Greutate: ' + weightStr + ' &rarr; Țintă: ' + targetStr + '</p>' +
          (r.height != null ? '<p>Înălțime: ' + r.height + ' cm</p>' : '') +
          (r.activity_level ? '<p>Activitate: ' + r.activity_level + '</p>' : '') +
          '</div>';
        historyList.appendChild(card);
      });
    })
    .catch(function () {
      if (historySection) historySection.style.display = 'block';
      if (historyList) historyList.innerHTML = '<p class="loading-text">Nu s-au putut încărca înregistrările.</p>';
    });
}

function submitProgress() {
  if (!validateStep(4)) {
    alert('Te rugăm să completezi toate câmpurile obligatorii!');
    return;
  }

  var user = getCurrentUser();
  if (!user || !user.id) {
    alert('Trebuie să fii conectat pentru a salva progresul. Te redirecționăm la Profil.');
    window.location.href = '../profil/profil.html';
    return;
  }

  var sleepInput = document.getElementById('sleep').value;
  var sleepVal = sleepInput ? parseFloat(sleepInput) : null;
  if (sleepVal != null && (sleepVal < 0 || sleepVal > 24)) {
    alert('Câte ore dormi pe noapte trebuie să fie între 0 și 24.');
    return;
  }

  if (!window.VitaFitAPI || !VitaFitAPI.postProgressFormData) {
    alert('Eroare: API negăsit.');
    return;
  }

  var formData = new FormData();
  formData.append('user_id', user.id);
  formData.append('current_weight', document.getElementById('currentWeight').value || '');
  formData.append('target_weight', document.getElementById('targetWeight').value || '');
  formData.append('bust', document.getElementById('bust').value || '');
  formData.append('talie', document.getElementById('talie').value || '');
  formData.append('solduri', document.getElementById('solduri').value || '');
  formData.append('coapse', document.getElementById('coapse').value || '');
  formData.append('age', document.getElementById('age').value || '');
  formData.append('height', document.getElementById('height').value || '');
  formData.append('activity_level', document.getElementById('activity').value || '');
  formData.append('sleep_hours', document.getElementById('sleep').value || '');
  formData.append('water_liters', document.getElementById('water').value || '');
  formData.append('meals_per_day', document.getElementById('meals').value || '');

  var photoFront = document.getElementById('photoFront');
  var photoSide = document.getElementById('photoSide');
  var photoBack = document.getElementById('photoBack');
  if (photoFront && photoFront.files && photoFront.files[0]) formData.append('photo_front', photoFront.files[0]);
  if (photoSide && photoSide.files && photoSide.files[0]) formData.append('photo_side', photoSide.files[0]);
  if (photoBack && photoBack.files && photoBack.files[0]) formData.append('photo_back', photoBack.files[0]);

  VitaFitAPI.postProgressFormData(formData)
    .then(function () {
      document.getElementById('step4').style.display = 'none';
      document.getElementById('successMessage').style.display = 'block';
      document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
      loadProgressHistory();
    })
    .catch(function () {
      alert('Progresul nu a putut fi salvat. Încearcă din nou.');
    });
}

window.addEventListener('DOMContentLoaded', function () {
  loadProgressHistory();
});
