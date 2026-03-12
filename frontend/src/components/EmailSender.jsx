import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

const EmailSender = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);


useEffect(() => {
  console.log("Service:", import.meta.env.VITE_EMAIL_SERVICE_ID);
  console.log("Template:", import.meta.env.VITE_EMAIL_TEMPLATE_ID);
  console.log("Key:", import.meta.env.VITE_EMAIL_PUBLIC_KEY);
}, []);

  const sendEmail = () => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("❌ Please enter a valid email.");
      return;
    }

    setLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,     
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,    
        { 
            email: email,
            name: "Subscriber"
         }, 
        import.meta.env.VITE_EMAIL_PUBLIC_KEY      
      )
      .then(() => {
        setStatus("✅ Email sent successfully!");
        setEmail("");
        setLoading(false);
      })
      .catch((error) => {
        console.log("EmailJS Error:", error);
        setStatus("❌ Failed to send. Try again.");
        setLoading(false);
      });
  };

  return (
  <section className="w-full py-10 px-4">
    <div className="w-full max-w-md mx-auto">
      <p className="mb-4 text-center text-[#712941] text-sm sm:text-base font-bold">
        Want us to email you with the latest blockbuster news?
      </p>

      {/* Stack vertically on mobile, horizontal on sm+ */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full py-3 px-4 border border-[#c86989] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c86989] text-[#712941] placeholder:text-[#c86989]"
        />
        <button
          onClick={sendEmail}
          disabled={loading}
          className="w-full sm:w-auto whitespace-nowrap bg-[#712941] text-white px-6 py-3 rounded-lg
          hover:bg-[#c86989] active:scale-95 transition-all duration-150 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Subscribe"}
        </button>
      </div>

      {status && (
        <p className="mt-3 text-center text-sm text-[#712941]">{status}</p>
      )}
    </div>
  </section>
);
}

export default EmailSender;

 