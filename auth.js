import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

export let currentUser = null;

export function setAuthUI(user) {
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  const mainContent = document.getElementById('main-content');
  const bottomBar = document.querySelector('.bottom-bar');

  if (user) {
    loginForm.style.display = 'none';
    logoutBtn.style.display = '';
    userInfo.textContent = user.email + ' でログイン中';
    mainContent.style.display = '';
    if (bottomBar) bottomBar.style.display = '';
  } else {
    loginForm.style.display = '';
    logoutBtn.style.display = 'none';
    userInfo.textContent = '';
    mainContent.style.display = 'none';
    if (bottomBar) bottomBar.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth();

  // ログインボタン
  document.getElementById('login-btn').onclick = async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.textContent = '';
    if (!email || !password) {
      errEl.textContent = 'メールアドレスとパスワードを入力してください';
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      errEl.textContent = 'ログイン失敗: メールアドレスまたはパスワードが違います';
    }
  };

  // Enterキーでもログイン
  ['login-email', 'login-password'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('login-btn').click();
    });
  });

  // ログアウトボタン
  document.getElementById('logout-btn').onclick = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      alert('ログアウト失敗: ' + e.message);
    }
  };

  // 認証状態の監視
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    setAuthUI(user);
    if (window.onAuthChanged) window.onAuthChanged(user);
  });
});
