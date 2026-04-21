import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

export let currentUser = null;

export function setAuthUI(user) {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userInfo = document.getElementById('user-info');
  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = '';
    userInfo.textContent = user.displayName ? `${user.displayName} でログイン中` : `ログイン中`;
  } else {
    loginBtn.style.display = '';
    logoutBtn.style.display = 'none';
    userInfo.textContent = '';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  document.getElementById('login-btn').onclick = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert('ログイン失敗: ' + e.message);
    }
  };
  document.getElementById('logout-btn').onclick = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      alert('ログアウト失敗: ' + e.message);
    }
  };
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    setAuthUI(user);
    if (window.onAuthChanged) window.onAuthChanged(user); // コールバックで他JSと連携
  });
});
