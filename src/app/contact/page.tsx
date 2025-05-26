"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin, 
  Twitter,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

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

const ContactPage = () => {
  const { theme, isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const contactInfoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: "loading", message: "Sending message..." });

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

        // Success animation
        gsap.fromTo(
          formRef.current,
          { scale: 1 },
          { scale: 1.02, duration: 0.3, yoyo: true, repeat: 1 }
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
    }
    // Clear status after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: "idle", message: "" });
    }, 5000);
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hayzedd.dev@gmail.com",
      description: "Send me an email anytime",
      href: "mailto:hayzedd.dev@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+234 (0) 123 456 789",
      description: "Call me during business hours",
      href: "tel:+2340123456789",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Lagos, Nigeria",
      description: "Available for remote work",
      href: "#",
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "24-48 hours",
      description: "I'll get back to you quickly",
      href: "#",
    },
  ];

  const FAQ = [
    {
      question: "What's your typical response time?",
      answer:
        "I usually respond to emails within 24-48 hours. For urgent matters, feel free to mention it in your subject line.",
    },
    {
      question: "Do you work on weekends?",
      answer:
        "While I prefer to maintain work-life balance, I'm flexible for urgent projects and international clients in different time zones.",
    },
    {
      question: "What information should I include?",
      answer:
        "Please include project details, timeline, budget range, and any specific requirements. The more details, the better I can assist you.",
    },
    {
      question: "Do you offer free consultations?",
      answer:
        "Yes! I offer a free 30-minute consultation to discuss your project and see if we're a good fit for working together.",
    },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/Hayzedd-A", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/hayzedd",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/hayzedd_dev",
      label: "Twitter",
    },
  ];

  const getThemeClasses = () => {
    const themeMap = {
      blue: {
        primary: "bg-blue-600 hover:bg-blue-700",
        accent: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        gradient: "from-blue-600 to-blue-800",
      },
      purple: {
        primary: "bg-purple-600 hover:bg-purple-700",
        accent: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
        gradient: "from-purple-600 to-purple-800",
      },
      green: {
        primary: "bg-green-600 hover:bg-green-700",
        accent: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        gradient: "from-green-600 to-green-800",
      },
      orange: {
        primary: "bg-orange-600 hover:bg-orange-700",
        accent: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        gradient: "from-orange-600 to-orange-800",
      },
    };
    return themeMap[theme];
  };

  const themeClasses = getThemeClasses();

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${themeClasses.gradient} mb-6`}
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or want us to collaborate? I'd love to hear from
            you. Let's create something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div ref={contactInfoRef} className="space-y-6">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border ${themeClasses.border} hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${themeClasses.gradient}`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {info.title}
                        </h3>
                        <p
                          className={`font-medium ${themeClasses.accent} mb-1`}
                        >
                          {info.value}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Social Links */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Connect With Me
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg bg-gradient-to-r ${themeClasses.gradient} text-white hover:shadow-lg transition-all duration-300`}
                        aria-label={social.label}
                      >
                        <IconComponent className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${themeClasses.border} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-${theme}-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-lg border ${themeClasses.border} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-${theme}-500 focus:border-transparent transition-all duration-300`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 rounded-lg border ${themeClasses.border} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-${theme}-500 focus:border-transparent transition-all duration-300`}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border ${themeClasses.border} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-${theme}-500 focus:border-transparent transition-all duration-300 resize-none`}
                    placeholder="Tell me about your project or just say hello..."
                  />
                </div>

                {/* Form Status */}
                {formStatus.type !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center space-x-2 ${
                      formStatus.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                        : formStatus.type === "error"
                        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                        : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
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

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={formStatus.type === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full ${themeClasses.primary} text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
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
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Let's Build Something Great Together
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Whether you have a project in mind, need technical consultation,
              or just want to discuss the latest in web development, I'm always
              excited to connect with fellow developers and potential
              collaborators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${themeClasses.gradient} flex items-center justify-center`}
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Quick Response
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  I typically respond within 24-48 hours
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${themeClasses.gradient} flex items-center justify-center`}
                >
                  <User className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Personal Touch
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Every project gets my full attention and care
                </p>
              </div>
              <div className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${themeClasses.gradient} flex items-center justify-center`}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Quality Assured
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Committed to delivering exceptional results
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ.map((faq, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <h4 className={`font-semibold ${themeClasses.accent} mb-2`}>
                  {faq.question}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;

