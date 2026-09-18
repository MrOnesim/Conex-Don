import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendBookingNotification, sendNewsletterWelcome } from "@/lib/email";

const mail = vi.hoisted(() => ({ sendMail: vi.fn(), createTransport: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: mail.createTransport } }));

const booking = {
  reference: "CD-00042",
  name: "Alice Martin",
  email: "alice@example.test",
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("SMTP_HOST", "smtp.example.test");
  vi.stubEnv("SMTP_PORT", "587");
  vi.stubEnv("SMTP_USER", "test-user");
  vi.stubEnv("SMTP_PASS", "test-only-not-a-secret");
  vi.stubEnv("EMAIL_FROM", "site@example.test");
  vi.stubEnv("BOOKING_EMAIL", "booking@example.test");
  mail.createTransport.mockReturnValue({ sendMail: mail.sendMail });
  mail.sendMail.mockResolvedValue({ messageId: "test" });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("booking email", () => {
  it("preserves recipients, subject, reply address and text content", async () => {
    expect(await sendBookingNotification({ ...booking, message: "Bonjour & merci" })).toBe(true);
    expect(mail.createTransport).toHaveBeenCalledWith({
      host: "smtp.example.test", port: 587, secure: false,
      auth: { user: "test-user", pass: "test-only-not-a-secret" },
    });
    expect(mail.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: "site@example.test", to: "booking@example.test",
      subject: "Nouvelle demande de booking - CD-00042", replyTo: booking.email,
      text: expect.stringContaining("Bonjour & merci"),
      html: expect.stringContaining("Alice Martin"),
    }));
  });

  it.each([
    "reference", "name", "email", "organization", "phone", "country", "city",
    "eventType", "eventDate", "capacity", "budget", "message",
  ] as const)("escapes HTML in %s without changing the plain-text version", async (field) => {
    const unsafe = `<img src=x onerror="alert('test')"> & suite`;
    await sendBookingNotification({ ...booking, [field]: unsafe });
    const message = mail.sendMail.mock.calls[0][0];
    expect(message.html).not.toContain(unsafe);
    expect(message.html).toContain("&lt;img src=x onerror=&quot;alert(&#39;test&#39;)&quot;&gt; &amp; suite");
    expect(message.text).toContain(unsafe);
  });

  it("encodes query delimiters in mailto links", async () => {
    await sendBookingNotification({ ...booking, email: "alice?bcc=other@example.test", reference: "CD-42&body=injected" });
    const message = mail.sendMail.mock.calls[0][0];
    expect(message.html).toContain("mailto:alice%3Fbcc%3Dother%40example.test");
    expect(message.html).toContain("subject=Re%3A%20Booking%20CD-42%26body%3Dinjected");
    expect(message.replyTo).toBe("alice?bcc=other@example.test");
  });

  it("skips sending when SMTP is not configured", async () => {
    vi.stubEnv("SMTP_HOST", "");
    expect(await sendBookingNotification(booking)).toBe(false);
    expect(mail.createTransport).not.toHaveBeenCalled();
  });

  it("returns false if the SMTP transport fails", async () => {
    mail.sendMail.mockRejectedValue(new Error("SMTP unavailable"));
    expect(await sendBookingNotification(booking)).toBe(false);
  });

  it("uses implicit TLS for port 465", async () => {
    vi.stubEnv("SMTP_PORT", "465");
    await sendBookingNotification(booking);
    expect(mail.createTransport).toHaveBeenCalledWith(expect.objectContaining({ port: 465, secure: true }));
  });
});

describe("newsletter email", () => {
  it("preserves the welcome email interface", async () => {
    expect(await sendNewsletterWelcome("fan@example.test")).toBe(true);
    expect(mail.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: "fan@example.test", subject: "Bienvenue dans la communauté ALOBA 🌿",
      html: expect.stringContaining("Bienvenue dans ALOBA"),
    }));
  });
});
