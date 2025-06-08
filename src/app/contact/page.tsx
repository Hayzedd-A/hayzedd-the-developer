"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import gsap from 'gsap';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

const ContactPage: React.FC = () => {
  const { currentThemes, theme } = useTheme();
  const currentTheme = currentThemes[theme];
  const { trackEvent, trackFormSubmit, trackClick } = useAnalytics();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Track page interactions
  useEffect(() => {
    trackEvent("engagement", "page", "contact-loaded");
  }, [trackEvent]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Track form field interactions
    trackEvent("interaction", "form-field", "input", name, undefined, {
      fieldName: name,
      valueLength: value.length,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: "loading", message: "Sending message..." });

    // Track form submission attempt
    trackEvent("interaction", "form", "submit-attempt", "contact-form");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form
        setFormData({ name: "", email: "", subject: "", message: "" });
        setFormStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });

        // Track successful submission
        trackFormSubmit("contact-form", true);
        trackEvent(
          "conversion",
          "contact",
          "form-submitted",
          "success",
          undefined,
          {
            name: formData.name,
            subject: formData.subject,
            messageLength: formData.message.length,
          }
        );
      } else {
        setFormStatus({
          type: "error",
          message: data.error || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });

      // Track failed submission
      trackFormSubmit("contact-form", false);
      trackEvent("error", "form", "submit-failed", "contact-form");
    }
    // Clear status after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: "idle", message: "" });
    }, 5000);
  };

  const handleSocialClick = (platform: string, url: string) => {
    trackClick(`social-${platform}`);
    trackEvent("interaction", "social", "click", platform, undefined, { url });
    window.open(url, "_blank");
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "adebayoazeez37@yahoo.com",
      href: "mailto:adebayoazeez37@yahoo.com",
      action: () => {
        trackClick("email-contact");
        trackEvent("interaction", "contact", "email-click");
      },
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+2348081602424",
      href: "tel:+2348081602424",
      action: () => {
        trackClick("phone-contact");
        trackEvent("interaction", "contact", "phone-click");
      },
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Ikotun, Lagos, Nigeria",
      href: "#",
      action: () => {
        trackClick("location-contact");
        trackEvent("interaction", "contact", "location-click");
      },
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      url: "https://github.com/Hayzedd-A",
      color: `${currentTheme.hover}`,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/azeez-adebayo-ola",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      url: "https://x.com/AdebayoAzeez3",
      color: "hover:text-blue-400",
    },
  ];

    useEffect(() => {
      const ctx = gsap.context(() => {
        // Header animation
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );

        // Contact info cards animation
        gsap.fromTo(
          contactInfoRef.current?.children || [],
          { opacity: 0, x: -100, scale: 0.8 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
            delay: 0.3,
          }
        );

        // Form animation
        gsap.fromTo(
          formRef.current,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.5 }
        );

        // Floating animation for contact cards
        gsap.to(contactInfoRef.current?.children || [], {
          y: -10,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.3,
        });
      }, containerRef);

      return () => ctx.revert();
    }, []);


  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${currentTheme.background} py-20`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            className={`text-4xl md:text-5xl font-bold ${currentTheme.text} mb-6`}
          >
            Get In{" "}
            <span
              className={`bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`}
            >
              Touch
            </span>
          </h1>
          <p
            className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto`}
          >
            Have a project in mind? Let's discuss how we can work together to
            bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            ref={contactInfoRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>
                Let's Start a Conversation
              </h2>
              <p className={`${currentTheme.textSecondary} mb-8`}>
                I'm always interested in hearing about new projects and
                opportunities. Whether you're a company looking to hire, or
                you're a fellow developer wanting to collaborate, I'd love to
                hear from you.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={item.action}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    // className={`p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border ${themeClasses.border} hover:shadow-xl transition-all duration-300`}
                    className={`flex items-center space-x-4 p-4 rounded-lg ${currentTheme.backgroundSecondary} ${currentTheme.hover} transition-all duration-300 group`}
                  >
                    <div className={`p-3 rounded-lg ${currentTheme.accent}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-sm ${currentTheme.textSecondary}`}>
                        {item.label}
                      </p>
                      <p
                        className={`text-lg font-medium ${currentTheme.text} group-hover:${currentTheme.accent} transition-colors`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`pt-8 border-t ${currentTheme.border}`}
            >
              <h3 className={`text-lg font-semibold ${currentTheme.text} mb-4`}>
                Follow Me
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.button
                      key={social.label}
                      onClick={() =>
                        handleSocialClick(
                          social.label.toLowerCase(),
                          social.url
                        )
                      }
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                      className={`p-3 rounded-lg ${currentTheme.backgroundSecondary} ${currentTheme.textSecondary} ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      title={social.label}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`${currentTheme.backgroundSecondary} rounded-2xl p-8`}
          >
            <h2 className={`text-2xl font-bold ${currentTheme.text} mb-6`}>
              Send Me a Message
            </h2>

            {/* Form Status */}
            {formStatus.type !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                  formStatus.type === "success"
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    : formStatus.type === "error"
                    ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                    : "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                }`}
              >
                {formStatus.type === "success" && (
                  <CheckCircle className="w-5 h-5" />
                )}
                {formStatus.type === "error" && (
                  <AlertCircle className="w-5 h-5" />
                )}
                {formStatus.type === "loading" && (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                <span>{formStatus.message}</span>
              </motion.div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Name *
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`}
                    />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border ${currentTheme.border} rounded-lg ${currentTheme.background} ${currentTheme.text} placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                  >
                    Email *
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.textSecondary}`}
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border ${currentTheme.border} rounded-lg ${currentTheme.background} ${currentTheme.text} placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border ${currentTheme.border} rounded-lg ${currentTheme.background} ${currentTheme.text} placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className={`block text-sm font-medium ${currentTheme.text} mb-2`}
                >
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare
                    className={`absolute left-3 top-3 w-5 h-5 ${currentTheme.textSecondary}`}
                  />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full pl-10 pr-4 py-3 border ${currentTheme.border} rounded-lg ${currentTheme.background} ${currentTheme.text} placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none`}
                    placeholder="Tell me about your project or idea..."
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={formStatus.type === "loading"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  formStatus.type === "loading"
                    ? "bg-gray-400 cursor-not-allowed"
                    : `${currentTheme.primary} ${currentTheme.primaryHover} focus:ring-4 ${currentTheme.ring}`
                }`}
              >
                {formStatus.type === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>

            <p
              className={`mt-4 text-sm ${currentTheme.textSecondary} text-center`}
            >
              I'll get back to you within 6 hours.
            </p>
          </motion.div>
        </div>

        {/* Additional CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div
            className={`bg-gradient-to-r ${currentTheme.backgroundSecondary} to-gray-100 dark:to-gray-700 rounded-2xl p-8 md:p-12`}
          >
            <h3
              className={`text-2xl md:text-3xl font-bold ${currentTheme.text} mb-4`}
            >
              Ready to Start Your Project?
            </h3>
            <p
              className={`text-lg ${currentTheme.textSecondary} mb-8 max-w-2xl mx-auto`}
            >
              Let's discuss your ideas and see how we can bring them to life.
              I'm here to help you build something amazing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => {
                  trackClick("cta-schedule-call");
                  trackEvent("interaction", "cta", "schedule-call-click");
                  // Add your scheduling logic here
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 ${currentTheme.primary} ${currentTheme.primaryHover}`}
              >
                Schedule a Call
              </motion.button>
              <motion.button
                onClick={() => {
                  trackClick("cta-view-portfolio");
                  trackEvent("interaction", "cta", "portfolio-click");
                  // Navigate to portfolio
                  window.location.href = "/portfolio";
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-lg font-medium ${currentTheme.text} ${currentTheme.background} border ${currentTheme.border} ${currentTheme.hover} transition-all duration-300`}
              >
                View My Work
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;

