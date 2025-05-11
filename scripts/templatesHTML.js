// Templates for different pages
export const templates = {
  home: `
    <section>
      <div class="container initial js-container">
        <h1 class="brand-name"><a class="brand-Url" href="#">Recipe Matrix</a></h1>
        <form class="js-form">
          <input type="text" placeholder="Search Recipe...">
          <ion-icon name="search-outline"></ion-icon>
        </form>
        <div class="search-results js-search-results"></div>
      </div>
    </section>
  `,
  login: `
    <section>
      <div class="container">
        <h1>Login</h1>
        <form id="login-form">
          <input type="text" id="username" placeholder="Username" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <button data-page="register">Register here</button></p>
      </div>
    </section>
  `,
  register: `
    <section>
      <div class="container">
        <h1>Register</h1>
        <form id="register-form">
          <input type="text" id="username" placeholder="Username" required>
          <input type="password" id="password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <button data-page="login">Login here</button></p>
      </div>
    </section>
  `,
  favorites: `
    <section>
      <div class="container js-container">
        <h1 class="brand-name"><a class="brand-Url" href="">Favorites</a></h1>
        <div class="favorites js-favorites"></div>
      </div>
    </section>
  `,
};