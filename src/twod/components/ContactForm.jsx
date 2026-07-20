import { useState } from "react";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/contact@shubodaya.dev";

export function ContactForm() {
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setStatus(null);

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload._subject = `Portfolio contact form: ${payload.fullname}`;
    payload._template = "table";
    payload._captcha = false;

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error();
      const result = await response.json().catch(() => null);
      if (result && String(result.success) === "false") throw new Error();
      form.reset();
      setStatus({ kind: "success", message: "Thank you. Your message has been sent." });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus({ kind: "error", message: "The message could not be sent right now. Please try again shortly." });
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      action="https://formsubmit.co/contact@shubodaya.dev"
      className="contact-form"
      method="POST"
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label htmlFor="contact-fullname">Full name</label>
        <input autoComplete="name" id="contact-fullname" name="fullname" required type="text" />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input autoComplete="email" id="contact-email" name="email" required type="email" />
      </div>
      <div className="field">
        <label htmlFor="contact-subject">Subject</label>
        <input autoComplete="off" id="contact-subject" name="subject" required type="text" />
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" required rows="4" />
      </div>
      <button className="button contact-form__submit" disabled={sending} type="submit">
        {sending ? "Sending..." : "Send message"}
      </button>
      {status ? (
        <p aria-live="polite" className={`contact-form__status contact-form__status--${status.kind}`} role="status">
          {status.message}
        </p>
      ) : null}
    </form>
  );
}
