// CAREER SEARCH FUNCTION
async function getCareerInfo() {
    const career = document.getElementById('careerInput').value.trim();
  
    if (!career) {
      document.getElementById('career-result').innerHTML =
        '<p>Please enter a career to search.</p>';
      return;
    }
  
    const user = firebase.auth().currentUser;
    if (!user) {
      alert("You must be logged in to search careers.");
      return;
    }
  
    const token = await user.getIdToken();
  
    try {
      const res = await fetch('http://localhost:5050/api/careers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ career }),
      });
  
      if (!res.ok) throw new Error('Failed to fetch career info');
  
      const data = await res.json();
      displayCareerInfo(data);
    } catch (err) {
      console.error('Fetch error:', err.message);
      document.getElementById('career-result').innerHTML =
        '<p>⚠️ Something went wrong. Please try again.</p>';
    }
  }
  
  // DISPLAY RESULT FUNCTION
  function displayCareerInfo(data) {
    const resultDiv = document.getElementById('career-result');
  
    const stepsHtml = data.steps
      ? `<h3>Steps to Get There:</h3><ul>${data.steps.map(step => `<li>${step}</li>`).join('')}</ul>`
      : '';
  
    const dayHtml = `<h3>Day in the Life:</h3><p>${data.dayInLife || data.intro || 'No details available.'}</p>`;
  
    resultDiv.innerHTML = `<h2>${data.career}</h2>${stepsHtml}${dayHtml}`;
  }
  
  // AUTH MODAL ELEMENTS
  const authModal = document.getElementById('auth-modal');
  const authTitle = document.getElementById('auth-title');
  const authBtn = document.getElementById('auth-action-btn');
  const toggleText = document.getElementById('toggle-auth-mode');
  let isLogin = true;
  
  // SHOW MODAL
  function showModal() {
    authModal.classList.remove('hidden');
    authTitle.innerText = isLogin ? 'Login' : 'Register';
    authBtn.innerText = isLogin ? 'Login' : 'Register';
    toggleText.innerHTML = isLogin
      ? `Don't have an account? <span>Register</span>`
      : `Already have an account? <span>Login</span>`;
  }
  
  // MODAL EVENTS
  document.getElementById('loginBtn').onclick = () => {
    isLogin = true;
    showModal();
  };
  
  document.getElementById('registerBtn').onclick = () => {
    isLogin = false;
    showModal();
  };
  
  document.getElementById('close-auth').onclick = () => {
    authModal.classList.add('hidden');
  };
  
  toggleText.onclick = () => {
    isLogin = !isLogin;
    showModal();
  };
  
  // AUTH SUBMIT HANDLER
  authBtn.onclick = async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
  
    try {
      if (isLogin) {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        alert('Logged in!');
      } else {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        alert('Account created!');
      }
      authModal.classList.add('hidden');
    } catch (err) {
      alert(err.message);
    }
  };
  
  // TRACK LOGIN STATE
  firebase.auth().onAuthStateChanged((user) => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
  
    if (user) {
      console.log('🔐 Logged in as:', user.email);
      loginBtn.style.display = 'none';
      registerBtn.innerText = 'Logout';
      registerBtn.onclick = () => firebase.auth().signOut();
    } else {
      loginBtn.style.display = 'inline-block';
      registerBtn.innerText = 'Register';
      registerBtn.onclick = () => {
        isLogin = false;
        showModal();
      };
    }
  });
  
  // BURGER MENU TOGGLE
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  