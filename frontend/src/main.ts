import "./style.css";

const API = "http://127.0.0.1:8000/api";

let accessToken = localStorage.getItem("access");
let currentRole = localStorage.getItem("role");
let currentUsername = localStorage.getItem("username");

const app = document.querySelector<HTMLDivElement>("#app")!;

function decodeToken(token: string | null) {
  if (!token) return {};
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
}

function showLogin() {
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h1>MERZADO</h1>
        <p class="subtitle">B2B RFQ Marketplace</p>

        <h2>Login</h2>

        <form id="loginForm">
          <label>Username</label>
          <input id="username" type="text" required />

          <label>Password</label>
          <input id="password" type="password" required />

          <button type="submit">Login</button>

          <p id="loginMessage" class="message"></p>
        </form>
      </div>
    </div>
  `;

  document
    .querySelector<HTMLFormElement>("#loginForm")!
    .addEventListener("submit", login);
}

async function login(event: SubmitEvent) {
  event.preventDefault();

  const username = (
    document.querySelector<HTMLInputElement>("#username")!
  ).value;

  const password = (
    document.querySelector<HTMLInputElement>("#password")!
  ).value;

  const message = document.querySelector<HTMLParagraphElement>("#loginMessage")!;

  message.textContent = "Logging in...";

  try {
    const response = await fetch(`${API}/accounts/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent =
        data.detail || "Invalid username or password.";
      return;
    }

    accessToken = data.access;

    const payload = decodeToken(accessToken);

    currentRole = payload.role;
    currentUsername = payload.username || username;

    localStorage.setItem("access", accessToken || "");
    localStorage.setItem("role", currentRole || "");
    localStorage.setItem("username", currentUsername || "");

    showDashboard();
  } catch (error) {
    message.textContent = "Cannot connect to backend.";
  }
}

function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("role");
  localStorage.removeItem("username");

  accessToken = null;
  currentRole = null;
  currentUsername = null;

  showLogin();
}

function showDashboard() {
  if (!accessToken) {
    showLogin();
    return;
  }

  if (currentRole?.toLowerCase() === "buyer") {
    showBuyerDashboard();
  } else {
    showSupplierDashboard();
  }
}

function showBuyerDashboard() {
  app.innerHTML = `
    <nav class="navbar">
      <div>
        <strong>MERZADO</strong>
      </div>

      <div>
        <span>${currentUsername}</span>
        <button id="logoutBtn" class="logout">Logout</button>
      </div>
    </nav>

    <main class="container">
      <h1>Buyer Dashboard</h1>
      <p>Welcome, ${currentUsername}</p>

      <div class="cards">

        <div class="card">
          <h2>Create RFQ</h2>
          <p>Create a request for products or services.</p>
          <button id="createRfqBtn">Create RFQ</button>
        </div>

        <div class="card">
          <h2>My RFQs</h2>
          <p>View the RFQs you created.</p>
          <button id="myRfqBtn">View My RFQs</button>
        </div>

        <div class="card">
          <h2>Quotations</h2>
          <p>View supplier quotations.</p>
          <button id="buyerQuotesBtn">View Quotations</button>
        </div>

      </div>

      <div id="content"></div>
    </main>
  `;

  document
    .querySelector("#logoutBtn")!
    .addEventListener("click", logout);

  document
    .querySelector("#createRfqBtn")!
    .addEventListener("click", showCreateRfq);

  document
    .querySelector("#myRfqBtn")!
    .addEventListener("click", loadMyRfqs);

  document
    .querySelector("#buyerQuotesBtn")!
    .addEventListener("click", loadBuyerQuotations);
}

function showSupplierDashboard() {
  app.innerHTML = `
    <nav class="navbar">
      <div>
        <strong>MERZADO</strong>
      </div>

      <div>
        <span>${currentUsername}</span>
        <button id="logoutBtn" class="logout">Logout</button>
      </div>
    </nav>

    <main class="container">
      <h1>Supplier Dashboard</h1>
      <p>Welcome, ${currentUsername}</p>

      <div class="cards">

        <div class="card">
          <h2>Browse RFQs</h2>
          <p>Find requests from buyers.</p>
          <button id="browseRfqBtn">Browse RFQs</button>
        </div>

        <div class="card">
          <h2>My Quotations</h2>
          <p>View quotations you submitted.</p>
          <button id="myQuotesBtn">My Quotations</button>
        </div>

      </div>

      <div id="content"></div>
    </main>
  `;

  document
    .querySelector("#logoutBtn")!
    .addEventListener("click", logout);

  document
    .querySelector("#browseRfqBtn")!
    .addEventListener("click", loadAllRfqs);

  document
    .querySelector("#myQuotesBtn")!
    .addEventListener("click", loadMyQuotations);
}

