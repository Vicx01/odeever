(function () {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdkbojzk";

  const isContactForm = (form) => {
    if (!form || !(form instanceof HTMLFormElement)) return false;
    if (form.id === "odr-contact-form") return true;
    if (form.closest(".odr-contact-section") || form.closest(".odr-form-card")) return true;
    if (form.closest("[class*='chaty']") || form.closest("[id*='chaty']")) return true;

    const hasEmail = form.querySelector("input[type='email'], input[name*='email']");
    const hasMessage = form.querySelector("textarea, input[name*='message']");
    return Boolean(hasEmail && hasMessage);
  };

  const ensureStatus = (form) => {
    let status = form.querySelector(".odr-form-status");
    if (!status) {
      status = document.createElement("div");
      status.className = "odr-form-status";
      form.appendChild(status);
    }
    return status;
  };

  const prepareForm = (form) => {
    if (!isContactForm(form)) return;
    form.setAttribute("action", FORMSPREE_ENDPOINT);
    form.setAttribute("method", "POST");

    if (!form.querySelector("input[name='source']")) {
      const source = document.createElement("input");
      source.type = "hidden";
      source.name = "source";
      source.value = `${window.location.pathname}${form.id ? "#" + form.id : ""}`;
      form.appendChild(source);
    }
  };

  const submitToFormspree = async (form) => {
    const status = ensureStatus(form);
    status.textContent = "Sending...";
    status.classList.remove("is-error", "is-success");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      });

      if (response.ok) {
        status.textContent = "Thanks! Your message has been sent.";
        status.classList.add("is-success");
        form.reset();
      } else {
        status.textContent = "Sorry, something went wrong. Please try again.";
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "Network error. Please try again.";
      status.classList.add("is-error");
    }
  };

  const initForms = () => {
    document.querySelectorAll("form").forEach((form) => prepareForm(form));
  };

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!isContactForm(form)) return;
    event.preventDefault();
    event.stopPropagation();
    prepareForm(form);
    submitToFormspree(form);
  }, true);

  const observer = new MutationObserver(() => initForms());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForms);
  } else {
    initForms();
  }
})();