function showCreateRfq() {
  const content = document.querySelector<HTMLDivElement>("#content")!;

  content.innerHTML = `
    <div class="section">
      <h2>Create RFQ</h2>

      <form id="rfqForm">

        <label>Product / Service Name</label>
        <input id="title" type="text" required />

        <label>Description</label>
        <textarea id="description" required></textarea>

        <label>Quantity</label>
        <input id="quantity" type="number" min="1" required />

        <label>Delivery Location</label>
        <input id="delivery_location" type="text" required />

        <label>Deadline</label>
        <input id="deadline" type="date" required />

        <button type="submit">Create RFQ</button>

        <p id="rfqMessage" class="message"></p>

      </form>
    </div>
  `;

  document
    .querySelector<HTMLFormElement>("#rfqForm")!
    .addEventListener("submit", createRfq);
}

async function createRfq(event: SubmitEvent) {
  event.preventDefault();

  const message = document.querySelector<HTMLParagraphElement>("#rfqMessage")!;

  const body = {
    title: (
      document.querySelector<HTMLInputElement>("#title")!
    ).value,

    description: (
      document.querySelector<HTMLTextAreaElement>("#description")!
    ).value,

    quantity: Number(
      document.querySelector<HTMLInputElement>("#quantity")!.value
    ),

    delivery_location: (
      document.querySelector<HTMLInputElement>("#delivery_location")!
    ).value,

    deadline: (
      document.querySelector<HTMLInputElement>("#deadline")!
    ).value,
  };

  message.textContent = "Creating RFQ...";

  try {
    const response = await fetch(`${API}/rfqs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = JSON.stringify(data);
      return;
    }

    message.textContent = "RFQ created successfully!";
  } catch {
    message.textContent = "Cannot connect to backend.";
  }
}

async function loadMyRfqs() {
  const content = document.querySelector<HTMLDivElement>("#content")!;

  content.innerHTML = `<div class="section"><h2>My RFQs</h2><p>Loading...</p></div>`;

  try {
    const response = await fetch(`${API}/rfqs/my/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      content.innerHTML = `<div class="section error">${JSON.stringify(
        data
      )}</div>`;
      return;
    }

    if (data.length === 0) {
      content.innerHTML = `
        <div class="section">
          <h2>My RFQs</h2>
          <p>No RFQs created yet.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="section">
        <h2>My RFQs</h2>
        ${data.map((rfq: any) => `
          <div class="item">
            <h3>${rfq.title}</h3>
            <p>${rfq.description}</p>
            <p><strong>Quantity:</strong> ${rfq.quantity}</p>
            <p><strong>Location:</strong> ${rfq.delivery_location}</p>
            <p><strong>Deadline:</strong> ${rfq.deadline}</p>
            <button onclick="window.viewRfqQuotes(${rfq.id})">
              View Quotations
            </button>
          </div>
        `).join("")}
      </div>
    `;
  } catch {
    content.innerHTML = `
      <div class="section error">
        Cannot connect to backend.
      </div>
    `;
  }
}

async function loadAllRfqs() {
  const content = document.querySelector<HTMLDivElement>("#content")!;

  content.innerHTML = `
    <div class="section">
      <h2>Available RFQs</h2>
      <p>Loading...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API}/rfqs/list/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      content.innerHTML = `<div class="section error">${JSON.stringify(
        data
      )}</div>`;
      return;
    }

    if (data.length === 0) {
      content.innerHTML = `
        <div class="section">
          <h2>Available RFQs</h2>
          <p>No RFQs available.</p>
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="section">
        <h2>Available RFQs</h2>

        ${data.map((rfq: any) => `
          <div class="item">
            <h3>${rfq.title}</h3>

            <p>${rfq.description}</p>

            <p>
              <strong>Quantity:</strong>
              ${rfq.quantity}
            </p>

            <p>
              <strong>Location:</strong>
              ${rfq.delivery_location}
            </p>

            <p>
              <strong>Deadline:</strong>
              ${rfq.deadline}
            </p>

            <button onclick="window.showQuotationForm(${rfq.id})">
              Submit Quotation
            </button>
          </div>
        `).join("")}
      </div>
    `;
  } catch {
    content.innerHTML = `
      <div class="section error">
        Cannot connect to backend.
      </div>
    `;
  }
}

function showQuotationForm(rfqId: number) {
  const content = document.querySelector<HTMLDivElement>("#content")!;

  content.innerHTML = `
    <div class="section">
      <h2>Submit Quotation</h2>

      <p>
        RFQ ID:
        <strong>${rfqId}</strong>
      </p>

      <form id="quotationForm">

        <label>Quoted Price</label>
        <input
          id="quoted_price"
          type="number"
          min="0"
          step="0.01"
          required
        />

        <label>Estimated Delivery (Days)</label>
        <input
          id="estimated_delivery_days"
          type="number"
          min="1"
          required
        />

        <label>Message / Notes</label>
        <textarea id="quote_message"></textarea>

        <button type="submit">
          Submit Quotation
        </button>

        <p id="quoteMessage" class="message"></p>

      </form>
    </div>
  `;

  document
    .querySelector<HTMLFormElement>("#quotationForm")!
    .addEventListener("submit", (event) =>
      createQuotation(event, rfqId)
    );
}

async function createQuotation(
  event: SubmitEvent,
  rfqId: number
) {
  event.preventDefault();

  const message =
    document.querySelector<HTMLParagraphElement>("#quoteMessage")!;

  const body = {
    rfq: rfqId,

    quoted_price: (
      document.querySelector<HTMLInputElement>("#quoted_price")!
    ).value,

    estimated_delivery_days: Number(
      document.querySelector<HTMLInputElement>(
        "#estimated_delivery_days"
      )!.value
    ),

    message: (
      document.querySelector<HTMLTextAreaElement>("#quote_message")!
    ).value,
  };

  message.textContent = "Submitting...";

  try {
    const response = await fetch(`${API}/quotations/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      message.textContent = JSON.stringify(data);
      return;
    }

    message.textContent = "Quotation submitted successfully!";
  } catch {
    message.textContent = "Cannot connect to backend.";
  }
}

async function loadMyQuotations() {
  const content = document.querySelector<HTMLDivElement>("#content")!;

  content.innerHTML = `
    <div class="section">
      <h2>My Quotations</h2>
      <p>Loading...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API}/quotations/my/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      content.innerHTML = `
        <div class="section error">
          ${JSON.stringify(data)}
        </div>
      `;
      return;
    }

    content.innerHTML = `
      <div class="section">
        <h2>My Quotations</h2>

        ${
          data.length === 0
            ? "<p>No quotations submitted yet.</p>"
            : data
                .map(
                  (quote: any) => `
                    <div class="item">
                      <h3>Quotation #${quote.id}</h3>

                      <p>
                        <strong>RFQ:</strong>
                        ${quote.rfq}
                      </p>

                      <p>
                        <strong>Price:</strong>
                        ₹${quote.quoted_price}
                      </p>

                      <p>
                        <strong>Delivery:</strong>
                        ${quote.estimated_delivery_days} days
                      </p>

                      <p>
                        <strong>Message:</strong>
                        ${quote.message || "No message"}
                      </p>
                    </div>
                  `
                )
                .join("")
        }
      </div>
    `;
  } catch {
    content.innerHTML = `
      <div class="section error">
        Cannot connect to backend.
      </div>
    `;
  }
}

async function loadBuyerQuotations() {
  const content = document.querySelector<HTMLDivElement>("#content")!;

  content.innerHTML = `
    <div class="section">
      <h2>Supplier Quotations</h2>
      <p>Enter an RFQ ID to view quotations.</p>

      <input
        id="buyerRfqId"
        type="number"
        min="1"
        placeholder="RFQ ID"
      />

      <button id="loadBuyerQuotes">
        View Quotations
      </button>

      <div id="buyerQuotesResult"></div>
    </div>
  `;

  document
    .querySelector("#loadBuyerQuotes")!
    .addEventListener("click", async () => {
      const id = Number(
        (
          document.querySelector<HTMLInputElement>("#buyerRfqId")!
        ).value
      );

      await loadQuotationsForRfq(id);
    });
}

async function loadQuotationsForRfq(rfqId: number) {
  const result =
    document.querySelector<HTMLDivElement>("#buyerQuotesResult")!;

  result.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `${API}/quotations/rfq/${rfqId}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      result.innerHTML = `
        <p class="error">
          ${JSON.stringify(data)}
        </p>
      `;
      return;
    }

    if (data.length === 0) {
      result.innerHTML = "<p>No quotations yet.</p>";
      return;
    }

    result.innerHTML = data
      .map(
        (quote: any) => `
          <div class="item">
            <h3>Supplier: ${quote.supplier}</h3>

            <p>
              <strong>Price:</strong>
              ₹${quote.quoted_price}
            </p>

            <p>
              <strong>Delivery:</strong>
              ${quote.estimated_delivery_days} days
            </p>

            <p>
              <strong>Message:</strong>
              ${quote.message || "No message"}
            </p>
          </div>
        `
      )
      .join("");
  } catch {
    result.innerHTML = `
      <p class="error">
        Cannot connect to backend.
      </p>
    `;
  }
}

(window as any).showQuotationForm = showQuotationForm;

(window as any).viewRfqQuotes = async (rfqId: number) => {
  await loadQuotationsForRfq(rfqId);
};

if (accessToken && currentRole) {
  showDashboard();
} else {
  showLogin();
}